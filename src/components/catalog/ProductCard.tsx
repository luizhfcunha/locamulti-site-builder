import React from "react";
import { Product } from "@/types/catalog";
import { Card } from "@/components/ui/card";
import { ConsumableBadge } from "./ConsumableBadge";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { WHATSAPP } from "@/config/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const isConsumable = product.isConsumable || product.description?.toLowerCase().includes("consumível");

    const [isExpanded, setIsExpanded] = React.useState(false);

    // Decide if we need truncation (naive check based on length, or use CSS with state)
    // For simplicity and robustness with CSS line-clamp, we can toggle the class.
    const isLongDescription = (product.description?.length || 0) > 150;

    const toggleExpand = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsExpanded(!isExpanded);
    };

    return (
        <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-200 group">
            <div className="flex flex-col sm:flex-row">
                {/* Image Section - Fixed size */}
                <div className="w-full sm:w-[140px] h-48 sm:h-auto bg-muted/30 shrink-0 flex items-center justify-center p-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5" />
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain relative z-10 mix-blend-multiply"
                            loading="lazy"
                        />
                    ) : (
                        <div className="text-4xl opacity-20 grayscale">📦</div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between gap-3 bg-card">
                    <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-bold text-lg md:text-xl text-foreground leading-tight">
                                {product.name}
                            </h3>
                            {isConsumable && <ConsumableBadge />}
                        </div>

                        <div className="relative">
                            <p
                                className={cn(
                                    "text-sm text-muted-foreground transition-all duration-200",
                                    !isExpanded && "line-clamp-3"
                                )}
                            >
                                {product.description}
                            </p>
                            {isLongDescription && (
                                <button
                                    onClick={toggleExpand}
                                    className="text-xs font-semibold text-primary hover:underline mt-1 focus:outline-none"
                                >
                                    {isExpanded ? "Ver menos" : "Ver mais"}
                                </button>
                            )}
                        </div>

                        {/* Tags/Meta */}
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-muted-foreground">
                            {product.id && (
                                <span className="bg-muted/50 px-1.5 py-0.5 rounded font-mono text-[10px] opacity-70">
                                    COD: {product.id}
                                </span>
                            )}
                            {product.brand && <span className="font-medium bg-muted px-2 py-0.5 rounded">{product.brand}</span>}
                        </div>
                    </div>

                    <div className="flex justify-end mt-1 pt-2 border-t border-border/50">
                        <WhatsappCTA
                            text="Orçamento WhatsApp"
                            href={WHATSAPP.catalogoEquipamento.replace('[EQUIPAMENTO]', encodeURIComponent(product.name))}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 border-none shadow-sm"
                            onClick={() => trackWhatsAppClick(product.id)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
