import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductListProps {
  onEdit: (product: any) => void;
  refreshTrigger?: number;
}

const ProductList = ({ onEdit, refreshTrigger }: ProductListProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("_all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("_all");
  const [selectedBrand, setSelectedBrand] = useState<string>("_all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("name_asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);

  // Data for filters
  const [categories, setCategories] = useState<any[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedCategory, selectedSubcategory, selectedBrand, selectedStatus, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearchTerm, selectedCategory, selectedSubcategory, selectedBrand, selectedStatus, sortOrder, currentPage, itemsPerPage]);

  // Refresh when refreshTrigger changes (after edits/bulk uploads)
  useEffect(() => {
    if (refreshTrigger !== undefined && refreshTrigger > 0) {
      fetchProducts();
    }
  }, [refreshTrigger]);

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
    try {
      // Build the base query for counting
      let countQuery = supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // Build the main query
      let query = supabase
        .from("products")
        .select(`
          *,
          categories(name),
          subcategories(name)
        `);

      // Apply filters to both queries
      if (debouncedSearchTerm) {
        const searchFilter = `name.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%,brand.ilike.%${debouncedSearchTerm}%,supplier_code.ilike.%${debouncedSearchTerm}%`;
        query = query.or(searchFilter);
        countQuery = countQuery.or(searchFilter);
      }

      if (selectedCategory && selectedCategory !== "_all") {
        query = query.eq("category_id", selectedCategory);
        countQuery = countQuery.eq("category_id", selectedCategory);
      }

      if (selectedSubcategory && selectedSubcategory !== "_all") {
        query = query.eq("subcategory_id", selectedSubcategory);
        countQuery = countQuery.eq("subcategory_id", selectedSubcategory);
      }

      if (selectedBrand && selectedBrand !== "_all") {
        query = query.eq("brand", selectedBrand);
        countQuery = countQuery.eq("brand", selectedBrand);
      }

      if (selectedStatus === "active") {
        query = query.eq("active", true);
        countQuery = countQuery.eq("active", true);
      } else if (selectedStatus === "inactive") {
        query = query.eq("active", false);
        countQuery = countQuery.eq("active", false);
      }

      // Apply sorting
      switch (sortOrder) {
        case "name_asc":
          query = query.order("name", { ascending: true });
          break;
        case "name_desc":
          query = query.order("name", { ascending: false });
          break;
        case "price_asc":
          query = query.order("price", { ascending: true, nullsFirst: false });
          break;
        case "price_desc":
          query = query.order("price", { ascending: false, nullsFirst: false });
          break;
        case "date_asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "date_desc":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      // Apply pagination
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      // Execute both queries
      const [{ data, error }, { count, error: countError }] = await Promise.all([
        query,
        countQuery
      ]);

      if (error) throw error;
      if (countError) throw countError;

      setProducts(data || []);
      setTotalCount(count || 0);

      // Extract unique brands from all products (not just current page)
      const { data: allProducts } = await supabase
        .from("products")
        .select("brand");

      const uniqueBrands = [...new Set((allProducts || []).map(p => p.brand).filter(Boolean))];
      setBrands(uniqueBrands.sort());
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Ocorreu um erro ao buscar os produtos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
    setDebouncedSearchTerm("");
    setSelectedCategory("_all");
    setSelectedSubcategory("_all");
    setSelectedBrand("_all");
    setSelectedStatus("all");
    setSortOrder("name_asc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "_all" || selectedSubcategory !== "_all" || selectedBrand !== "_all" || selectedStatus !== "all" || sortOrder !== "name_asc";

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return items;
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <div key={i} className="border rounded-card p-4 space-y-3">
          <Skeleton className="w-full h-48" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-9 flex-1" />
            <Skeleton className="h-9 flex-1" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Filters and Sort Section */}
        <div className="bg-background border rounded-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl text-lm-plum">Filtros e Ordenação</h2>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                type="text"
                placeholder="Nome, descrição, marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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

            {/* Subcategory */}
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

            {/* Brand */}
            <div className="space-y-2">
              <Label htmlFor="brand">Marca</Label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
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

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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

            {/* Sort Order */}
            <div className="space-y-2">
              <Label htmlFor="sort">Ordenar por</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sort">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date_desc">Data (mais recentes)</SelectItem>
                  <SelectItem value="date_asc">Data (mais antigos)</SelectItem>
                  <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Preço (menor)</SelectItem>
                  <SelectItem value="price_desc">Preço (maior)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results count and items per page */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {startItem}-{endItem} de {totalCount} {totalCount === 1 ? "produto" : "produtos"}
          </p>

          <div className="flex items-center gap-2">
            <Label htmlFor="items-per-page" className="text-sm whitespace-nowrap">
              Itens por página:
            </Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="items-per-page" className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="48">48</SelectItem>
                <SelectItem value="96">96</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          renderSkeletons()
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-card overflow-hidden hover:shadow-card transition-shadow"
                >
                  {/* Image */}
                  <div className="aspect-video bg-lm-muted relative">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sem imagem
                      </div>
                    )}
                    {!product.active && (
                      <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-xs font-medium">
                        Inativo
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-heading text-lg text-lm-plum line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      {product.categories && (
                        <p className="line-clamp-1">
                          <span className="font-medium">Categoria:</span>{" "}
                          {product.categories.name}
                        </p>
                      )}
                      {product.brand && (
                        <p className="line-clamp-1">
                          <span className="font-medium">Marca:</span> {product.brand}
                        </p>
                      )}
                      {product.price && (
                        <p className="font-medium text-lm-orange">
                          R$ {Number(product.price).toFixed(2)}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="flex-1 gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(product.id)}
                        className="flex-1 gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>

                    {renderPaginationItems()}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
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
