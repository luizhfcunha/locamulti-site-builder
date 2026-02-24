import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductList } from "@/components/catalog/ProductList";
import { FilterBreadcrumb } from "@/components/catalog/FilterBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCatalogCategories, getCatalogFamilies, CatalogCategory, CatalogItem, normalizeSearchText } from "@/lib/catalogNew";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/catalog";
import { X, Search } from "lucide-react";

// Transform CatalogCategory to Category for CategoryGrid compatibility
const transformCategories = async (catalogCategories: CatalogCategory[]): Promise<Category[]> => {
  const categories: Category[] = [];
  
  for (const cat of catalogCategories) {
    const families = await getCatalogFamilies(cat.category_slug);
    categories.push({
      order: cat.category_order,
      name: cat.category_name,
      slug: cat.category_slug,
      families: families.map(f => ({
        order: String(f.family_order),
        name: f.family_name,
        slug: f.family_slug,
        products: []
      }))
    });
  }
  
  return categories;
};

const CatalogHome = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const catalogCategories = await getCatalogCategories();
      const transformed = await transformCategories(catalogCategories);
      setCategories(transformed);
    };
    fetchCategories();
  }, []);

  // Derived data
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

  // Filter products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      
      try {
        let query = supabase
          .from('catalog_items')
          .select('*')
          .eq('active', true)
          .order('category_order', { ascending: true })
          .order('family_order', { ascending: true })
          .order('item_order', { ascending: true });

        if (selectedCategorySlug) {
          query = query.eq('category_slug', selectedCategorySlug);
        }
        if (selectedFamilySlug) {
          query = query.eq('family_slug', selectedFamilySlug);
        }

        const { data, error } = await query;

        if (error) {
          setProducts([]);
        } else {
          const fetched = (data || []) as CatalogItem[];
          if (!searchQuery) {
            setProducts(fetched);
          } else {
            const normalizedQuery = normalizeSearchText(searchQuery.trim());
            const filtered = fetched.filter((item) => {
              const code = normalizeSearchText(item.code || "");
              const name = normalizeSearchText(item.name || "");
              const description = normalizeSearchText(item.description || "");
              return code.includes(normalizedQuery) || name.includes(normalizedQuery) || description.includes(normalizedQuery);
            });
            setProducts(filtered);
          }
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch products if we have a filter active
    if (selectedCategorySlug || searchQuery) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [selectedCategorySlug, selectedFamilySlug, searchQuery]);

  // Handlers
  const handleSelectCategory = (slug: string) => {
    setSearchParams({ categoria: slug });
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setSearchInput("");
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

      <main className="flex-1 flex flex-col pt-8 md:pt-10">
        {/* Main Layout Area - Responsive layout */}
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8">

          {/* Sidebar (Desktop) */}
          <CatalogSidebar />

          {/* Content Area - Responsive scroll */}
          <div className="flex-1 w-full lg:min-w-0 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)] lg:pr-2">
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
                  <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-lg w-full">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Buscar equipamento por nome ou descrição..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto" disabled={!searchInput.trim()}>
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
