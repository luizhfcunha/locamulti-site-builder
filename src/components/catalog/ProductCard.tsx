import { useState } from "react";
import { CatalogItem } from "@/lib/catalogNew";
import { ConsumableBadge } from "./ConsumableBadge";
import { EquipmentLightbox } from "@/components/lightbox/EquipmentLightbox";
import { WHATSAPP } from "@/config/whatsapp";

interface ProductCardProps {
  product: CatalogItem;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const isConsumable = product.item_type === "consumivel";

  const displayName = product.name || product.code;
  const waLink = WHATSAPP.catalogoEquipamento.replace("[EQUIPAMENTO]", encodeURIComponent(displayName));

  return (
    <div className="bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-row p-3 sm:p-4 gap-3 sm:gap-4 min-h-[100px] animate-in fade-in-50 duration-300">
      {/* Image Area - Fixed size - Clickable para lightbox */}
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="w-[100px] sm:w-[120px] h-[100px] shrink-0 bg-muted/30 rounded-md flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label={`Ver imagens de ${displayName}`}
      >
        <img
          src={product.image_url || "https://placehold.co/120x120/png?text=Equipamento"}
          alt={displayName}
          width={100}
          height={90}
          loading="lazy"
          decoding="async"
          className="w-full h-full max-w-[100px] max-h-[90px] object-contain pointer-events-none"
          style={{ backgroundColor: "#f6f3f2" }}
        />
      </button>

      {/* Content - Flexible Middle Area */}
      <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
        <div className="flex items-start gap-2 flex-wrap">
          <h3 className="font-heading font-bold text-base sm:text-lg leading-tight text-foreground">{displayName}</h3>
          {isConsumable && <ConsumableBadge />}
        </div>

        {product.description && !isConsumable && (
          <div className="mt-1">
            <p className="text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
          </div>
        )}
      </div>

      {/* WhatsApp CTA - Icon only on mobile/tablet, full text on desktop */}
      <div className="flex items-center justify-center shrink-0">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 p-3 lg:px-5 lg:py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md min-h-[44px]"
        >
          <img
            src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png"
            alt="WhatsApp"
            className="w-6 h-6 shrink-0"
          />
          <span className="hidden lg:inline whitespace-nowrap">Orçamento WhatsApp</span>
        </a>
      </div>

      {/* Lightbox Modal */}
      <EquipmentLightbox
        equipmentId={product.id}
        equipmentName={displayName}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
