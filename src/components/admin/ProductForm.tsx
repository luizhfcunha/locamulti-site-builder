import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { X, Upload } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  brand: z.string().optional(),
  supplier_code: z.string().optional(),
  category_id: z.string().min(1, "Categoria é obrigatória"),
  family_id: z.string().optional(),
  subfamily_id: z.string().optional(),
  price: z.string().optional(),
  active: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: any;
  onClose: () => void;
}

const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [families, setFamilies] = useState<any[]>([]);
  const [subfamilies, setSubfamilies] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description || "",
      brand: product.brand || "",
      supplier_code: product.supplier_code || "",
      category_id: product.category_id || "",
      family_id: product.family_id || "",
      subfamily_id: product.subcategory_id || "",
      price: product.price?.toString() || "",
      active: product.active ?? true,
    } : {
      active: true,
    },
  });

  const selectedFamilyId = watch("family_id");

  const selectedCategoryId = watch("category_id");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchFamilies(selectedCategoryId);
    } else {
      setFamilies([]);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedFamilyId) {
      fetchSubfamilies(selectedFamilyId);
    } else {
      setSubfamilies([]);
    }
  }, [selectedFamilyId]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    
    if (data) setCategories(data);
  };

  const fetchFamilies = async (categoryId: string) => {
    const { data } = await supabase
      .from("families")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order");
    
    if (data) setFamilies(data);
  };

  const fetchSubfamilies = async (familyId: string) => {
    const { data } = await supabase
      .from("subfamilies")
      .select("*")
      .eq("family_id", familyId)
      .order("display_order");
    
    if (data) setSubfamilies(data);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return product?.image_url || null;

    setUploading(true);
    
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const imageUrl = await uploadImage();

      const productData = {
        name: data.name,
        description: data.description || null,
        brand: data.brand || null,
        supplier_code: data.supplier_code || null,
        category_id: data.category_id,
        family_id: data.family_id || null,
        subcategory_id: data.subfamily_id || null,
        price: data.price ? parseFloat(data.price) : null,
        image_url: imageUrl,
        active: data.active,
      };

      if (product) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Produto atualizado",
          description: "O produto foi atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Produto criado",
          description: "O produto foi criado com sucesso",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar produto",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="font-heading text-xl">
            {product ? "Editar Produto" : "Novo Produto"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Nome do produto"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                {...register("brand")}
                placeholder="Marca do produto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier_code">Código</Label>
              <Input
                id="supplier_code"
                {...register("supplier_code")}
                placeholder="Código do fornecedor"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Categoria *</Label>
              <Select
                value={watch("category_id")}
                onValueChange={(value) => setValue("category_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_id && (
                <p className="text-sm text-destructive">{errors.category_id.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_id">Família</Label>
              <Select
                value={watch("family_id") || ""}
                onValueChange={(value) => setValue("family_id", value)}
                disabled={!selectedCategoryId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma família" />
                </SelectTrigger>
                <SelectContent>
                  {families.map((fam) => (
                    <SelectItem key={fam.id} value={fam.id}>
                      {fam.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subfamily_id">Subfamília</Label>
              <Select
                value={watch("subfamily_id") || ""}
                onValueChange={(value) => setValue("subfamily_id", value)}
                disabled={!selectedFamilyId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma subfamília" />
                </SelectTrigger>
                <SelectContent>
                  {subfamilies.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descrição do produto"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Produto</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                className="flex-1"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              {...register("active")}
              className="w-4 h-4"
            />
            <Label htmlFor="active">Produto ativo</Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Enviando..." : product ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
