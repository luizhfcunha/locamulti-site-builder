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
        <div className="bg-white rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row p-4 gap-4 min-h-[100px] animate-in fade-in-50 duration-300">
            {/* Image Area - Fixed 120x100 */}
            <div className="w-full sm:w-[120px] h-[100px] shrink-0 bg-gray-50 rounded-md flex items-center justify-center">
                <img
                    src={product.image_url || "https://placehold.co/120x120/png?text=Equipamento"}
                    alt={product.name}
                    className="w-full h-full max-w-[100px] max-h-[90px] object-contain"
                    loading="lazy"
                />
            </div>

            {/* Content - Flexible Middle Area */}
            <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-base sm:text-lg leading-tight text-foreground">
                        {product.name}
                    </h3>
                    {isConsumable && <ConsumableBadge />}
                </div>

                {product.description && !isConsumable && (
                    <div className="mt-1">
                        <p className={`text-sm text-muted-foreground ${!isExpanded && isLongDescription ? 'line-clamp-2' : ''}`}>
                            {product.description}
                        </p>
                        {isLongDescription && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs text-primary hover:underline mt-1 flex items-center gap-1 font-medium"
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

            {/* WhatsApp CTA - Fixed Width on Desktop */}
            <div className="flex items-center justify-center sm:w-[180px] shrink-0">
                <Button
                    asChild
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm"
                >
                    <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                        <MessageCircle className="h-4 w-4 shrink-0" />
                        <span>Orçamento</span>
                        <span className="hidden md:inline">WhatsApp</span>
                    </a>
                </Button>
            </div>
        </div>
    );
};
