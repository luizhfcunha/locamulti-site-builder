import { Tag, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CatalogItem } from "@/lib/catalogNew";

interface ConsumableItemProps {
  item: CatalogItem;
  onViewDetails: (item: CatalogItem) => void;
}

export function ConsumableItem({ item, onViewDetails }: ConsumableItemProps) {
  return (
    <div className="bg-accent/30 border border-accent/50 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Icon/Image */}
        <div className="flex-shrink-0">
          {item.image_url ? (
            <img 
              src={item.image_url} 
              alt={item.code}
              className="w-16 h-16 object-contain rounded-lg bg-muted"
            />
          ) : (
            <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center">
              <Tag className="h-6 w-6 text-accent-foreground/70" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2 flex-wrap">
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Consumível
            </Badge>
            <span className="font-heading font-medium text-foreground">
              [{item.code}]
            </span>
          </div>
          
          {/* Description - EXATAMENTE como está na planilha */}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {item.description}
          </p>
        </div>

        {/* Action */}
        <div className="flex-shrink-0">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onViewDetails(item)}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            Detalhes
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
