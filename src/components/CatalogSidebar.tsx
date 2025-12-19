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
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Categorias
              </h3>
              <Accordion
                type="single"
                collapsible
                value={expandedCategory || undefined}
                onValueChange={(value) => onExpandedCategoryChange?.(value || null)}
                className="space-y-0.5"
              >
                {categories.map((item) => (
                  <AccordionItem key={item.category} value={item.category} className="border-0">
                    <AccordionTrigger
                      className="w-full px-3 py-2 text-[14px] font-semibold text-foreground hover:text-primary hover:bg-muted/50 rounded-lg data-[state=open]:bg-primary/5 data-[state=open]:text-primary"
                    >
                      <span className="text-left break-words leading-tight">{item.category}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-1">
                      <div className="ml-3 pl-3 border-l-2 border-border/50">
                        {/* Families nested accordion */}
                        <Accordion
                          type="single"
                          collapsible
                          value={expandedFamily || undefined}
                          onValueChange={(value) => onExpandedFamilyChange?.(value || null)}
                          className="space-y-0"
                        >
                          {item.families.map((family) => (
                            <AccordionItem key={family.name} value={family.name} className="border-0">
                              <AccordionTrigger
                                className="w-full px-2 py-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-md data-[state=open]:text-foreground"
                              >
                                <span className="text-left break-words leading-snug">{family.name}</span>
                              </AccordionTrigger>
                              <AccordionContent className="pb-1">
                                <div className="space-y-0 ml-2 pl-2 border-l border-border/30">
                                  {family.subfamilies.map((subfamily) => {
                                    const isActive =
                                      selectedCategory === item.category &&
                                      selectedFamily === family.name &&
                                      selectedSubfamily === subfamily;
                                    return (
                                      <Button
                                        key={subfamily}
                                        variant="ghost"
                                        className={`w-full justify-start text-left text-[12px] h-auto min-h-[28px] py-1 px-2 rounded font-normal whitespace-normal ${isActive
                                          ? "bg-primary/10 text-primary font-medium hover:bg-primary/15"
                                          : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                                          }`}
                                        onClick={() => onSubfamilyClick?.(item.category, family.name, subfamily)}
                                      >
                                        <span className="text-left break-words leading-snug">{subfamily}</span>
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
