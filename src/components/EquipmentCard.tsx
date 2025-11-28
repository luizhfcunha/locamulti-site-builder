import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { WHATSAPP } from "@/config/whatsapp";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";

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
  // Track product view on mount
  useEffect(() => {
    if (id) {
      trackEvent({ event_type: 'product_view', product_id: id });
    }
  }, [id]);

  const handleWhatsAppClick = () => {
    if (id) {
      trackWhatsAppClick(id);
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-medium transition-all duration-base rounded-card h-full flex flex-col">
      <div className="relative h-56 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lm-muted to-secondary">
            <span className="text-4xl text-lm-ink/20">📦</span>
          </div>
        )}
      </div>
      
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
    </Card>
  );
};
