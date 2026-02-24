import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Loader2, Plus, Save, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EquipmentOption {
  id: string;
  code: string;
  name: string;
  description: string;
  category_slug: string;
  category_name: string;
  family_name: string;
  image_url: string | null;
}

interface CategoryOption {
  slug: string;
  name: string;
}

interface FeaturedRow {
  id?: string;
  catalog_item_id: string;
  display_order: number;
  active: boolean;
}

export default function AdminFeaturedCarousel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<EquipmentOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [rows, setRows] = useState<FeaturedRow[]>([]);

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAvailable, setShowAvailable] = useState(false);

  const selectedIds = useMemo(() => new Set(rows.map((row) => row.catalog_item_id)), [rows]);

  // Equipamentos filtrados para adicionar
  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      // Excluir itens ja selecionados
      if (selectedIds.has(item.id)) return false;

      // Filtro por categoria
      if (categoryFilter !== "all" && item.category_slug !== categoryFilter) return false;

      // Filtro por texto
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(search);
        const matchName = item.name?.toLowerCase().includes(search);
        const matchDesc = item.description?.toLowerCase().includes(search);
        if (!matchCode && !matchName && !matchDesc) return false;
      }

      return true;
    });
  }, [options, selectedIds, categoryFilter, searchTerm]);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [optionsResponse, featuredResponse, categoriesResponse] = await Promise.all([
        supabase
          .from("catalog_items")
          .select("id, code, name, description, category_slug, category_name, family_name, image_url")
          .eq("active", true)
          .eq("item_type", "equipamento")
          .order("category_order", { ascending: true })
          .order("family_order", { ascending: true })
          .order("item_order", { ascending: true }),
        supabase
          .from("featured_carousel_items")
          .select("id, catalog_item_id, display_order, active")
          .order("display_order", { ascending: true }),
        supabase
          .from("catalog_categories")
          .select("slug, name")
          .eq("active", true)
          .order("display_order", { ascending: true }),
      ]);

      if (optionsResponse.error) throw optionsResponse.error;
      if (featuredResponse.error) throw featuredResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setOptions((optionsResponse.data ?? []) as EquipmentOption[]);
      setRows((featuredResponse.data ?? []) as FeaturedRow[]);
      setCategories((categoriesResponse.data ?? []) as CategoryOption[]);
    } catch (error) {
      console.error("Error loading featured carousel admin data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Nao foi possivel carregar a configuracao do carrossel.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = (itemId: string) => {
    setRows((prev) => [
      ...prev,
      {
        catalog_item_id: itemId,
        display_order: prev.length + 1,
        active: true,
      },
    ]);
    toast({
      title: "Item adicionado",
      description: "O equipamento foi adicionado ao carrossel.",
    });
  };

  const removeRow = (index: number) => {
    setRows((prev) =>
      prev
        .filter((_, rowIndex) => rowIndex !== index)
        .map((row, rowIndex) => ({ ...row, display_order: rowIndex + 1 })),
    );
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rows.length) return;

    setRows((prev) => {
      const newRows = [...prev];
      [newRows[index], newRows[newIndex]] = [newRows[newIndex], newRows[index]];
      return newRows.map((row, idx) => ({ ...row, display_order: idx + 1 }));
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const normalized = [...rows]
        .sort((a, b) => a.display_order - b.display_order)
        .map((row, index) => ({
          catalog_item_id: row.catalog_item_id,
          display_order: index + 1,
          active: row.active,
        }));

      // Deletar todos os existentes
      const { error: deleteError } = await supabase
        .from("featured_carousel_items")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (deleteError) throw deleteError;

      if (normalized.length > 0) {
        const { error: insertError } = await supabase
          .from("featured_carousel_items")
          .insert(normalized);

        if (insertError) throw insertError;
      }

      toast({
        title: "Carrossel atualizado",
        description: `${normalized.length} equipamento(s) configurado(s) com sucesso.`,
      });

      await loadData();
    } catch (error) {
      console.error("Error saving featured carousel:", error);
      toast({
        title: "Erro ao salvar",
        description: "Nao foi possivel salvar a configuracao do carrossel.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getOptionById = (id: string) => options.find((item) => item.id === id);

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
          <h1 className="font-heading text-3xl font-bold text-lm-plum">Carrossel da Home</h1>
          <p className="text-muted-foreground mt-1">
            Selecione os equipamentos em destaque e ajuste a ordem de exibicao.
          </p>
        </div>

        {/* Card: Itens Atuais no Carrossel */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                Itens no Carrossel
                <Badge variant="secondary">{rows.length}</Badge>
              </CardTitle>
              <Button onClick={saveChanges} disabled={saving} size="sm" className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {rows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum equipamento no carrossel.</p>
                <p className="text-sm">Use a busca abaixo para adicionar equipamentos.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rows.map((row, index) => {
                  const item = getOptionById(row.catalog_item_id);
                  if (!item) return null;

                  return (
                    <div
                      key={`${row.id ?? "new"}-${index}`}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      {/* Ordem */}
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveRow(index, "up")}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{row.display_order}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveRow(index, "down")}
                          disabled={index === rows.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Imagem */}
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name || item.description}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            Sem img
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name || item.description}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.code} - {item.category_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{item.family_name}</p>
                      </div>

                      {/* Remover */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeRow(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Buscar e Adicionar */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Adicionar Equipamentos</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAvailable(!showAvailable)}
                className="gap-2"
              >
                {showAvailable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {showAvailable ? "Ocultar" : "Mostrar"} lista
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou codigo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contador */}
            <div className="text-sm text-muted-foreground">
              {filteredOptions.length} equipamento(s) disponivel(is)
              {searchTerm && ` para "${searchTerm}"`}
              {categoryFilter !== "all" && ` na categoria selecionada`}
            </div>

            {/* Lista de equipamentos disponiveis */}
            {showAvailable && (
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {filteredOptions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum equipamento encontrado.</p>
                    {(searchTerm || categoryFilter !== "all") && (
                      <Button
                        variant="link"
                        onClick={() => {
                          setSearchTerm("");
                          setCategoryFilter("all");
                        }}
                      >
                        Limpar filtros
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredOptions.slice(0, 50).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                      >
                        {/* Imagem */}
                        <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name || item.description}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                              Sem img
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name || item.description}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.code} - {item.category_name}
                          </p>
                        </div>

                        {/* Adicionar */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(item.id)}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Adicionar
                        </Button>
                      </div>
                    ))}
                    {filteredOptions.length > 50 && (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        Mostrando 50 de {filteredOptions.length} resultados. Use os filtros para refinar.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
