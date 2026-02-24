import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, ImageIcon, ImageOff, Upload, Images } from "lucide-react";
import { findImageForProduct } from "@/utils/imageMatcher";
import { EquipmentImagesManager } from "@/components/admin/EquipmentImagesManager";

interface CatalogItem {
  id: string;
  code: string;
  name: string;
  description: string;
  category_name: string;
  category_slug: string;
  category_no: number;
  category_order: number;
  family_name: string;
  family_slug: string;
  family_no: string;
  family_order: number;
  item_type: string;
  item_order: number;
  image_url: string | null;
  active: boolean;
}

interface CatalogItemFormProps {
  item: CatalogItem;
  onClose: () => void;
}

type MasterCategory = {
  slug: string;
  name: string;
  category_no: number;
  display_order: number;
};

type MasterFamily = {
  category_slug: string;
  slug: string;
  name: string;
  family_no: string;
  display_order: number;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function CatalogItemForm({ item, onClose }: CatalogItemFormProps) {
  const isNewItem = item.id === "__new__";
  const [formData, setFormData] = useState({
    code: item.code,
    name: item.name || "",
    description: item.description || "",
    category_name: item.category_name,
    category_slug: item.category_slug || "",
    family_name: item.family_name,
    family_slug: item.family_slug || "",
    item_type: item.item_type || "equipamento",
    active: item.active ?? true,
    image_url: item.image_url || "",
  });
  const [masterCategories, setMasterCategories] = useState<MasterCategory[]>([]);
  const [masterFamilies, setMasterFamilies] = useState<MasterFamily[]>([]);
  const [loadingStructure, setLoadingStructure] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fallbackImage = findImageForProduct(item.code, item.name || item.description);
  const displayImage = formData.image_url || fallbackImage || null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const loadMasterStructure = async () => {
      setLoadingStructure(true);
      try {
        const [{ data: categoriesData, error: categoriesError }, { data: familiesData, error: familiesError }] =
          await Promise.all([
            supabase
              .from("catalog_categories")
              .select("slug, name, category_no, display_order")
              .order("display_order", { ascending: true }),
            supabase
              .from("catalog_families")
              .select("category_slug, slug, name, family_no, display_order")
              .order("display_order", { ascending: true }),
          ]);

        if (categoriesError || familiesError) throw categoriesError || familiesError;

        setMasterCategories(categoriesData || []);
        setMasterFamilies(familiesData || []);
        return;
      } catch {
        // Fallback para ambientes sem as tabelas mestre.
      }

      const { data: itemsData, error } = await supabase
        .from("catalog_items")
        .select(
          "category_name, category_slug, category_no, category_order, family_name, family_slug, family_no, family_order",
        )
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true });

      if (error) {
        toast({
          title: "Erro ao carregar estrutura",
          description: "Nao foi possivel carregar categorias e familias.",
          variant: "destructive",
        });
        setMasterCategories([]);
        setMasterFamilies([]);
        setLoadingStructure(false);
        return;
      }

      const categoriesMap = new Map<string, MasterCategory>();
      const familiesMap = new Map<string, MasterFamily>();

      (itemsData || []).forEach((row) => {
        if (!categoriesMap.has(row.category_slug)) {
          categoriesMap.set(row.category_slug, {
            slug: row.category_slug,
            name: row.category_name,
            category_no: row.category_no,
            display_order: row.category_order,
          });
        }

        const familyKey = `${row.category_slug}:${row.family_slug}`;
        if (!familiesMap.has(familyKey)) {
          familiesMap.set(familyKey, {
            category_slug: row.category_slug,
            slug: row.family_slug,
            name: row.family_name,
            family_no: row.family_no,
            display_order: row.family_order,
          });
        }
      });

      setMasterCategories(Array.from(categoriesMap.values()).sort((a, b) => a.display_order - b.display_order));
      setMasterFamilies(Array.from(familiesMap.values()).sort((a, b) => a.display_order - b.display_order));
      setLoadingStructure(false);
    };

    void loadMasterStructure();
  }, []);

  const availableFamilies = useMemo(
    () =>
      masterFamilies
        .filter((family) => family.category_slug === formData.category_slug)
        .sort((a, b) => a.display_order - b.display_order),
    [masterFamilies, formData.category_slug],
  );

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categorySlug: string) => {
    const selectedCategory = masterCategories.find((category) => category.slug === categorySlug);
    setFormData((prev) => ({
      ...prev,
      category_slug: categorySlug,
      category_name: selectedCategory?.name || "",
      family_slug: "",
      family_name: "",
    }));
  };

  const handleFamilyChange = (familySlug: string) => {
    const selectedFamily = availableFamilies.find((family) => family.slug === familySlug);
    setFormData((prev) => ({
      ...prev,
      family_slug: familySlug,
      family_name: selectedFamily?.name || "",
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo invalido",
        description: "Selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("product-images").getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
      toast({
        title: "Imagem enviada",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel enviar a imagem.";
      toast({
        title: "Erro no upload",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const selectedCategory = masterCategories.find((category) => category.slug === formData.category_slug);
      const selectedFamily = availableFamilies.find((family) => family.slug === formData.family_slug);

      if (!selectedCategory || !selectedFamily) {
        toast({
          title: "Categoria e familia obrigatorias",
          description: "Selecione uma categoria e uma familia validas para salvar.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      const categorySlug = selectedCategory.slug || slugify(selectedCategory.name);
      const familySlug = selectedFamily.slug || slugify(selectedFamily.name);

      const baseData = {
        code: formData.code,
        name: formData.name,
        description: formData.description,
        category_name: selectedCategory.name,
        category_slug: categorySlug,
        family_name: selectedFamily.name,
        family_slug: familySlug,
        item_type: formData.item_type,
        active: formData.active,
        image_url: formData.image_url || null,
        updated_at: new Date().toISOString(),
      };

      if (isNewItem) {
        const [{ data: categoryRow }, { data: familyRow }] = await Promise.all([
          supabase
            .from("catalog_items")
            .select("category_no, category_order")
            .eq("category_slug", categorySlug)
            .order("category_order", { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase
            .from("catalog_items")
            .select("family_no, family_order, item_order")
            .eq("category_slug", categorySlug)
            .eq("family_slug", familySlug)
            .order("item_order", { ascending: false })
            .limit(1)
            .maybeSingle(),
        ]);

        const insertData = {
          ...baseData,
          category_no: categoryRow?.category_no ?? selectedCategory.category_no,
          category_order: categoryRow?.category_order ?? selectedCategory.display_order,
          family_no: familyRow?.family_no ?? selectedFamily.family_no,
          family_order: familyRow?.family_order ?? selectedFamily.display_order,
          item_order: (familyRow?.item_order ?? 0) + 1,
        };

        const { error } = await supabase.from("catalog_items").insert(insertData);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("catalog_items").update(baseData).eq("id", item.id);
        if (error) throw error;
      }

      toast({
        title: isNewItem ? "Item criado" : "Item atualizado",
        description: isNewItem ? "Novo item criado com sucesso." : "As alteracoes foram salvas com sucesso.",
      });
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Nao foi possivel salvar as alteracoes.";
      toast({
        title: "Erro ao salvar",
        description: message,
        variant: "destructive",
      });
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-lg">{isNewItem ? "Novo Item do Catalogo" : "Editar Item do Catalogo"}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Codigo: {item.code || "-"}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Codigo</Label>
                <Input
                  id="code"
                  value={formData.code}
                  readOnly
                  disabled
                  placeholder={isNewItem ? "Gerado automaticamente ao salvar" : "Codigo do item"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome do Equipamento</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Ex: MARTELO DEMOLIDOR 30 Kg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Especificacoes Tecnicas / Informacoes Adicionais</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Ex: Especificacoes, aplicacoes e observacoes do item..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_name">Categoria</Label>
                  <Select
                    value={formData.category_slug || undefined}
                    onValueChange={handleCategoryChange}
                    disabled={loadingStructure || masterCategories.length === 0}
                  >
                    <SelectTrigger id="category_name">
                      <SelectValue
                        placeholder={loadingStructure ? "Carregando categorias..." : "Selecione uma categoria"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {masterCategories.map((category) => (
                        <SelectItem key={category.slug} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family_name">Familia</Label>
                  <Select
                    value={formData.family_slug || undefined}
                    onValueChange={handleFamilyChange}
                    disabled={!formData.category_slug || availableFamilies.length === 0}
                  >
                    <SelectTrigger id="family_name">
                      <SelectValue
                        placeholder={formData.category_slug ? "Selecione uma familia" : "Escolha uma categoria"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFamilies.map((family) => (
                        <SelectItem key={`${family.category_slug}-${family.slug}`} value={family.slug}>
                          {family.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_type">Tipo</Label>
                  <Select value={formData.item_type} onValueChange={(value) => handleChange("item_type", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                      <SelectItem value="consumivel">Consumivel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch checked={formData.active} onCheckedChange={(checked) => handleChange("active", checked)} />
                    <span className="text-sm">{formData.active ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Imagens do Produto</Label>

              <Tabs defaultValue="gallery" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="gallery" className="gap-2">
                    <Images className="w-4 h-4" />
                    Galeria
                  </TabsTrigger>
                  <TabsTrigger value="legacy" className="gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Imagem Legada
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="gallery" className="border rounded-lg p-4 bg-muted/50">
                  <EquipmentImagesManager
                    equipmentId={item.id}
                    equipmentCode={formData.code}
                    equipmentName={formData.name || formData.code}
                  />
                </TabsContent>

                <TabsContent value="legacy" className="border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-4">
                    <div className="aspect-square w-full max-w-[300px] mx-auto rounded-lg border bg-background flex items-center justify-center overflow-hidden">
                      {previewUrl || displayImage ? (
                        <img src={previewUrl || displayImage || ""} alt={formData.code} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <ImageOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Sem imagem</p>
                        </div>
                      )}
                    </div>

                    {!formData.image_url && fallbackImage && (
                      <p className="text-xs text-muted-foreground text-center">
                        Imagem via correspondencia automatica (nao salva no banco).
                      </p>
                    )}
                    {formData.image_url && (
                      <p className="text-xs text-green-600 text-center">Imagem salva no banco de dados.</p>
                    )}

                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        disabled={uploading}
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            Enviar Nova Imagem
                          </>
                        )}
                      </Button>
                      <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                      {formData.image_url && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-destructive"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, image_url: "" }));
                            setPreviewUrl(null);
                          }}
                        >
                          Remover Imagem
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image_url" className="text-xs">
                        Ou insira a URL da imagem
                      </Label>
                      <Input
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => handleChange("image_url", e.target.value)}
                        placeholder="https://..."
                        className="text-xs"
                      />
                    </div>

                    <div className="text-xs text-muted-foreground bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                      <p className="font-medium mb-1">Sistema legado</p>
                      <p>
                        Use a aba "Galeria" para gerenciar multiplas imagens com melhor controle. Esta aba mantem
                        compatibilidade com o sistema antigo.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="gap-2 bg-lm-orange hover:bg-lm-terrac">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alteracoes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
