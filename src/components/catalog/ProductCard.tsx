import { Product } from "@/types/catalog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const isConsumable = product.isConsumable || product.description?.toLowerCase().includes('consumível');

    // Construct WhatsApp message
    const waNumber = "5511999999999"; // Replace with actual number if known, or use env
    const message = encodeURIComponent(`Olá! Gostaria de mais informações sobre o equipamento: ${product.name}`);
    const waLink = `https://wa.me/${waNumber}?text=${message}`;

    return (
        <div className="bg-white rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full group">
            {/* Image Area */}
            <div className="aspect-square p-6 relative bg-white flex items-center justify-center border-b border-border/10">
                <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />

                {isConsumable && (
                    <Badge variant="secondary" className="absolute top-3 right-3 bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">
                        Acessório
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80">
                        {/* Optional breadcrumb-like small text could go here */}
                        Ref: {product.order || product.id}
                    </span>
                    <h3 className="font-heading font-bold text-base leading-tight text-foreground line-clamp-2 mt-1 min-h-[2.5rem]">
                        {product.name}
                    </h3>
                </div>

                {product.description && !isConsumable && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                        {product.description}
                    </p>
                )}

                {/* Spacer if no description to keep button at bottom */}
                <div className="flex-1" />

                <div className="pt-4 mt-auto">
                    <Button
                        asChild
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                    >
                        <a href={waLink} target="_blank" rel="noreferrer">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Orçar Agora
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
};
