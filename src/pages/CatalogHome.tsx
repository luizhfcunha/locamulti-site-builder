import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductList } from "@/components/catalog/ProductList";
import { FilterBreadcrumb } from "@/components/catalog/FilterBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllProducts, getAllCategories } from "@/data/catalogData";
import { Product } from "@/types/catalog";
import { X, Search } from "lucide-react";

// Helper to normalize text for search (remove accents, lowercase)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const CatalogHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  // URL Params
  const selectedCategorySlug = searchParams.get("categoria");
  const selectedFamilySlug = searchParams.get("familia");
  const searchQuery = searchParams.get("q") || "";

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

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

  // Filter products
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let filtered = getAllProducts();

      if (selectedCategorySlug) {
        filtered = filtered.filter((p: any) => p.categorySlug === selectedCategorySlug);
      }
      if (selectedFamilySlug) {
        filtered = filtered.filter((p: any) => p.familySlug === selectedFamilySlug);
      }
      if (searchQuery) {
        const normalizedQuery = normalizeText(searchQuery);
        filtered = filtered.filter(p =>
          normalizeText(p.name).includes(normalizedQuery) ||
          (p.description && normalizeText(p.description).includes(normalizedQuery))
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
    setSearchInput("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFamily = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("familia");
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("q");
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col pt-24">
        {/* Main Layout Area */}
        <div className="container mx-auto px-4 py-8 flex items-start gap-8 min-h-[calc(100vh-200px)]">

          {/* Sidebar (Desktop) */}
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
                  <p className="text-muted-foreground text-lg mb-6">
                    Selecione uma categoria para ver os equipamentos disponíveis.
                  </p>

                  {/* Search Bar */}
                  <form onSubmit={handleSearch} className="flex gap-2 max-w-lg">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar equipamento por nome ou descrição..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button type="submit" disabled={!searchInput.trim()}>
                      Buscar
                    </Button>
                  </form>
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
                        {searchQuery
                          ? `Resultados para "${searchQuery}"`
                          : (activeFamilyName || activeCategoryName || "Resultados")}
                      </h1>
                      <span className="text-muted-foreground font-medium text-sm">
                        {products.length} produtos encontrados
                      </span>
                    </div>
                  </div>

                  {/* Active Filters / Clear Button */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {searchQuery && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleClearSearch}
                        className="h-8 text-xs gap-1"
                      >
                        <X className="h-3 w-3" />
                        Limpar busca: "{searchQuery}"
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <X className="h-3 w-3 mr-2" />
                      Limpar Tudo e Voltar
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
