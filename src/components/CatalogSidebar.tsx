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
            <div className="space-y-2">
              <h3 className="font-heading font-semibold text-foreground text-sm uppercase tracking-wide px-3 mb-4 text-muted-foreground">
                Categorias
              </h3>
              <Accordion
                type="single"
                collapsible
                value={expandedCategory || undefined}
                onValueChange={(value) => onExpandedCategoryChange?.(value || null)}
                className="space-y-1"
              >
                {categories.map((item) => (
                  <AccordionItem key={item.category} value={item.category} className="border-0">
                    <AccordionTrigger
                      className="px-3 py-2.5 text-sm font-heading font-semibold text-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors data-[state=open]:bg-primary/5 data-[state=open]:text-primary hover:no-underline"
                    >
                      {item.category}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2 pt-1">
                      <div className="ml-3 pl-3 border-l-2 border-border/60">
                        {/* Families nested accordion */}
                        <Accordion
                          type="single"
                          collapsible
                          value={expandedFamily || undefined}
                          onValueChange={(value) => onExpandedFamilyChange?.(value || null)}
                          className="space-y-0.5"
                        >
                          {item.families.map((family) => (
                            <AccordionItem key={family.name} value={family.name} className="border-0">
                              <AccordionTrigger
                                className="px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 rounded-md transition-colors data-[state=open]:text-foreground data-[state=open]:font-semibold hover:no-underline"
                              >
                                {family.name}
                              </AccordionTrigger>
                              <AccordionContent className="pb-1.5 pt-0.5">
                                <div className="space-y-0.5 ml-2 pl-2.5 border-l border-border/40">
                                  {family.subfamilies.map((subfamily) => {
                                    const isActive =
                                      selectedCategory === item.category &&
                                      selectedFamily === family.name &&
                                      selectedSubfamily === subfamily;
                                    return (
                                      <Button
                                        key={subfamily}
                                        variant="ghost"
                                        className={`w-full justify-start text-[13px] h-8 px-2.5 rounded-md font-normal transition-all duration-200 ${isActive
                                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15 hover:text-primary"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
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
