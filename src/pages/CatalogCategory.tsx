import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Wrench } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogBreadcrumb } from "@/components/catalog/CatalogBreadcrumb";
import { CatalogFamilyCard } from "@/components/catalog/CatalogFamilyCard";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { 
  getCatalogFamilies, 
  getCategoryBySlug,
  type CatalogFamily 
} from "@/lib/catalogNew";

export default function CatalogCategory() {
  const { categoriaSlug } = useParams<{ categoriaSlug: string }>();
  const [families, setFamilies] = useState<CatalogFamily[]>([]);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!categoriaSlug) return;
      
      setIsLoading(true);
      
      const [familiesData, categoryData] = await Promise.all([
        getCatalogFamilies(categoriaSlug),
        getCategoryBySlug(categoriaSlug)
      ]);
      
      setFamilies(familiesData);
      setCategory(categoryData);
      setIsLoading(false);
    }
    loadData();
  }, [categoriaSlug]);

  return (
    <>
      <Helmet>
        <title>{category?.name || 'Categoria'} | Catálogo LocaMulti</title>
        <meta 
          name="description" 
          content={`Equipamentos de ${category?.name || 'locação'} disponíveis na LocaMulti. Confira as famílias de produtos.`} 
        />
      </Helmet>
      
      <Header />
      
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <CatalogBreadcrumb 
            items={category ? [{ label: category.name }] : []}
          />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                  {category?.name || 'Carregando...'}
                </h1>
                <p className="text-muted-foreground">
                  Selecione uma família de equipamentos
                </p>
              </div>
            </div>
            
            {/* Search */}
            <CatalogSearch className="max-w-xl" />
          </div>

          {/* Families Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : families.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {families.map((family) => (
                <CatalogFamilyCard key={family.family_no} family={family} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Wrench className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-heading font-semibold text-muted-foreground mb-2">
                Nenhuma família encontrada
              </h2>
              <p className="text-muted-foreground">
                Não há famílias de equipamentos nesta categoria.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
