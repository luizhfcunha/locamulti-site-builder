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
  onClick?: () => void;
}
export const WhatsappCTA = ({
  text,
  href,
  variant = "default",
  size = "default",
  className,
  fullWidth = false,
  onClick
}: WhatsappCTAProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    window.open(href, "_blank");
  };
  return <Button variant={variant} size={size} onClick={handleClick} className={cn("gap-2 items-center justify-center", fullWidth && "w-full", className)}>
      <img alt="WhatsApp" className="w-5 h-5 md:w-5 md:h-5 flex-shrink-0 object-fill rounded-full" src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" />
      <span className="text-primary">{text}</span>
    </Button>;
};