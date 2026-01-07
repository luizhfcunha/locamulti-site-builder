import { Product } from "@/types/catalog";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProductListProps {
    products: Product[];
    isLoading: boolean;
    onClearFilters: () => void;
}

export const ProductList = ({ products, isLoading, onClearFilters }: ProductListProps) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-card shadow-sm">
                        <Skeleton className="w-full sm:w-[140px] h-48 sm:h-32 rounded-md" />
                        <div className="flex-1 space-y-3 py-2">
                            <div className="flex justify-between">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <div className="flex justify-end pt-2">
                                <Skeleton className="h-10 w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-muted/20 rounded-xl border-2 border-dashed border-border mt-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                    <div className="text-4xl">🔍</div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Nenhum equipamento encontrado</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                    Não encontramos resultados para esta busca. Tente verificar a ortografia ou usar termos mais genéricos.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={onClearFilters} variant="default" className="gap-2">
                        Ver todas as categorias
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/contato'}>
                        Falar com consultor
                    </Button>
                </div>

                {/* Sugestões de categorias populares poderiam entrar aqui */}
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
