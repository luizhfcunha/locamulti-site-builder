import { WHATSAPP } from "@/config/whatsapp";
import { MessageCircle } from "lucide-react";
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
          className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 shadow-[0_4px_16px_rgba(37,211,102,0.4)] animate-pulse-subtle"
          aria-label="Fale conosco no WhatsApp"
        >
          <MessageCircle className="w-8 h-8 md:w-9 md:h-9 text-white fill-white" strokeWidth={0} />
        </button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-lm-ink text-white border-lm-ink">
        <p className="font-medium">Fale Conosco</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default WhatsAppButton;
