import { Product } from "@/types/catalog";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";

interface ProductListProps {
    products: Product[];
    isLoading: boolean;
    onClearFilters?: () => void;
}

export const ProductList = ({ products, isLoading, onClearFilters }: ProductListProps) => {

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-muted rounded-xl" />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Layers className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                    Nenhum equipamento encontrado
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                    Não encontramos itens com os filtros selecionados. Tente navegar por outra categoria.
                </p>
                {onClearFilters && (
                    <Button onClick={onClearFilters}>
                        Limpar Filtros
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id || product.name} product={product} />
            ))}
        </div>
    );
};
