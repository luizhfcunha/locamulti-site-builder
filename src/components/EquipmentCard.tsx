import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { WHATSAPP } from "@/config/whatsapp";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";
import { EquipmentLightbox } from "@/components/lightbox/EquipmentLightbox";

interface EquipmentCardProps {
  id?: string;
  name: string;
  category: string;
  subcategory?: string | null;
  imageUrl?: string;
  specifications?: string[];
  brand?: string;
}

export const EquipmentCard = ({
  id,
  name,
  category,
  subcategory,
  imageUrl,
  specifications = [],
  brand
}: EquipmentCardProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Track product view on mount
  useEffect(() => {
    if (id) {
      // Use a small timeout to avoid blocking render and to debounce rapid scrolls if needed in future
      const timer = setTimeout(() => {
        trackEvent({ event_type: 'product_view', catalog_item_id: id });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  const handleWhatsAppClick = () => {
    if (id) {
      trackWhatsAppClick(id);
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-medium transition-all duration-base rounded-card h-full flex flex-col">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="relative h-56 bg-muted overflow-hidden w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label={`Ver imagens de ${name}`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            width={400}
            height={224}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lm-muted to-secondary">
            <span className="text-4xl text-lm-ink/20">📦</span>
          </div>
        )}
      </button>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          {brand && (
            <span className="text-xs text-muted-foreground font-medium">
              {brand}
            </span>
          )}
        </div>
        <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2">
          {name}
        </h3>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        {specifications.length > 0 && (
          <ul className="space-y-1">
            {specifications.slice(0, 3).map((spec, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="line-clamp-1">{spec}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <WhatsappCTA
          text="Solicitar Orçamento"
          href={WHATSAPP.catalogoEquipamento.replace('[EQUIPAMENTO]', encodeURIComponent(name))}
          fullWidth
          onClick={handleWhatsAppClick}
        />
      </CardFooter>

      {/* Lightbox Modal */}
      {id && (
        <EquipmentLightbox
          equipmentId={id}
          equipmentName={name}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </Card>
  );
};
