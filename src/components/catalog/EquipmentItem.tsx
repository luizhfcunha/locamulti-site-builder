import { Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/lib/catalogNew";

interface EquipmentItemProps {
  item: CatalogItem;
  onViewDetails: (item: CatalogItem) => void;
}

export function EquipmentItem({ item, onViewDetails }: EquipmentItemProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Icon/Image */}
        <div className="flex-shrink-0">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.code}
              className="w-20 h-20 object-contain rounded-lg bg-muted"
            />
          ) : (
            <div className="w-20 h-20 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="h-8 w-8 text-primary" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h4 className="font-heading font-semibold text-foreground">
              <span className="text-primary">[{item.code}]</span>
            </h4>
          </div>
          
          {/* Description - EXATAMENTE como está na planilha */}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {item.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(item)}
            className="gap-2"
          >
            Ver detalhes
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
