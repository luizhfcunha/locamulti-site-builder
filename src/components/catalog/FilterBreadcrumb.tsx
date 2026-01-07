import { ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterBreadcrumbProps {
    categoryName?: string;
    familyName?: string;
    onClearFilters: () => void;
    onClearFamily: () => void;
}

export const FilterBreadcrumb = ({
    categoryName,
    familyName,
    onClearFilters,
    onClearFamily
}: FilterBreadcrumbProps) => {
    return (
        <nav className="flex items-center text-sm text-muted-foreground flex-wrap gap-1">
            <Button
                variant="link"
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={onClearFilters}
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Início</span>
            </Button>

            <ChevronRight className="h-4 w-4" />

            <Button
                variant="link"
                className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                onClick={onClearFilters}
            >
                Equipamentos
            </Button>

            {categoryName && (
                <>
                    <ChevronRight className="h-4 w-4" />
                    {familyName ? (
                        <Button
                            variant="link"
                            className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
                            onClick={onClearFamily}
                        >
                            {categoryName}
                        </Button>
                    ) : (
                        <span className="font-medium text-foreground">{categoryName}</span>
                    )}
                </>
            )}

            {familyName && (
                <>
                    <ChevronRight className="h-4 w-4" />
                    <span className="font-medium text-foreground">{familyName}</span>
                </>
            )}
        </nav>
    );
};
