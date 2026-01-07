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
import { SlidersHorizontal, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";

const Catalogo = () => {
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
          p.description?.toLowerCase().includes(q)
        );
      }

      // Sort by default order (Excel order)
      // Products are naturally in order in the array from getAllProducts if flattened correctly
      // But getAllProducts flattens mapping. Since JSON is ordered, map should preserve order.

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

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* Main Layout Area */}
        <div className="container mx-auto px-4 py-8 flex items-start gap-8 min-h-[calc(100vh-200px)]">

          {/* Sidebar (Desktop) */}
          <div className="hidden lg:block w-[280px] shrink-0 sticky top-24">
            {/* Sidebar should probably handle its own state but sync via URL. 
                   Pass no props as it reads URL? 
                   Yes, Sidebar implementation reads URL.
               */}
            <CatalogSidebar />
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Trigger */}
            <div className="lg:hidden mb-6">
              {/* Only show if filtered list view, or always? 
                     In Grid view, we might not need sidebar as much since clicking a card selects category.
                     But user might want to access hierarchy. Logic says:
                     "Cenário 1: Grid de cards" -> click -> filters active
                     So maybe hide sidebar trigger on mobile if on grid view? 
                     User said: "Mobile: Vira menu hamburguer". 
                     Let's verify logic. CatalogSidebar has its own button for mobile inside checks.
                     Actually CatalogSidebar we implemented outputs the button on mobile. 
                     We should only show that button if intended.
                     If we are in GridView, maybe we hide the sidebar button to focus on Grid?
                     Or keep it for "Advanced" access. Let's keep it.
                 */}
              {/* CatalogSidebar Component renders the mobile trigger button itself when hidden lg:block is NOT applied to it. 
                      Wait, previous implementation of CatalogSidebar returned:
                      <> <div desktop>...</div> <div mobile>...</div> </>
                      So just rendering <CatalogSidebar /> here would render the desktop div (hidden on mobile) AND the mobile div (visible on mobile).
                      HOWEVER, I put "hidden lg:block" on the wrapper dev here. 
                      So I need to move CatalogSidebar out of the wrapper? 
                      OR render it twice?
                      Better: Render <CatalogSidebar /> once, but its internal logic handles responsive hiding.
                      Let's verify CatalogSidebar code I wrote.
                      It has:
                      <>
                        <div className="hidden lg:block ...">...</div>
                        <div className="lg:hidden ...">...</div>
                      </>
                      So I should render it once, OUTSIDE the column structure for mobile.
                      But for desktop it needs to be in the column.
                  */}
            </div>

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

                {/* Mobile Sidebar Trigger (Show even on grid? Maybe good for direct access) */}
                <div className="lg:hidden mb-6">
                  <CatalogSidebar />
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

                  {/* Mobile Sidebar Trigger for List View */}
                  <div className="lg:hidden">
                    <CatalogSidebar />
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

export default Catalogo;
