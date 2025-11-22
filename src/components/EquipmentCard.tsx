import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { WHATSAPP } from "@/config/whatsapp";

interface EquipmentCardProps {
  name: string;
  category: string;
  imageUrl?: string;
  specifications?: string[];
  brand?: string;
}

export const EquipmentCard = ({ 
  name, 
  category, 
  imageUrl, 
  specifications = [],
  brand 
}: EquipmentCardProps) => {
  const handleWhatsAppClick = () => {
    const url = WHATSAPP.catalogoEquipamento.replace('[EQUIPAMENTO]', encodeURIComponent(name));
    window.open(url, "_blank");
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
        <Button 
          variant="default" 
          className="w-full gap-2"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4" />
          Solicitar Orçamento
        </Button>
      </CardFooter>
    </Card>
  );
};
