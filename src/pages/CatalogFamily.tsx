import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Package, Tag } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { EquipmentItem } from "@/components/catalog/EquipmentItem";
import { ConsumableItem } from "@/components/catalog/ConsumableItem";
import { ItemDetailDrawer } from "@/components/catalog/ItemDetailDrawer";
import { 
  getCatalogFamilyItems,
  getCatalogItemByCode,
  type CatalogItem 
} from "@/lib/catalogNew";

export default function CatalogFamily() {
  const { categoriaSlug, familiaSlug, code } = useParams<{ 
    categoriaSlug: string; 
    familiaSlug: string;
    code?: string;
  }>();
  const [searchParams] = useSearchParams();
  const highlightCode = searchParams.get('highlight');
  
  const [equipamentos, setEquipamentos] = useState<CatalogItem[]>([]);
  const [consumiveis, setConsumiveis] = useState<CatalogItem[]>([]);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [family, setFamily] = useState<{ name: string; slug: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Drawer state
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Load family items
  useEffect(() => {
    async function loadData() {
      if (!familiaSlug) return;
      
      setIsLoading(true);
      
      const data = await getCatalogFamilyItems(familiaSlug);
      
      setEquipamentos(data.equipamentos);
      setConsumiveis(data.consumiveis);
      setCategory(data.category);
      setFamily(data.family);
      setIsLoading(false);
    }
    loadData();
  }, [familiaSlug]);

  // Handle code route parameter (open drawer automatically)
  useEffect(() => {
    async function openItemFromRoute() {
      if (code && !isLoading) {
        const item = await getCatalogItemByCode(code);
        if (item) {
          setSelectedItem(item);
          setDrawerOpen(true);
        }
      }
    }
    openItemFromRoute();
  }, [code, isLoading]);

  // Handle highlight from search
  useEffect(() => {
    if (highlightCode && !isLoading) {
      const element = document.getElementById(`item-${highlightCode}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
        }, 3000);
      }
    }
  }, [highlightCode, isLoading, equipamentos, consumiveis]);

  const handleViewDetails = (item: CatalogItem) => {
    setSelectedItem(item);
    setDrawerOpen(true);
    // Update URL without full navigation
    window.history.pushState(
      {}, 
      '', 
      `/catalogo/${categoriaSlug}/${familiaSlug}/${item.code}`
    );
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedItem(null);
    // Reset URL
    window.history.pushState(
      {}, 
      '', 
      `/catalogo/${categoriaSlug}/${familiaSlug}`
    );
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
      
      <Header />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <CatalogBreadcrumb 
            items={[
              category ? { label: category.name, href: `/catalogo/${category.slug}` } : { label: '...' },
              family ? { label: family.name } : { label: '...' }
            ]}
          />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {family?.name || 'Carregando...'}
                </h1>
                <p className="text-muted-foreground">
                  {equipamentos.length} equipamento{equipamentos.length !== 1 && 's'}
                  {consumiveis.length > 0 && ` + ${consumiveis.length} consumível${consumiveis.length !== 1 ? 'is' : ''}`}
                </p>
              </div>
            </div>
            
            {/* Search */}
            <CatalogSearch className="max-w-xl" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-10">
              {/* Equipamentos Section */}
              {equipamentos.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="h-5 w-5 text-primary" />
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      Equipamentos
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {equipamentos.map((item) => (
                      <div key={item.code} id={`item-${item.code}`} className="transition-all duration-300">
                        <EquipmentItem 
                          item={item} 
                          onViewDetails={handleViewDetails}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Consumíveis Section */}
              {consumiveis.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-accent-foreground/70" />
                    <h2 className="font-heading text-xl font-semibold text-foreground">
                      Consumíveis Disponíveis
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      (para locar junto com os equipamentos)
                    </span>
                  </div>
                  <div className="space-y-3">
                    {consumiveis.map((item) => (
                      <div key={item.code} id={`item-${item.code}`} className="transition-all duration-300">
                        <ConsumableItem 
                          item={item} 
                          onViewDetails={handleViewDetails}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Empty State */}
              {equipamentos.length === 0 && consumiveis.length === 0 && (
                <div className="text-center py-20">
                  <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h2 className="text-xl font-heading font-semibold text-muted-foreground mb-2">
                    Nenhum item encontrado
                  </h2>
                  <p className="text-muted-foreground">
                    Não há equipamentos ou consumíveis nesta família.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      {/* Item Detail Drawer - Consumíveis permanecem visíveis */}
      <ItemDetailDrawer 
        item={selectedItem}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
}
