import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/CatalogSidebar";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { SidebarCategoryData } from "@/lib/catalogNew";

interface CatalogLayoutProps {
  children: ReactNode;
  categories: SidebarCategoryData[];
  selectedCategorySlug?: string | null;
  selectedFamilySlug?: string | null;
  expandedCategorySlug?: string | null;
  onExpandedCategoryChange?: (slug: string | null) => void;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
}

export function CatalogLayout({
  children,
  categories,
  selectedCategorySlug,
  selectedFamilySlug,
  expandedCategorySlug,
  onExpandedCategoryChange,
  showSearch = true,
  title,
  subtitle,
}: CatalogLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        
        <div className="flex flex-1 pt-16 lg:pt-20">
          {/* Sidebar - hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block">
            <CatalogSidebar
              categories={categories}
              selectedCategorySlug={selectedCategorySlug}
              selectedFamilySlug={selectedFamilySlug}
              expandedCategorySlug={expandedCategorySlug}
              onExpandedCategoryChange={onExpandedCategoryChange}
            />
          </div>

          {/* Main content area */}
          <main className="flex-1 bg-background">
            <div className="container mx-auto px-4 py-6 lg:py-8">
              {/* Mobile sidebar trigger */}
              <div className="lg:hidden mb-4">
                <SidebarTrigger className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
                  <Menu className="h-4 w-4" />
                  <span>Filtrar Categorias</span>
                </SidebarTrigger>
              </div>

              {/* Page header */}
              {(title || subtitle || showSearch) && (
                <div className="mb-8">
                  {title && (
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-muted-foreground mb-4">{subtitle}</p>
                  )}
                  {showSearch && (
                    <div className="max-w-md">
                      <CatalogSearch />
                    </div>
                  )}
                </div>
              )}

              {/* Page content */}
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </SidebarProvider>
  );
}
