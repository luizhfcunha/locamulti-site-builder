import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  imageUrl?: string;
  onClick?: () => void;
}

export const CategoryCard = ({ title, icon: Icon, imageUrl, onClick }: CategoryCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-medium transition-all duration-base cursor-pointer rounded-card">
      <div 
        className="relative h-48 bg-muted overflow-hidden"
        onClick={onClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-slow"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-lm-muted to-secondary">
            <Icon className="h-16 w-16 text-lm-ink/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-lm-ink/60 to-transparent" />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-heading text-lg font-bold text-foreground line-clamp-2">
          {title}
        </h3>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={onClick}
        >
          Ver Equipamentos
        </Button>
      </CardFooter>
    </Card>
  );
};
