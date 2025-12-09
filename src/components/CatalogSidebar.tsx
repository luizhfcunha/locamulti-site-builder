import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FamilyWithSubfamilies {
  name: string;
  subfamilies: string[];
}

interface CategoryWithHierarchy {
  category: string;
  families: FamilyWithSubfamilies[];
}

interface CatalogSidebarProps {
  categories: CategoryWithHierarchy[];
  onSearch?: (query: string) => void;
  onSubfamilyClick?: (category: string, family: string, subfamily: string) => void;
  selectedCategory?: string | null;
  selectedFamily?: string | null;
  selectedSubfamily?: string | null;
  expandedCategory?: string | null;
  expandedFamily?: string | null;
  onExpandedCategoryChange?: (category: string | null) => void;
  onExpandedFamilyChange?: (family: string | null) => void;
}

export const CatalogSidebar = ({
  categories,
  onSearch,
  onSubfamilyClick,
  selectedCategory,
  selectedFamily,
  selectedSubfamily,
  expandedCategory,
  expandedFamily,
  onExpandedCategoryChange,
  onExpandedFamilyChange,
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
                onValueChange={(value) => onExpandedCategoryChange?.(value || null)}
              >
                {categories.map((item) => (
                  <AccordionItem key={item.category} value={item.category} className="border-b border-border">
                    <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary hover:no-underline py-3">
                      {item.category}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-2">
                        {/* Families nested accordion */}
                        <Accordion
                          type="single"
                          collapsible
                          value={expandedFamily || undefined}
                          onValueChange={(value) => onExpandedFamilyChange?.(value || null)}
                        >
                          {item.families.map((family) => (
                            <AccordionItem key={family.name} value={family.name} className="border-b-0">
                              <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground hover:no-underline py-2">
                                {family.name}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-1 pl-4">
                                  {family.subfamilies.map((subfamily) => {
                                    const isActive = 
                                      selectedCategory === item.category && 
                                      selectedFamily === family.name && 
                                      selectedSubfamily === subfamily;
                                    return (
                                      <Button
                                        key={subfamily}
                                        variant="ghost"
                                        className={`w-full justify-start text-sm h-auto py-2 ${
                                          isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                        }`}
                                        onClick={() => onSubfamilyClick?.(item.category, family.name, subfamily)}
                                      >
                                        {subfamily}
                                      </Button>
                                    );
                                  })}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
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
