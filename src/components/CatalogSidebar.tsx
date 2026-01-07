import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { SidebarCategoryData } from "@/lib/catalogNew";

// Re-export for backwards compatibility
export type CategoryData = SidebarCategoryData;
export type FamilyData = SidebarCategoryData["families"][0];

interface CatalogSidebarProps {
  categories: SidebarCategoryData[];
  selectedCategorySlug?: string | null;
  selectedFamilySlug?: string | null;
  expandedCategorySlug?: string | null;
  onExpandedCategoryChange?: (slug: string | null) => void;
}

export const CatalogSidebar = ({
  categories,
  selectedCategorySlug,
  selectedFamilySlug,
  expandedCategorySlug,
  onExpandedCategoryChange,
}: CatalogSidebarProps) => {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const handleFamilyClick = (categorySlug: string, familySlug: string) => {
    navigate(`/catalogo/${categorySlug}/${familySlug}`);
  };

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/catalogo/${categorySlug}`);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-background">
      <SidebarHeader className="p-4 border-b border-border">
        <h2 className={`font-semibold text-foreground ${isCollapsed ? 'sr-only' : 'text-lg'}`}>
          Catálogo
        </h2>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
              Categorias
            </SidebarGroupLabel>

            <Accordion
              type="single"
              collapsible
              value={expandedCategorySlug || undefined}
              onValueChange={(value) => onExpandedCategoryChange?.(value || null)}
              className="space-y-0.5"
            >
              {categories.map((category) => {
                const isSelected = selectedCategorySlug === category.slug;
                const totalItems = category.families.reduce(
                  (sum, f) => sum + f.equipmentCount + f.consumableCount,
                  0
                );

                return (
                  <AccordionItem key={category.slug} value={category.slug} className="border-0">
                    <div className="flex items-center">
                      <AccordionTrigger
                        className={`flex-1 px-3 py-2.5 text-[14px] font-medium hover:bg-muted/50 rounded-lg transition-colors
                          ${isSelected ? 'bg-primary/10 text-primary' : 'text-foreground'}
                          [&[data-state=open]]:bg-primary/5 [&[data-state=open]]:text-primary`}
                      >
                        <span className="text-left break-words leading-tight flex-1">
                          {!isCollapsed && category.name}
                        </span>
                        {!isCollapsed && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({totalItems})
                          </span>
                        )}
                      </AccordionTrigger>
                    </div>

                    <AccordionContent className="pb-1">
                      <SidebarMenu className="ml-3 pl-3 border-l-2 border-border/50">
                        {category.families.map((family) => {
                          const isFamilySelected = 
                            selectedCategorySlug === category.slug && 
                            selectedFamilySlug === family.slug;
                          const itemCount = family.equipmentCount + family.consumableCount;

                          return (
                            <SidebarMenuItem key={family.slug}>
                              <SidebarMenuButton
                                onClick={() => handleFamilyClick(category.slug, family.slug)}
                                isActive={isFamilySelected}
                                className={`w-full justify-between text-[13px] py-2 px-2 rounded-md
                                  ${isFamilySelected 
                                    ? 'bg-primary/10 text-primary font-medium' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                                  }`}
                              >
                                <span className="text-left break-words leading-snug flex-1">
                                  {family.name}
                                </span>
                                <span className="text-xs opacity-60 ml-2 flex items-center gap-1">
                                  {itemCount}
                                  <ChevronRight className="h-3 w-3" />
                                </span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};
