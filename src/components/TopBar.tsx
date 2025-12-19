import { MapPin, Phone, MessageCircle, Zap } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { WHATSAPP } from "@/config/whatsapp";

export const TopBar = () => {
  return (
    <div className="w-full bg-primary text-primary-foreground py-2.5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center flex-wrap gap-3 md:gap-6 text-sm">
          {/* Location */}
          <a
            href={CONTACT.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 hover:bg-white/90 hover:text-primary hover:scale-105"
          >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">{CONTACT.location}</span>
          </a>

          <span className="hidden md:inline text-white/40">|</span>

          {/* Fixed Phone */}
          <a
            href={`tel:${CONTACT.phoneFixedClean}`}
            className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 hover:bg-white/90 hover:text-primary hover:scale-105"
          >
            <Phone className="h-4 w-4" />
            <span>{CONTACT.phoneFixed}</span>
          </a>

          <span className="hidden md:inline text-white/40">|</span>

          {/* WhatsApp - Highlighted */}
          <a
            href={WHATSAPP.header}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-md transition-all duration-200 hover:bg-white/90 hover:text-primary hover:scale-105 font-medium"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{CONTACT.whatsappFormatted}</span>
          </a>

          <span className="hidden lg:inline text-white/40">|</span>

          {/* Business Hours */}
          <div className="hidden lg:flex items-center gap-1.5 text-white/90">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="font-medium">{CONTACT.immediateService}</span>
            <span className="text-white/60">•</span>
            <span>{CONTACT.businessHours}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
