import { WHATSAPP } from "@/config/whatsapp";
import { WHATSAPP_ICON_URL } from "@/config/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WhatsAppButton = () => {
  const handleClick = () => {
    window.open(WHATSAPP.floating, '_blank');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 md:w-16 md:h-16 rounded-full bg-transparent overflow-hidden transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 animate-fade-in shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
          aria-label="Fale conosco no WhatsApp"
        >
          <img 
            src={WHATSAPP_ICON_URL} 
            alt="WhatsApp" 
            className="w-full h-full object-contain"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-lm-ink text-white border-lm-ink">
        <p className="font-medium">Fale Conosco</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WhatsAppButton;
