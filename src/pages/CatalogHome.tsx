import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Layers } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogCategoryCard } from "@/components/catalog/CatalogCategoryCard";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { getCatalogCategories, type CatalogCategory } from "@/lib/catalogNew";

export default function CatalogHome() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      const data = await getCatalogCategories();
      setCategories(data);
      setIsLoading(false);
    }
    loadCategories();
  }, []);

  return (
    <>
      <Helmet>
        <title>Catálogo de Equipamentos | LocaMulti</title>
        <meta 
          name="description" 
          content="Explore nosso catálogo completo de equipamentos para locação: demolição, perfuração, soldagem, movimentação de cargas e muito mais." 
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  Catálogo de Equipamentos
                </h1>
                <p className="text-muted-foreground">
                  Navegue por categoria para encontrar o equipamento ideal
                </p>
              </div>
            </div>
            
            {/* Search */}
            <CatalogSearch className="max-w-xl" />
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CatalogCategoryCard key={category.category_no} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Layers className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold text-muted-foreground mb-2">
                Catálogo vazio
              </h2>
              <p className="text-muted-foreground">
                Nenhuma categoria disponível no momento.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
