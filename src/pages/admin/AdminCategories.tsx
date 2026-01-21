import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, FolderTree, ChevronRight, Package } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CategoryData {
  name: string;
  slug: string;
  order: number;
  familyCount: number;
  itemCount: number;
  families: FamilyData[];
}

interface FamilyData {
  name: string;
  slug: string;
  order: number;
  itemCount: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("category_name, category_slug, category_order, family_name, family_slug, family_order")
        .eq("active", true)
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true });

      if (error) throw error;

      // Group by category and family
      const categoryMap = new Map<string, CategoryData>();

      data?.forEach((item) => {
        if (!categoryMap.has(item.category_slug)) {
          categoryMap.set(item.category_slug, {
            name: item.category_name,
            slug: item.category_slug,
            order: item.category_order,
            familyCount: 0,
            itemCount: 0,
            families: [],
          });
        }

        const category = categoryMap.get(item.category_slug)!;
        category.itemCount++;

        const existingFamily = category.families.find(f => f.slug === item.family_slug);
        if (!existingFamily) {
          category.families.push({
            name: item.family_name,
            slug: item.family_slug,
            order: item.family_order,
            itemCount: 1,
          });
          category.familyCount++;
        } else {
          existingFamily.itemCount++;
        }
      });

      setCategories(Array.from(categoryMap.values()));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.families.some(fam => fam.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-lm-orange" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-lm-plum">
            Categorias do Catálogo
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize a estrutura hierárquica do catálogo
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">
                {categories.reduce((acc, cat) => acc + cat.familyCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Famílias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">
                {categories.reduce((acc, cat) => acc + cat.itemCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Itens Ativos</div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <Input
            placeholder="Buscar categorias ou famílias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          {searchQuery && (
            <Button variant="ghost" onClick={() => setSearchQuery("")}>
              Limpar
            </Button>
          )}
        </div>

        {/* Category List */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.slug}>
              <Collapsible
                open={expandedCategories.has(category.slug)}
                onOpenChange={() => toggleCategory(category.slug)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FolderTree className="w-5 h-5 text-lm-orange" />
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {category.familyCount} famílias · {category.itemCount} itens
                          </p>
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 transition-transform ${
                          expandedCategories.has(category.slug) ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid gap-2 pl-8">
                      {category.families.map((family) => (
                        <div
                          key={family.slug}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <span>{family.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {family.itemCount} itens
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Nenhuma categoria encontrada.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
