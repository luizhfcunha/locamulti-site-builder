import { useState } from "react";
import { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import { ConsumableBadge } from "./ConsumableBadge";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isConsumable = product.isConsumable || product.description?.toLowerCase().includes('consumível');

    // Check if description is long (more than ~150 chars)
    const isLongDescription = product.description && product.description.length > 150;

    // WhatsApp link with correct number
    const waNumber = "556298494024";
    const message = encodeURIComponent(`Olá! Gostaria de um orçamento para: ${product.name}`);
    const waLink = `https://wa.me/${waNumber}?text=${message}`;

    return (
        <div className="bg-white rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row min-h-[120px] animate-in fade-in-50 duration-300">
            {/* Image Area - 120x120 */}
            <div className="w-full sm:w-[120px] h-[120px] sm:h-auto shrink-0 p-2 bg-gray-50 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border/10">
                <img
                    src={product.image_url || "https://placehold.co/120x120/png?text=Equipamento"}
                    alt={product.name}
                    className="w-full h-full max-w-[100px] max-h-[100px] object-contain"
                    loading="lazy"
                />
            </div>

            {/* Content - Middle */}
            <div className="flex-1 p-4 flex flex-col justify-center gap-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-base sm:text-xl leading-tight text-foreground">
                        {product.name}
                    </h3>
                    {isConsumable && <ConsumableBadge />}
                </div>

                {product.description && !isConsumable && (
                    <div className="mt-1">
                        <p className={`text-sm text-gray-500 ${!isExpanded && isLongDescription ? 'line-clamp-3' : ''}`}>
                            {product.description}
                        </p>
                        {isLongDescription && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs text-primary hover:underline mt-1 flex items-center gap-1"
                            >
                                {isExpanded ? (
                                    <>Ver menos <ChevronUp className="h-3 w-3" /></>
                                ) : (
                                    <>Ver mais <ChevronDown className="h-3 w-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* WhatsApp Button - Right Side */}
            <div className="p-4 flex items-center justify-center border-t sm:border-t-0 sm:border-l border-border/10 bg-gray-50/50 sm:w-[200px] shrink-0">
                <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                >
                    <a href={waLink} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Orçamento WhatsApp
                    </a>
                </Button>
            </div>
        </div>
    );
};
