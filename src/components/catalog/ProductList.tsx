import { CatalogItem } from "@/lib/catalogNew";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Layers, ArrowLeft } from "lucide-react";

interface ProductListProps {
    products: CatalogItem[];
    isLoading: boolean;
    onClearFilters?: () => void;
    categoryName?: string;
}

export const ProductList = ({ products, isLoading, onClearFilters, categoryName }: ProductListProps) => {

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-muted/50 rounded-lg h-[120px] animate-pulse flex">
                        <div className="w-[120px] h-full bg-muted rounded-l-lg" />
                        <div className="flex-1 p-4 space-y-3">
                            <div className="h-5 bg-muted rounded w-2/3" />
                            <div className="h-3 bg-muted rounded w-1/2" />
                            <div className="h-3 bg-muted rounded w-3/4" />
                        </div>
                        <div className="w-[200px] bg-muted/30 rounded-r-lg" />
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-16 bg-gradient-to-b from-muted/20 to-transparent rounded-2xl border border-dashed border-border">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Layers className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                    Nenhum equipamento encontrado
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                    {categoryName
                        ? `A categoria "${categoryName}" não possui equipamentos cadastrados no momento.`
                        : "Não encontramos itens com os filtros selecionados. Tente navegar por outra categoria."}
                </p>
                {onClearFilters && (
                    <Button onClick={onClearFilters} size="lg" variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Ver Todas as Categorias
                    </Button>
                )}
            </div>
        );
    }

    // Separate into equipment first, consumables last
    const equipments = products.filter(p => p.item_type === 'equipamento');
    const consumables = products.filter(p => p.item_type === 'consumivel');
    const sortedProducts = [...equipments, ...consumables];

    return (
        <div className="flex flex-col gap-4">
            {sortedProducts.map((product, index) => (
                <div
                    key={product.id || product.code}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-in fade-in-50 slide-in-from-bottom-2"
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};
