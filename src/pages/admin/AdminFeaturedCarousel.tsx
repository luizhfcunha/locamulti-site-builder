import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

interface EquipmentOption {
  id: string;
  code: string;
  name: string;
  description: string;
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
  const [rows, setRows] = useState<FeaturedRow[]>([]);

  const selectedIds = useMemo(() => new Set(rows.map((row) => row.catalog_item_id)), [rows]);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [optionsResponse, featuredResponse] = await Promise.all([
        supabase
          .from("catalog_items")
          .select("id, code, name, description")
          .eq("active", true)
          .eq("item_type", "equipamento")
          .order("category_order", { ascending: true })
          .order("family_order", { ascending: true })
          .order("item_order", { ascending: true }),
        supabase
          .from("featured_carousel_items")
          .select("id, catalog_item_id, display_order, active")
          .order("display_order", { ascending: true }),
      ]);

      if (optionsResponse.error) throw optionsResponse.error;
      if (featuredResponse.error) throw featuredResponse.error;

      setOptions((optionsResponse.data ?? []) as EquipmentOption[]);
      setRows((featuredResponse.data ?? []) as FeaturedRow[]);
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

  const addRow = () => {
    const available = options.find((option) => !selectedIds.has(option.id));
    if (!available) {
      toast({
        title: "Sem itens disponiveis",
        description: "Todos os equipamentos ativos ja estao selecionados.",
      });
      return;
    }

    setRows((prev) => [
      ...prev,
      {
        catalog_item_id: available.id,
        display_order: prev.length + 1,
        active: true,
      },
    ]);
  };

  const removeRow = (index: number) => {
    setRows((prev) =>
      prev
        .filter((_, rowIndex) => rowIndex !== index)
        .map((row, rowIndex) => ({ ...row, display_order: rowIndex + 1 })),
    );
  };

  const updateRow = (index: number, patch: Partial<FeaturedRow>) => {
    setRows((prev) =>
      prev.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row)),
    );
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

      const existingIds = rows
        .map((row) => row.id)
        .filter((value): value is string => typeof value === "string");

      if (existingIds.length > 0) {
        const { error: deleteError } = await supabase
          .from("featured_carousel_items")
          .delete()
          .in("id", existingIds);

        if (deleteError) throw deleteError;
      }

      if (normalized.length > 0) {
        const { error: insertError } = await supabase
          .from("featured_carousel_items")
          .insert(normalized);

        if (insertError) throw insertError;
      }

      toast({
        title: "Carrossel atualizado",
        description: "A configuracao de destaque foi salva com sucesso.",
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Itens em destaque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rows.map((row, index) => {
              const option = options.find((item) => item.id === row.catalog_item_id);
              const optionLabel = option?.name || option?.description || option?.code || "Item";

              return (
                <div key={`${row.id ?? "new"}-${index}`} className="grid grid-cols-12 gap-3 items-end border rounded-md p-3">
                  <div className="col-span-7">
                    <Label>Equipamento</Label>
                    <Select
                      value={row.catalog_item_id}
                      onValueChange={(value) => updateRow(index, { catalog_item_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um equipamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.code} - {item.name || item.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">{optionLabel}</p>
                  </div>

                  <div className="col-span-3">
                    <Label>Ordem</Label>
                    <Input
                      type="number"
                      min={1}
                      value={row.display_order}
                      onChange={(event) =>
                        updateRow(index, { display_order: Number(event.target.value || 1) })
                      }
                    />
                  </div>

                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => removeRow(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2 pt-2">
              <Button variant="outline" onClick={addRow} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar item
              </Button>
              <Button onClick={saveChanges} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar configuracao
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
