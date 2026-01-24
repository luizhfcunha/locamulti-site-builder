import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { LightboxCarousel } from "./LightboxCarousel";
import { LightboxControls } from "./LightboxControls";
import { useEquipmentImages } from "@/lib/queries/equipment";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface EquipmentLightboxProps {
  equipmentId: string;
  equipmentName: string;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export function EquipmentLightbox({
  equipmentId,
  equipmentName,
  isOpen,
  onClose,
  initialIndex = 0,
}: EquipmentLightboxProps) {
  const { data: images, isLoading, error } = useEquipmentImages(equipmentId);

  // Preload primeira imagem quando modal abre
  useEffect(() => {
    if (isOpen && images && images.length > 0) {
      const img = new Image();
      img.src = images[0].public_url;
    }
  }, [isOpen, images]);

  // ESC key para fechar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-transparent shadow-none"
        aria-labelledby="lightbox-title"
        aria-describedby="lightbox-description"
      >
        {/* Título para acessibilidade (visualmente oculto) */}
        <h2 id="lightbox-title" className="sr-only">
          Galeria de imagens de {equipmentName}
        </h2>
        <p id="lightbox-description" className="sr-only">
          Use as setas ou arraste para navegar entre as imagens. Pressione ESC
          para fechar.
        </p>

        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <p className="text-lg mb-2">Erro ao carregar imagens</p>
            <p className="text-sm text-white/60">{error.message}</p>
          </div>
        )}

        {images && images.length > 0 && (
          <div className="relative w-full h-full flex flex-col">
            <LightboxCarousel
              images={images}
              initialIndex={initialIndex}
              equipmentName={equipmentName}
            />
            <LightboxControls onClose={onClose} />
          </div>
        )}

        {images && images.length === 0 && (
          <div className="flex items-center justify-center h-full text-white">
            <p>Nenhuma imagem disponível</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
