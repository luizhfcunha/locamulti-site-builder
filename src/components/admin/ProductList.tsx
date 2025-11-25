import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Search, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductListProps {
  onEdit: (product: any) => void;
}

const ProductList = ({ onEdit }: ProductListProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("_all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("_all");
  const [selectedBrand, setSelectedBrand] = useState<string>("_all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  // Data for filters
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedCategory !== "_all") {
      fetchSubcategories(selectedCategory);
    } else {
      setSubcategories([]);
      setSelectedSubcategory("_all");
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSubcategory, selectedBrand, selectedStatus]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("display_order");
    
    if (data) setCategories(data);
  };

  const fetchSubcategories = async (categoryId: string) => {
    const { data } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order");
    
    if (data) setSubcategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    
    let query = supabase
      .from("products")
      .select(`
        *,
        categories (name),
        subcategories (name)
      `);

    // Apply filters
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,supplier_code.ilike.%${searchTerm}%`);
    }

    if (selectedCategory && selectedCategory !== "_all") {
      query = query.eq("category_id", selectedCategory);
    }

    if (selectedSubcategory && selectedSubcategory !== "_all") {
      query = query.eq("subcategory_id", selectedSubcategory);
    }

    if (selectedBrand && selectedBrand !== "_all") {
      query = query.eq("brand", selectedBrand);
    }

    if (selectedStatus !== "all") {
      query = query.eq("active", selectedStatus === "active");
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Erro ao carregar produtos",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setProducts(data || []);
      
      // Extract unique brands
      const uniqueBrands = [...new Set(data?.map(p => p.brand).filter(Boolean) as string[])];
      setBrands(uniqueBrands.sort());
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      toast({
        title: "Produto excluído",
        description: "O produto foi excluído com sucesso",
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir produto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("_all");
    setSelectedSubcategory("_all");
    setSelectedBrand("_all");
    setSelectedStatus("all");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "_all" || selectedSubcategory !== "_all" || selectedBrand !== "_all" || selectedStatus !== "all";

  if (loading) {
    return (
      <div className="text-center py-8">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <>
      {/* Filters Section */}
      <Card className="p-4 mb-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg text-lm-plum">Filtros</h2>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Limpar filtros
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, marca, código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Filter */}
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategoria</Label>
              <Select
                value={selectedSubcategory}
                onValueChange={setSelectedSubcategory}
                disabled={selectedCategory === "_all"}
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todas</SelectItem>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Select
                value={selectedBrand}
                onValueChange={setSelectedBrand}
              >
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">Todas</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-heading text-lg text-lm-plum">
                {product.name}
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Categoria: {product.categories?.name || "-"}</p>
                {product.subcategories && (
                  <p>Subcategoria: {product.subcategories.name}</p>
                )}
                {product.brand && <p>Marca: {product.brand}</p>}
                {product.supplier_code && (
                  <p>Código: {product.supplier_code}</p>
                )}
                {product.price && (
                  <p className="font-semibold">
                    R$ {parseFloat(product.price).toFixed(2)}
                  </p>
                )}
                <p>
                  Status:{" "}
                  <span
                    className={
                      product.active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(product)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum produto cadastrado ainda
          </p>
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductList;
