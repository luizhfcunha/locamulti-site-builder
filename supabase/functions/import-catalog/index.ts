import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Catalog data structure
interface Subfamily {
  id: string;
  description: string;
  is_consumable: boolean;
}

interface Family {
  id: string;
  name: string;
  slug: string;
  subfamilies: Subfamily[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  families: Family[];
}

interface CatalogData {
  catalog: Category[];
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user is admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get catalog data from request body
    const catalogData: CatalogData = await req.json();

    if (!catalogData.catalog || !Array.isArray(catalogData.catalog)) {
      return new Response(JSON.stringify({ error: "Invalid catalog data format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Start transaction - clear existing data
    console.log("Clearing existing data...");
    
    // Delete in order: subfamilies -> families -> categories (respecting FK constraints)
    // But first, update products to remove references
    await supabase.from("products").update({ 
      category_id: null, 
      family_id: null, 
      subcategory_id: null 
    }).neq("id", "00000000-0000-0000-0000-000000000000");

    const { error: delSubfamilies } = await supabase.from("subfamilies").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delSubfamilies) console.log("Error deleting subfamilies:", delSubfamilies);

    const { error: delFamilies } = await supabase.from("families").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delFamilies) console.log("Error deleting families:", delFamilies);

    const { error: delCategories } = await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delCategories) console.log("Error deleting categories:", delCategories);

    const stats = {
      categories: 0,
      families: 0,
      subfamilies: 0,
      errors: [] as string[],
    };

    // Process each category
    for (const category of catalogData.catalog) {
      console.log(`Processing category: ${category.name}`);
      
      // Insert category
      const { data: catData, error: catError } = await supabase
        .from("categories")
        .insert({
          name: category.name,
          slug: category.slug,
          catalog_id: category.id,
          display_order: parseInt(category.id) * 10,
        })
        .select("id")
        .single();

      if (catError) {
        stats.errors.push(`Category ${category.name}: ${catError.message}`);
        continue;
      }

      stats.categories++;
      const categoryUuid = catData.id;

      // Process families within this category
      for (const family of category.families) {
        console.log(`  Processing family: ${family.name}`);
        
        // Extract display order from family id (e.g., "1.2" -> 2)
        const familyOrder = parseInt(family.id.split(".")[1]) || 1;

        const { data: famData, error: famError } = await supabase
          .from("families")
          .insert({
            category_id: categoryUuid,
            name: family.name,
            slug: family.slug,
            catalog_id: family.id,
            display_order: familyOrder,
          })
          .select("id")
          .single();

        if (famError) {
          stats.errors.push(`Family ${family.name}: ${famError.message}`);
          continue;
        }

        stats.families++;
        const familyUuid = famData.id;

        // Process subfamilies within this family
        for (const subfamily of family.subfamilies) {
          // Extract display order from subfamily id (e.g., "1.2.3" -> 3)
          const subOrder = parseInt(subfamily.id.split(".")[2]) || 1;
          
          // Create a name from the description (first part, truncated)
          const subfamilyName = subfamily.description.split(" / ")[0].substring(0, 200);

          const { error: subError } = await supabase
            .from("subfamilies")
            .insert({
              family_id: familyUuid,
              name: subfamilyName,
              description: subfamily.description,
              is_consumable: subfamily.is_consumable || false,
              catalog_id: subfamily.id,
              slug: subfamily.id.replace(/\./g, "-"),
              display_order: subOrder,
            });

          if (subError) {
            stats.errors.push(`Subfamily ${subfamily.id}: ${subError.message}`);
            continue;
          }

          stats.subfamilies++;
        }
      }
    }

    console.log("Import completed:", stats);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Catalog imported successfully",
        stats,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    console.error("Error importing catalog:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
