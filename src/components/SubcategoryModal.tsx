import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SubcategoryModalProps {
  isOpen: boolean;
  category: string;
  subcategories: string[];
  onClose: () => void;
  onSelectSubcategory: (subcategory: string) => void;
}

export const SubcategoryModal = ({
  isOpen,
  category,
  subcategories,
  onClose,
  onSelectSubcategory,
}: SubcategoryModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading text-foreground">
            Subcategorias de {category}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {subcategories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma subcategoria disponível
            </p>
          ) : (
            subcategories.map((subcategory) => (
              <Button
                key={subcategory}
                variant="outline"
                className="w-full justify-start hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  onSelectSubcategory(subcategory);
                  onClose();
                }}
              >
                {subcategory}
              </Button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
