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
    if (!categoryName) return null;

    return (
        <div className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-4 font-medium">
            <div className="flex items-center hover:text-foreground transition-colors cursor-pointer" onClick={onClearFilters}>
                <Home className="h-4 w-4 mr-1" />
                Home
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

            <div className="hover:text-foreground transition-colors cursor-pointer" onClick={onClearFilters}>
                Equipamentos
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

            <div
                className={`hover:text-foreground transition-colors cursor-pointer ${!familyName ? 'text-primary font-bold' : ''}`}
                onClick={familyName ? onClearFamily : undefined}
            >
                {categoryName}
            </div>

            {familyName && (
                <>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                    <div className="text-primary font-bold">
                        {familyName}
                    </div>
                </>
            )}
        </div>
    );
};
