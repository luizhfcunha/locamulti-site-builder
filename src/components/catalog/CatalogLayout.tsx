import { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { CatalogSearch } from "@/components/catalog/CatalogSearch";

interface CatalogLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  title?: string;
  subtitle?: string;
}

export function CatalogLayout({
  children,
  showSearch = true,
  title,
  subtitle,
}: CatalogLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header />
      
      <div className="flex flex-1 pt-16 lg:pt-20">
        {/* Sidebar handles its own state via URL params */}
        <CatalogSidebar />

        {/* Main content area */}
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-6 lg:py-8">
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
  );
}