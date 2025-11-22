import { WHATSAPP_ICON_URL } from "@/config/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhatsappCTAProps {
  text: string;
  href: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  fullWidth?: boolean;
}

export const WhatsappCTA = ({ 
  text, 
  href, 
  variant = "default", 
  size = "default",
  className,
  fullWidth = false 
}: WhatsappCTAProps) => {
  const handleClick = () => {
    window.open(href, "_blank");
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleClick}
      className={cn(
        "gap-2 items-center justify-center",
        fullWidth && "w-full",
        className
      )}
    >
      <img 
        src={WHATSAPP_ICON_URL} 
        alt="WhatsApp" 
        className="w-5 h-5 md:w-5 md:h-5 object-contain rounded-full flex-shrink-0"
      />
      <span>{text}</span>
    </Button>
  );
};
