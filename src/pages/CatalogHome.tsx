import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Layers } from "lucide-react";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { CatalogCategoryCard } from "@/components/catalog/CatalogCategoryCard";
import { 
  getCatalogCategories, 
  getCatalogHierarchy,
  type CatalogCategory,
  type SidebarCategoryData
} from "@/lib/catalogNew";

export default function CatalogHome() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [sidebarCategories, setSidebarCategories] = useState<SidebarCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [categoriesData, hierarchyData] = await Promise.all([
        getCatalogCategories(),
        getCatalogHierarchy()
      ]);
      setCategories(categoriesData);
      setSidebarCategories(hierarchyData);
      setIsLoading(false);
    }
    loadData();
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
      
      <CatalogLayout 
        categories={sidebarCategories}
        title="Catálogo de Equipamentos"
        subtitle="Navegue por categoria para encontrar o equipamento ideal"
      >
        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
      </CatalogLayout>
    </>
  );
}
