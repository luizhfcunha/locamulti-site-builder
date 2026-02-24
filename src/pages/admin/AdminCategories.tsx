import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  ChevronRight,
  FolderTree,
  Loader2,
  Package,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/hooks/use-toast";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  category_no: number;
  display_order: number;
  active: boolean;
};

type FamilyRow = {
  id: string;
  category_slug: string;
  slug: string;
  name: string;
  family_no: string;
  display_order: number;
  active: boolean;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [families, setFamilies] = useState<FamilyRow[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newFamilyByCategory, setNewFamilyByCategory] = useState<Record<string, string>>({});

  useEffect(() => {
    void fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: categoriesData, error: categoriesError }, { data: familiesData, error: familiesError }] =
        await Promise.all([
          supabase.from("catalog_categories").select("*").order("display_order", { ascending: true }),
          supabase.from("catalog_families").select("*").order("display_order", { ascending: true }),
        ]);

      if (categoriesError) throw categoriesError;
      if (familiesError) throw familiesError;

      setCategories(categoriesData || []);
      setFamilies(familiesData || []);
    } catch (error) {
      console.error("Error fetching master catalog structure:", error);
      toast({
        title: "Erro ao carregar estrutura",
        description: "Nao foi possivel carregar categorias e familias.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return categories
      .map((category) => {
        const categoryFamilies = families
          .filter((family) => family.category_slug === category.slug)
          .sort((a, b) => a.display_order - b.display_order);

        const matchesSearch =
          query.length === 0 ||
          category.name.toLowerCase().includes(query) ||
          categoryFamilies.some((family) => family.name.toLowerCase().includes(query));

        return {
          ...category,
          families: categoryFamilies,
          matchesSearch,
        };
      })
      .filter((entry) => entry.matchesSearch);
  }, [categories, families, searchQuery]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;

    setSaving(true);
    try {
      const slug = slugify(name);
      const nextOrder = (categories.at(-1)?.display_order || 0) + 1;
      const nextNo = (categories.at(-1)?.category_no || 0) + 1;

      const { error } = await supabase.from("catalog_categories").insert({
        name,
        slug,
        display_order: nextOrder,
        category_no: nextNo,
        active: true,
      });
      if (error) throw error;

      toast({ title: "Categoria criada", description: "Nova categoria criada com sucesso." });
      setNewCategoryName("");
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel criar categoria.";
      toast({ title: "Erro ao criar categoria", description: message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEditCategory = async (category: CategoryRow) => {
    const name = window.prompt("Novo nome da categoria:", category.name)?.trim();
    if (!name) return;
    const orderRaw = window.prompt("Nova ordem da categoria:", String(category.display_order));
    if (!orderRaw) return;

    const display_order = Number(orderRaw);
    if (!Number.isFinite(display_order) || display_order < 1) return;

    try {
      const { error } = await supabase
        .from("catalog_categories")
        .update({ name, display_order, updated_at: new Date().toISOString() })
        .eq("id", category.id);
      if (error) throw error;
      toast({ title: "Categoria atualizada" });
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar categoria.";
      toast({ title: "Erro ao atualizar categoria", description: message, variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (category: CategoryRow) => {
    const { count, error: countError } = await supabase
      .from("catalog_items")
      .select("id", { count: "exact", head: true })
      .eq("category_slug", category.slug);

    if (countError) {
      toast({ title: "Erro ao validar exclusao", description: countError.message, variant: "destructive" });
      return;
    }

    if ((count || 0) > 0) {
      toast({
        title: "Exclusao bloqueada",
        description: "Essa categoria possui itens vinculados. Remova ou mova os itens antes de excluir.",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(`Deseja excluir a categoria "${category.name}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("catalog_categories").delete().eq("id", category.id);
      if (error) throw error;
      toast({ title: "Categoria excluida" });
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel excluir categoria.";
      toast({ title: "Erro ao excluir categoria", description: message, variant: "destructive" });
    }
  };

  const handleCreateFamily = async (category: CategoryRow) => {
    const value = (newFamilyByCategory[category.slug] || "").trim();
    if (!value) return;

    try {
      const slug = slugify(value);
      const existingFamilies = families.filter((f) => f.category_slug === category.slug);
      const nextOrder = (existingFamilies.at(-1)?.display_order || 0) + 1;
      const nextNo = String((existingFamilies.length || 0) + 1).padStart(2, "0");

      const { error } = await supabase.from("catalog_families").insert({
        category_slug: category.slug,
        name: value,
        slug,
        family_no: nextNo,
        display_order: nextOrder,
        active: true,
      });
      if (error) throw error;

      toast({ title: "Familia criada", description: `Familia criada em ${category.name}.` });
      setNewFamilyByCategory((prev) => ({ ...prev, [category.slug]: "" }));
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel criar familia.";
      toast({ title: "Erro ao criar familia", description: message, variant: "destructive" });
    }
  };

  const handleEditFamily = async (family: FamilyRow) => {
    const name = window.prompt("Novo nome da familia:", family.name)?.trim();
    if (!name) return;
    const orderRaw = window.prompt("Nova ordem da familia:", String(family.display_order));
    if (!orderRaw) return;

    const display_order = Number(orderRaw);
    if (!Number.isFinite(display_order) || display_order < 1) return;

    try {
      const { error } = await supabase
        .from("catalog_families")
        .update({ name, display_order, updated_at: new Date().toISOString() })
        .eq("id", family.id);
      if (error) throw error;
      toast({ title: "Familia atualizada" });
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel atualizar familia.";
      toast({ title: "Erro ao atualizar familia", description: message, variant: "destructive" });
    }
  };

  const handleDeleteFamily = async (family: FamilyRow) => {
    const { count, error: countError } = await supabase
      .from("catalog_items")
      .select("id", { count: "exact", head: true })
      .eq("category_slug", family.category_slug)
      .eq("family_slug", family.slug);

    if (countError) {
      toast({ title: "Erro ao validar exclusao", description: countError.message, variant: "destructive" });
      return;
    }

    if ((count || 0) > 0) {
      toast({
        title: "Exclusao bloqueada",
        description: "Essa familia possui itens vinculados. Remova ou mova os itens antes de excluir.",
        variant: "destructive",
      });
      return;
    }

    const confirmed = window.confirm(`Deseja excluir a familia "${family.name}"?`);
    if (!confirmed) return;

    try {
      const { error } = await supabase.from("catalog_families").delete().eq("id", family.id);
      if (error) throw error;
      toast({ title: "Familia excluida" });
      await fetchData();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel excluir familia.";
      toast({ title: "Erro ao excluir familia", description: message, variant: "destructive" });
    }
  };

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
          <h1 className="font-heading text-3xl font-bold text-lm-plum">Categorias e Familias</h1>
          <p className="text-muted-foreground mt-1">Fonte unica de estrutura para o catalogo.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nova Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Compactacao e Concreto"
              />
              <Button onClick={() => void handleCreateCategory()} disabled={saving}>
                <Plus className="w-4 h-4 mr-2" />
                Criar
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Input
            placeholder="Buscar categorias ou familias..."
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categorias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">{families.length}</div>
              <div className="text-sm text-muted-foreground">Familias</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-lm-orange">
                {categoryCards.reduce((acc, cat) => acc + cat.families.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Familias filtradas</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {categoryCards.map((category) => (
            <Card key={category.id}>
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
                            slug: {category.slug} | ordem: {category.display_order} | no: {category.category_no}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleEditCategory(category);
                          }}
                          title={`Editar categoria ${category.name}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            void handleDeleteCategory(category);
                          }}
                          title={`Excluir categoria ${category.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <ChevronRight
                          className={`w-5 h-5 transition-transform ${
                            expandedCategories.has(category.slug) ? "rotate-90" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid gap-2">
                      {category.families.map((family) => (
                        <div
                          key={family.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p>{family.name}</p>
                              <p className="text-xs text-muted-foreground">
                                slug: {family.slug} | ordem: {family.display_order} | no: {family.family_no}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => void handleEditFamily(family)}
                              title={`Editar familia ${family.name}`}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => void handleDeleteFamily(family)}
                              title={`Excluir familia ${family.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border rounded-lg p-3 bg-background/60">
                      <Label>Nova familia em "{category.name}"</Label>
                      <div className="mt-2 flex gap-2">
                        <Input
                          value={newFamilyByCategory[category.slug] || ""}
                          onChange={(e) =>
                            setNewFamilyByCategory((prev) => ({
                              ...prev,
                              [category.slug]: e.target.value,
                            }))
                          }
                          placeholder="Ex: Marteletes e Rompedores"
                        />
                        <Button onClick={() => void handleCreateFamily(category)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Criar familia
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {categoryCards.length === 0 && (
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
