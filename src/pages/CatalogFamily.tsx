import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { X } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { ProductList } from "@/components/catalog/ProductList";
import { FilterBreadcrumb } from "@/components/catalog/FilterBreadcrumb";
import { Button } from "@/components/ui/button";
import { 
  getCatalogFamilyItems,
  type CatalogItem 
} from "@/lib/catalogNew";

export default function CatalogFamily() {
  const { categoriaSlug, familiaSlug } = useParams<{
    categoriaSlug: string;
    familiaSlug: string;
  }>();
  const navigate = useNavigate();
  const contentAreaRef = useRef<HTMLDivElement>(null);

  const [allItems, setAllItems] = useState<CatalogItem[]>([]);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [family, setFamily] = useState<{ name: string; slug: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Scroll to top when family changes
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [familiaSlug]);

  // Load family items
  useEffect(() => {
    async function loadData() {
      if (!familiaSlug) return;

      setIsLoading(true);

      const data = await getCatalogFamilyItems(familiaSlug);

      // Unificar equipamentos e consumíveis, mantendo a ordem
      const items = [...data.equipamentos, ...data.consumiveis];
      setAllItems(items);
      setCategory(data.category);
      setFamily(data.family);
      setIsLoading(false);

      // GTM Event: Category View
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'category_view',
        category_name: data.category?.name || 'Não especificado',
        family_name: data.family?.name || 'Não especificado',
        product_count: items.length
      });
    }
    loadData();
  }, [familiaSlug]);

  // Handlers
  const handleClearFilters = () => {
    navigate('/catalogo');
  };

  const handleClearFamily = () => {
    if (category) {
      navigate(`/catalogo?categoria=${category.slug}`);
    } else {
      navigate('/catalogo');
    }
  };

  return (
    <>
      <Helmet>
        <title>{family?.name || 'Família'} | Catálogo LocaMulti</title>
        <meta 
          name="description" 
          content={`Equipamentos e consumíveis de ${family?.name || ''} disponíveis para locação na LocaMulti.`} 
        />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 flex flex-col pt-20">
          {/* Main Layout Area - Same structure as CatalogHome */}
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 flex flex-col lg:flex-row items-start gap-4 lg:gap-8">
            
            {/* Sidebar (Desktop) */}
            <CatalogSidebar />

            {/* Content Area - Responsive scroll */}
            <div
              ref={contentAreaRef}
              className="flex-1 w-full lg:min-w-0 lg:overflow-y-auto lg:max-h-[calc(100vh-8rem)] lg:pr-2"
            >
              {/* Header Section */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col gap-2">
                  {/* Breadcrumb */}
                  <FilterBreadcrumb
                    categoryName={category?.name}
                    familyName={family?.name}
                    onClearFilters={handleClearFilters}
                    onClearFamily={handleClearFamily}
                  />

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                      {family?.name || "Carregando..."}
                    </h1>
                    <span className="text-muted-foreground font-medium text-sm">
                      {allItems.length} {allItems.length === 1 ? 'produto' : 'produtos'} encontrados
                    </span>
                  </div>
                </div>

                {/* Clear Button */}
                <div className="flex items-center gap-2 flex-wrap">
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

              {/* Product List */}
              <ProductList
                products={allItems}
                isLoading={isLoading}
                onClearFilters={handleClearFilters}
                categoryName={category?.name}
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
