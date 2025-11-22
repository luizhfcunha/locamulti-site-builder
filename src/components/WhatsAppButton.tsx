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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 animate-fade-in"
          aria-label="Fale conosco no WhatsApp"
        >
          <img 
            src={WHATSAPP_ICON_URL} 
            alt="WhatsApp" 
            className="h-9 w-9 object-contain"
          />
          
          {/* Pulse animation ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-lm-ink text-white border-lm-ink">
        <p className="font-medium">Fale Conosco</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WhatsAppButton;
