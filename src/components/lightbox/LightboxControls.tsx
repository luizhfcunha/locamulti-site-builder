import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxControlsProps {
  onClose: () => void;
}

export function LightboxControls({ onClose }: LightboxControlsProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClose}
      className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 z-20 backdrop-blur-sm"
      aria-label="Fechar galeria"
    >
      <X className="w-5 h-5" />
    </Button>
  );
}
