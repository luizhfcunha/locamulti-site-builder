import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CategoryWithSubcategories {
  category: string;
  subcategories: string[];
}

interface CatalogSidebarProps {
  categories: CategoryWithSubcategories[];
  onSearch?: (query: string) => void;
  onSubcategoryClick?: (category: string, subcategory: string) => void;
  selectedCategory?: string | null;
  selectedSubcategory?: string | null;
  expandedCategory?: string | null;
  onExpandedChange?: (category: string | null) => void;
}

export const CatalogSidebar = ({
  categories,
  onSearch,
  onSubcategoryClick,
  selectedCategory,
  selectedSubcategory,
  expandedCategory,
  onExpandedChange,
}: CatalogSidebarProps) => {
  return (
    <aside className="w-full lg:w-80 bg-background border-r border-border">
      <div className="sticky top-24 p-6">
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6 pr-4">
            {/* Search */}
            {onSearch && (
              <>
                <div>
                  <SearchInput
                    onChange={(e) => onSearch(e.target.value)}
                    placeholder="Buscar equipamentos..."
                  />
                </div>
                <Separator />
              </>
            )}

            {/* Categories Accordion */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-foreground">Categorias</h3>
              <Accordion
                type="single"
                collapsible
                value={expandedCategory || undefined}
                onValueChange={(value) => onExpandedChange?.(value || null)}
              >
                {categories.map((item) => (
                  <AccordionItem key={item.category} value={item.category} className="border-b border-border">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary hover:no-underline py-3">
                      {item.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 pl-4">
                        {item.subcategories.map((subcategory) => {
                          const isActive = selectedCategory === item.category && selectedSubcategory === subcategory;
                          return (
                            <Button
                              key={subcategory}
                              variant="ghost"
                              className={`w-full justify-start text-sm h-auto py-2 ${
                                isActive
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                              }`}
                              onClick={() => onSubcategoryClick?.(item.category, subcategory)}
                            >
                              {subcategory}
                            </Button>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};
