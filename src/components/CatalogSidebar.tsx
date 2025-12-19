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
    <aside className="w-full lg:w-72 flex-shrink-0 bg-background border-r border-border">
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
            <div className="space-y-1">
              <h3 className="font-heading font-semibold text-foreground px-2 mb-3">Categorias</h3>
              <Accordion
                type="single"
                collapsible
                value={expandedCategory || undefined}
                onValueChange={(value) => onExpandedCategoryChange?.(value || null)}
              >
                {categories.map((item) => (
                  <AccordionItem key={item.category} value={item.category} className="border-b-0 mb-1">
                    <AccordionTrigger
                      className="px-3 py-0 h-12 text-base font-heading font-semibold text-foreground hover:text-primary hover:bg-muted/50 rounded-md transition-colors data-[state=open]:bg-muted/50 data-[state=open]:text-primary hover:no-underline"
                    >
                      {item.category}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 pt-1">
                      <div className="pl-4 border-l-2 border-border/50 ml-3 my-1">
                        {/* Families nested accordion */}
                        <Accordion
                          type="single"
                          collapsible
                          value={expandedFamily || undefined}
                          onValueChange={(value) => onExpandedFamilyChange?.(value || null)}
                        >
                          {item.families.map((family) => (
                            <AccordionItem key={family.name} value={family.name} className="border-b-0">
                              <AccordionTrigger
                                className="px-3 py-0 h-10 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md transition-colors data-[state=open]:text-foreground data-[state=open]:bg-muted/30 hover:no-underline"
                              >
                                {family.name}
                              </AccordionTrigger>
                              <AccordionContent className="pb-1 pt-0">
                                <div className="space-y-0.5 pl-3 pt-1">
                                  {family.subfamilies.map((subfamily) => {
                                    const isActive =
                                      selectedCategory === item.category &&
                                      selectedFamily === family.name &&
                                      selectedSubfamily === subfamily;
                                    return (
                                      <Button
                                        key={subfamily}
                                        variant="ghost"
                                        className={`w-full justify-start text-sm h-9 px-3 rounded-md font-normal transition-all duration-200 ${isActive
                                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:pl-4"
                                          }`}
                                        onClick={() => onSubfamilyClick?.(item.category, family.name, subfamily)}
                                      >
                                        <span className="truncate">{subfamily}</span>
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
