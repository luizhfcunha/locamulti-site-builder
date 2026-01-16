import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Loader2, ImageIcon, ImageOff, Upload } from "lucide-react";
import { findImageForProduct } from "@/utils/imageMatcher";

interface CatalogItem {
  id: string;
  code: string;
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

const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export function CatalogItemForm({ item, onClose }: CatalogItemFormProps) {
  const [formData, setFormData] = useState({
    code: item.code,
    description: item.description,
    category_name: item.category_name,
    family_name: item.family_name,
    item_type: item.item_type,
    active: item.active ?? true,
    image_url: item.image_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Get fallback image for preview
  const fallbackImage = findImageForProduct(item.code, item.description);
  const displayImage = formData.image_url || fallbackImage || null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Preview
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));

      toast({
        title: "Imagem enviada",
        description: "A imagem foi carregada com sucesso.",
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível enviar a imagem.",
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
      const updateData = {
        code: formData.code,
        description: formData.description,
        category_name: formData.category_name,
        category_slug: slugify(formData.category_name),
        family_name: formData.family_name,
        family_slug: slugify(formData.family_name),
        item_type: formData.item_type,
        active: formData.active,
        image_url: formData.image_url || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("catalog_items")
        .update(updateData)
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Item atualizado",
        description: "As alterações foram salvas com sucesso.",
      });

      onClose();
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar as alterações.",
        variant: "destructive",
      });
    } finally {
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
            <CardTitle className="text-lg">Editar Item do Catálogo</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Código: {item.code}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  placeholder="Ex: 01.01.001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Descrição técnica do equipamento"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_name">Categoria</Label>
                  <Input
                    id="category_name"
                    value={formData.category_name}
                    onChange={(e) => handleChange("category_name", e.target.value)}
                    placeholder="Nome da categoria"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family_name">Família</Label>
                  <Input
                    id="family_name"
                    value={formData.family_name}
                    onChange={(e) => handleChange("family_name", e.target.value)}
                    placeholder="Nome da família"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item_type">Tipo</Label>
                  <Select 
                    value={formData.item_type} 
                    onValueChange={(value) => handleChange("item_type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equipamento">Equipamento</SelectItem>
                      <SelectItem value="consumivel">Consumível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch
                      checked={formData.active}
                      onCheckedChange={(checked) => handleChange("active", checked)}
                    />
                    <span className="text-sm">
                      {formData.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="space-y-4">
              <Label>Imagem do Produto</Label>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                {/* Image Preview */}
                <div className="aspect-square w-full max-w-[300px] mx-auto mb-4 rounded-lg border bg-background flex items-center justify-center overflow-hidden">
                  {previewUrl || displayImage ? (
                    <img
                      src={previewUrl || displayImage || ""}
                      alt={formData.code}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Sem imagem</p>
                    </div>
                  )}
                </div>

                {/* Image Source Info */}
                {!formData.image_url && fallbackImage && (
                  <p className="text-xs text-muted-foreground text-center mb-4">
                    ⚡ Imagem via correspondência automática (não salva no banco)
                  </p>
                )}
                {formData.image_url && (
                  <p className="text-xs text-green-600 text-center mb-4">
                    ✓ Imagem salva no banco de dados
                  </p>
                )}

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={uploading}
                    onClick={() => document.getElementById('image-upload')?.click()}
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
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {formData.image_url && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-destructive"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, image_url: "" }));
                        setPreviewUrl(null);
                      }}
                    >
                      Remover Imagem
                    </Button>
                  )}
                </div>

                {/* Manual URL Input */}
                <div className="mt-4 space-y-2">
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
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={saving}
              className="gap-2 bg-lm-orange hover:bg-lm-terrac"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
