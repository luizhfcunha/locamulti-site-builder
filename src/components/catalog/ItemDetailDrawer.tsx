import { Package, Tag, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { WHATSAPP } from "@/config/whatsapp";
import type { CatalogItem } from "@/lib/catalogNew";
import { findImageForProduct } from "@/utils/imageMatcher";

const WHATSAPP_NUMBER = "5562984194024";

interface ItemDetailDrawerProps {
  item: CatalogItem | null;
  open: boolean;
  onClose: () => void;
}

export function ItemDetailDrawer({ item, open, onClose }: ItemDetailDrawerProps) {
  if (!item) return null;

  const isConsumivel = item.item_type === 'consumivel';
  
  // Fallback: se image_url é null, tentar encontrar via matching
  const imageUrl = item.image_url || findImageForProduct(item.code, item.description);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Olá! Gostaria de informações sobre o item: [${item.code}] - ${item.description.substring(0, 100)}...`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {isConsumivel ? (
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6 text-accent-foreground/70" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <SheetTitle className="text-left text-xl">
                  {item.code}
                </SheetTitle>
                {isConsumivel && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground mt-1">
                    Consumível
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Image */}
        {imageUrl && (
          <div className="mb-6">
            <img 
              src={imageUrl} 
              alt={item.code}
              className="w-full h-64 object-contain rounded-xl bg-muted"
            />
          </div>
        )}

        {/* Info */}
        <div className="space-y-6">
          {/* Categoria e Família */}
          <div className="flex flex-wrap gap-2 text-sm">
            <Badge variant="outline">{item.category_name}</Badge>
            <Badge variant="outline">{item.family_name}</Badge>
          </div>

          {/* Descrição / Especificação Técnica */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-muted-foreground mb-2">
              Descrição / Especificação Técnica
            </h4>
            {/* EXIBIR EXATAMENTE COMO ESTÁ NA PLANILHA */}
            <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* CTA WhatsApp */}
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white"
            size="lg"
          >
            <Phone className="h-5 w-5" />
            Solicitar Orçamento via WhatsApp
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
