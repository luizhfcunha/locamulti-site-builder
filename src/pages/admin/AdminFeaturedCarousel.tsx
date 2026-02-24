import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, GripVertical, Loader2, Plus, RefreshCw, Save, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

// Componente para item arrastavel
function SortableItem({
  row,
  index,
  item,
  onRemove,
  onClickToReplace,
}: {
  row: FeaturedRow;
  index: number;
  item: EquipmentOption | undefined;
  onRemove: (index: number) => void;
  onClickToReplace: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.catalog_item_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  if (!item) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors ${
        isDragging ? "shadow-lg ring-2 ring-lm-orange" : ""
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Ordem */}
      <div className="w-8 h-8 rounded-full bg-lm-orange/10 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-lm-orange">{index + 1}</span>
      </div>

      {/* Item clicavel para substituir */}
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors"
        onClick={() => onClickToReplace(index)}
        title="Clique para substituir este equipamento"
      >
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

        {/* Icone de substituir */}
        <RefreshCw className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100" />
      </div>

      {/* Remover */}
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
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

  // Modal para substituir item
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [replaceSearch, setReplaceSearch] = useState("");
  const [replaceCategoryFilter, setReplaceCategoryFilter] = useState<string>("all");

  const selectedIds = useMemo(() => new Set(rows.map((row) => row.catalog_item_id)), [rows]);

  // Configurar sensores do drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Equipamentos filtrados para adicionar
  const filteredOptions = useMemo(() => {
    return options.filter((item) => {
      if (selectedIds.has(item.id)) return false;
      if (categoryFilter !== "all" && item.category_slug !== categoryFilter) return false;
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

  // Equipamentos filtrados para substituicao (exclui apenas o item atual, nao todos os selecionados)
  const replaceFilteredOptions = useMemo(() => {
    if (replaceIndex === null) return [];
    const currentItemId = rows[replaceIndex]?.catalog_item_id;

    return options.filter((item) => {
      // Permitir o item atual (para manter a selecao)
      if (item.id === currentItemId) return false;
      // Excluir outros itens ja selecionados
      if (selectedIds.has(item.id)) return false;
      if (replaceCategoryFilter !== "all" && item.category_slug !== replaceCategoryFilter) return false;
      if (replaceSearch) {
        const search = replaceSearch.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(search);
        const matchName = item.name?.toLowerCase().includes(search);
        const matchDesc = item.description?.toLowerCase().includes(search);
        if (!matchCode && !matchName && !matchDesc) return false;
      }
      return true;
    });
  }, [options, selectedIds, replaceCategoryFilter, replaceSearch, replaceIndex, rows]);

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

  const replaceItem = (newItemId: string) => {
    if (replaceIndex === null) return;

    setRows((prev) =>
      prev.map((row, idx) =>
        idx === replaceIndex ? { ...row, catalog_item_id: newItemId } : row
      )
    );

    const newItem = options.find((o) => o.id === newItemId);
    toast({
      title: "Item substituido",
      description: `Equipamento alterado para: ${newItem?.name || newItem?.description || "Novo item"}`,
    });

    setReplaceModalOpen(false);
    setReplaceIndex(null);
    setReplaceSearch("");
    setReplaceCategoryFilter("all");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setRows((items) => {
        const oldIndex = items.findIndex((item) => item.catalog_item_id === active.id);
        const newIndex = items.findIndex((item) => item.catalog_item_id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, display_order: idx + 1 }));
      });
    }
  };

  const openReplaceModal = (index: number) => {
    setReplaceIndex(index);
    setReplaceSearch("");
    setReplaceCategoryFilter("all");
    setReplaceModalOpen(true);
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
            Arraste para reordenar. Clique no item para substituir.
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={rows.map((r) => r.catalog_item_id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {rows.map((row, index) => (
                      <SortableItem
                        key={row.catalog_item_id}
                        row={row}
                        index={index}
                        item={getOptionById(row.catalog_item_id)}
                        onRemove={removeRow}
                        onClickToReplace={openReplaceModal}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
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
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name || item.description}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.code} - {item.category_name}
                          </p>
                        </div>
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

      {/* Modal para substituir item */}
      <Dialog open={replaceModalOpen} onOpenChange={setReplaceModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Substituir Equipamento</DialogTitle>
          </DialogHeader>

          {/* Item atual */}
          {replaceIndex !== null && (
            <div className="p-3 bg-muted/50 rounded-lg mb-4">
              <p className="text-xs text-muted-foreground mb-2">Item atual (posicao {replaceIndex + 1}):</p>
              {(() => {
                const currentItem = getOptionById(rows[replaceIndex]?.catalog_item_id);
                if (!currentItem) return null;
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {currentItem.image_url ? (
                        <img
                          src={currentItem.image_url}
                          alt={currentItem.name || currentItem.description}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px]">
                          Sem img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{currentItem.name || currentItem.description}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentItem.code} - {currentItem.category_name}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Filtros do modal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipamento..."
                value={replaceSearch}
                onChange={(e) => setReplaceSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={replaceCategoryFilter} onValueChange={setReplaceCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de equipamentos para substituir */}
          <div className="flex-1 overflow-y-auto border rounded-lg">
            {replaceFilteredOptions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum equipamento encontrado.</p>
              </div>
            ) : (
              <div className="divide-y">
                {replaceFilteredOptions.slice(0, 50).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-lm-orange/10 cursor-pointer transition-colors"
                    onClick={() => replaceItem(item.id)}
                  >
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
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name || item.description}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.code} - {item.category_name}
                      </p>
                    </div>
                    <RefreshCw className="w-4 h-4 text-lm-orange" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
