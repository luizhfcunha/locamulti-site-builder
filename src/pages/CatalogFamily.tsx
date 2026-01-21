import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Package } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { ProductCard } from "@/components/catalog/ProductCard";
import { 
  getCatalogFamilyItems,
  type CatalogItem 
} from "@/lib/catalogNew";

export default function CatalogFamily() {
  const { categoriaSlug, familiaSlug } = useParams<{ 
    categoriaSlug: string; 
    familiaSlug: string;
  }>();
  const [searchParams] = useSearchParams();
  const highlightCode = searchParams.get('highlight');
  
  const [allItems, setAllItems] = useState<CatalogItem[]>([]);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [family, setFamily] = useState<{ name: string; slug: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    }
    loadData();
  }, [familiaSlug]);

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
  }, [highlightCode, isLoading, allItems]);

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
                  {allItems.length} {allItems.length === 1 ? 'item' : 'itens'} disponíveis
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
            <div className="space-y-4">
              {/* Lista unificada de itens */}
              {allItems.length > 0 ? (
                allItems.map((item, index) => (
                  <div 
                    key={item.code} 
                    id={`item-${item.code}`} 
                    className="transition-all duration-300 animate-in fade-in-50"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard product={item} />
                  </div>
                ))
              ) : (
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
    </>
  );
}
