import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductList } from "@/components/catalog/ProductList";
import { FilterBreadcrumb } from "@/components/catalog/FilterBreadcrumb";
import { Button } from "@/components/ui/button";
import { getAllProducts, getAllCategories } from "@/data/catalogData";
import { Product } from "@/types/catalog";
import { X } from "lucide-react";

const CatalogHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // URL Params
  const selectedCategorySlug = searchParams.get("categoria");
  const selectedFamilySlug = searchParams.get("familia");
  const searchQuery = searchParams.get("q") || "";

  // Derived Data
  const categories = useMemo(() => getAllCategories(), []);

  const activeCategoryName = useMemo(() =>
    categories.find(c => c.slug === selectedCategorySlug)?.name,
    [selectedCategorySlug, categories]);

  const activeFamilyName = useMemo(() =>
    selectedCategorySlug && selectedFamilySlug
      ? categories.find(c => c.slug === selectedCategorySlug)?.families.find(f => f.slug === selectedFamilySlug)?.name
      : undefined
    , [selectedCategorySlug, selectedFamilySlug, categories]);

  // Determine View Mode
  const isGridView = !selectedCategorySlug && !searchQuery;

  // Simulate loading and filter
  useEffect(() => {
    setLoading(true);
    // Simulate slight delay for "feeling" of loading or heavy calculation if needed, 
    // but keep it fast (0-100ms) for local data.
    const timer = setTimeout(() => {
      let filtered = getAllProducts();

      if (selectedCategorySlug) {
        filtered = filtered.filter((p: any) => p.categorySlug === selectedCategorySlug);
      }
      if (selectedFamilySlug) {
        filtered = filtered.filter((p: any) => p.familySlug === selectedFamilySlug);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }

      setProducts(filtered);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedCategorySlug, selectedFamilySlug, searchQuery]);

  // Handlers
  const handleSelectCategory = (slug: string) => {
    setSearchParams({ categoria: slug });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFamily = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("familia");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col pt-24">
        {/* Main Layout Area */}
        <div className="container mx-auto px-4 py-8 flex items-start gap-8 min-h-[calc(100vh-200px)]">

          {/* Sidebar (Desktop) is now handled inside CatalogSidebar logic for visibility */}
          <CatalogSidebar />

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {isGridView ? (
              /* SCENARIO 1: CATEGORY GRID */
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
                    Explore Nossas Categorias
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Selecione uma categoria para ver os equipamentos disponíveis.
                  </p>
                </div>

                <CategoryGrid
                  categories={categories}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            ) : (
              /* SCENARIO 2: PRODUCT LIST */
              <div>
                {/* Header Section */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-col gap-2">
                    {/* Breadcrumb */}
                    <FilterBreadcrumb
                      categoryName={activeCategoryName}
                      familyName={activeFamilyName}
                      onClearFilters={handleClearFilters}
                      onClearFamily={handleClearFamily}
                    />

                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                        {activeFamilyName || activeCategoryName || "Resultados da Busca"}
                      </h1>
                      <span className="text-muted-foreground font-medium text-sm">
                        {products.length} produtos encontrados
                      </span>
                    </div>
                  </div>

                  {/* Active Filters / Clear Button aligned */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <X className="h-3 w-3 mr-2" />
                      Limpar Filtros e Voltar
                    </Button>
                  </div>
                </div>

                {/* List */}
                <ProductList
                  products={products}
                  isLoading={loading}
                  onClearFilters={handleClearFilters}
                  categoryName={activeCategoryName}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CatalogHome;
