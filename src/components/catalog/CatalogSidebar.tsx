import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronRight, ChevronDown, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getAllCategories } from "@/data/catalogData";
import { Category } from "@/types/catalog";

const SidebarContent = ({
    categories,
    activeCategory,
    activeFamily,
    expandedCategories,
    toggleCategory,
    onFamilySelect
}: {
    categories: Category[];
    activeCategory: string | null;
    activeFamily: string | null;
    expandedCategories: string[];
    toggleCategory: (slug: string) => void;
    onFamilySelect: (categorySlug: string, familySlug: string | null) => void;
}) => {
    return (
        <div className="py-4 pr-4">
            <div className="space-y-2">
                {/* Reset Filter Button */}
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground mb-4 pl-2"
                    onClick={() => onFamilySelect("", null)}
                >
                    <span className="uppercase text-sm font-semibold tracking-wider">Todos os Equipamentos</span>
                </Button>

                {categories.map((category) => {
                    const isExpanded = expandedCategories.includes(category.slug);
                    const isActive = activeCategory === category.slug;

                    return (
                        <div key={category.slug} className="space-y-1">
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-between hover:bg-muted/50 rounded-lg h-auto py-2 px-3",
                                    isActive && "bg-muted font-medium"
                                )}
                                onClick={() => toggleCategory(category.slug)}
                            >
                                <span className="uppercase text-xs font-bold leading-tight text-left whitespace-normal text-muted-foreground group-hover:text-foreground">
                                    {category.name}
                                </span>
                                {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                ) : (
                                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                )}
                            </Button>

                            <div
                                className={cn(
                                    "grid transition-all duration-200 ease-in-out pl-4 border-l ml-3 border-border/50",
                                    isExpanded ? "grid-rows-[1fr] opacity-100 mb-2" : "grid-rows-[0fr] opacity-0"
                                )}
                            >
                                <div className="overflow-hidden">
                                    <div className="space-y-1 pt-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={cn(
                                                "w-full justify-start text-xs h-8 font-normal truncate",
                                                isActive && !activeFamily && "text-primary bg-primary/5 font-medium"
                                            )}
                                            onClick={() => onFamilySelect(category.slug, null)}
                                        >
                                            Ver todos em {category.name}
                                        </Button>
                                        {category.families.map((family) => {
                                            const isFamilyActive = activeCategory === category.slug && activeFamily === family.slug;
                                            return (
                                                <Button
                                                    key={family.slug}
                                                    variant="ghost"
                                                    size="sm"
                                                    className={cn(
                                                        "w-full justify-start text-xs h-auto py-1.5 whitespace-normal text-left",
                                                        isFamilyActive
                                                            ? "bg-orange-100 border-l-4 border-orange-500 text-orange-900 rounded-r-md rounded-l-none pl-2"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                    onClick={() => onFamilySelect(category.slug, family.slug)}
                                                >
                                                    {family.name}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const CatalogSidebar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const categories = getAllCategories();

    const activeCategory = searchParams.get("categoria");
    const activeFamily = searchParams.get("familia");

    // Sync state with URL on mount and updates
    useEffect(() => {
        if (activeCategory) {
            setExpandedCategories(prev => {
                if (!prev.includes(activeCategory)) {
                    return [...prev, activeCategory];
                }
                return prev;
            });
        }
    }, [activeCategory]);

    const toggleCategory = (slug: string) => {
        setExpandedCategories(prev =>
            prev.includes(slug)
                ? prev.filter(c => c !== slug)
                : [...prev, slug]
        );
    };

    const handleFamilySelect = (categorySlug: string, familySlug: string | null) => {
        const newParams = new URLSearchParams(searchParams);

        if (categorySlug) {
            newParams.set("categoria", categorySlug);
            if (familySlug) {
                newParams.set("familia", familySlug);
            } else {
                newParams.delete("familia");
            }
        } else {
            newParams.delete("categoria");
            newParams.delete("familia");
        }

        setSearchParams(newParams);
        // Expand the selected category if not expanded
        if (categorySlug && !expandedCategories.includes(categorySlug)) {
            toggleCategory(categorySlug);
        }

        setIsMobileOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[280px] sticky top-24 h-[calc(100vh-6rem)]">
                <ScrollArea className="h-full pr-2">
                    <SidebarContent
                        categories={categories}
                        activeCategory={activeCategory}
                        activeFamily={activeFamily}
                        expandedCategories={expandedCategories}
                        toggleCategory={toggleCategory}
                        onFamilySelect={handleFamilySelect}
                    />
                </ScrollArea>
            </div>

            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden mb-4">
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                            <span className="flex items-center gap-2">
                                <Menu className="h-4 w-4" />
                                Filtrar Equipamentos
                            </span>
                            {(activeCategory || activeFamily) && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    Ativo
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                        <SheetHeader className="p-4 border-b text-left">
                            <SheetTitle>Categorias</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-80px)] px-4">
                            <SidebarContent
                                categories={categories}
                                activeCategory={activeCategory}
                                activeFamily={activeFamily}
                                expandedCategories={expandedCategories}
                                toggleCategory={toggleCategory}
                                onFamilySelect={handleFamilySelect}
                            />
                        </ScrollArea>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};
