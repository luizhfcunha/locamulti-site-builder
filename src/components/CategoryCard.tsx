import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  imageUrl?: string;
  onClick?: () => void;
}

export const CategoryCard = ({ title, icon: Icon, imageUrl, onClick }: CategoryCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div 
      className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Container - Aspect 4:3 */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {imageUrl && !hasError ? (
          <>
            {/* Placeholder blur skeleton */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted animate-pulse transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
            >
              <Icon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-muted-foreground/30" />
            </div>
            <img
              src={imageUrl}
              alt={title}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-secondary">
            <Icon className="h-16 w-16 text-muted-foreground/40" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent opacity-60" />
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col gap-3 flex-grow">
        <h3 className="font-heading text-lg md:text-xl font-bold text-foreground line-clamp-2 text-center">
          {title}
        </h3>
        
        <div className="mt-auto">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            Ver Categoria
          </Button>
        </div>
      </div>
    </div>
  );
};
