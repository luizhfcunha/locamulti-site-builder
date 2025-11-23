import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CatalogSidebarProps {
  categories: { id: string; label: string }[];
  onSearch?: (query: string) => void;
  onCategoryClick?: (categoryId: string) => void;
}

export const CatalogSidebar = ({
  categories,
  onSearch,
  onCategoryClick,
}: CatalogSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <aside className="w-full lg:w-80 bg-background border-r border-border">
      <div className="sticky top-24 p-6">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* Search */}
            <div>
              <SearchInput
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar equipamentos..."
              />
            </div>

            <Separator />

            {/* Categories */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-foreground">Categorias</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    onClick={() => onCategoryClick?.(category.id)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
