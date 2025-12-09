
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'; // Note: User might need to install dotenv or run with --env-file if using Node 20+

// Load environment variables
dotenv.config();

// Workaround for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

const JSON_PATH = path.resolve(__dirname, '../catalogo_locamulti_2026_pdf_ids_com_consumiveis.json');

async function importCatalog() {
    console.log('Starting catalog import...');

    if (!fs.existsSync(JSON_PATH)) {
        console.error(`Error: JSON file not found at ${JSON_PATH}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(JSON_PATH, 'utf-8');
    const data = JSON.parse(rawData);
    const catalog = data.catalog;

    console.log(`Found ${catalog.length} top-level categories.`);

    // Clear existing data? 
    // The migration script might handle structure, but we want to ensure we populate cleanly.
    // Ideally, we truncate or we just insert. If we insert with new UUIDs, we are fine, provided we cleaned up before.
    // The user should have run the migration which drops subfamilies and modifies categories.
    // However, categories might still have data. Best to clean up families and subfamilies to be safe.

    // Note: We cannot easily truncate 'categories' if other things depend on it without cascade.
    // But we are "Restructuring", so let's assume we can clean up 'families' and 'subfamilies'.
    // 'categories' we will try to Upsert or clean if possible.

    // For this script, we will insert new records. 

    for (const category of catalog) {
        console.log(`Processing Category: ${category.name} (${category.id})`);

        // 1. Upsert Category
        // We match by 'catalog_id' or 'slug'? Or just insert?
        // Since we are restructuring, let's look for existing category by slug or name to avoid duplicates if migration didn't clear them.
        // Or we can just insert newly.

        // Let's try to find existing category by slug
        let categoryId: string;

        const { data: existingCat, error: findCatError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category.slug)
            .single();

        if (existingCat) {
            // Update existing
            const { error: updateCatError } = await supabase
                .from('categories')
                .update({
                    name: category.name,
                    catalog_id: category.id,
                    display_order: parseInt(category.id, 10) * 10 // Example ordering
                })
                .eq('id', existingCat.id);

            if (updateCatError) {
                console.error(`Error updating category ${category.name}:`, updateCatError);
                continue;
            }
            categoryId = existingCat.id;
        } else {
            // Insert new
            const { data: newCat, error: insertCatError } = await supabase
                .from('categories')
                .insert({
                    name: category.name,
                    slug: category.slug,
                    catalog_id: category.id,
                    display_order: parseInt(category.id, 10) * 10
                })
                .select()
                .single();

            if (insertCatError) {
                console.error(`Error inserting category ${category.name}:`, insertCatError);
                continue;
            }
            categoryId = newCat.id;
        }

        // 2. Process Families
        if (category.families) {
            for (const family of category.families) {
                console.log(`  Processing Family: ${family.name} (${family.id})`);

                let familyId: string;

                // Check if family exists (by catalog_id and category_id to be safe)
                const { data: existingFam } = await supabase
                    .from('families')
                    .select('id')
                    .eq('catalog_id', family.id)
                    .eq('category_id', categoryId)
                    .maybeSingle();

                if (existingFam) {
                    familyId = existingFam.id;
                    // Update?
                    await supabase.from('families').update({
                        name: family.name,
                        slug: family.slug
                    }).eq('id', familyId);
                } else {
                    const { data: newFam, error: insertFamError } = await supabase
                        .from('families')
                        .insert({
                            category_id: categoryId,
                            name: family.name,
                            slug: family.slug,
                            catalog_id: family.id
                        })
                        .select()
                        .single();

                    if (insertFamError) {
                        console.error(`  Error inserting family ${family.name}:`, insertFamError);
                        continue;
                    }
                    familyId = newFam.id;
                }

                // 3. Process Subfamilies
                if (family.subfamilies) {
                    for (const subfamily of family.subfamilies) {
                        // Check if exists
                        const { data: existingSub } = await supabase
                            .from('subfamilies')
                            .select('id')
                            .eq('catalog_id', subfamily.id)
                            .eq('family_id', familyId)
                            .maybeSingle();

                        if (!existingSub) {
                            const { error: insertSubError } = await supabase
                                .from('subfamilies')
                                .insert({
                                    family_id: familyId,
                                    description: subfamily.description,
                                    is_consumable: subfamily.is_consumable,
                                    catalog_id: subfamily.id
                                });

                            if (insertSubError) {
                                console.error(`    Error inserting subfamily ${subfamily.id}:`, insertSubError);
                            }
                        } else {
                            // Update
                            await supabase.from('subfamilies').update({
                                description: subfamily.description,
                                is_consumable: subfamily.is_consumable
                            }).eq('id', existingSub.id);
                        }
                    }
                }
            }
        }
    }

    console.log('Import completed.');
}

importCatalog().catch(console.error);
