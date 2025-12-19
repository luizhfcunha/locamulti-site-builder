import { MapPin, Phone, Smartphone } from "lucide-react";
import { CONTACT } from "@/config/contact";

export const TopBar = () => {
  return (
    <div className="w-full bg-lm-plum text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-4 md:gap-8 text-sm">
          {/* Location */}
          <a
            href={CONTACT.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">{CONTACT.location}</span>
            <span className="sm:hidden">{CONTACT.city}</span>
          </a>

          <span className="hidden md:inline text-white/40">|</span>

          {/* Fixed Phone */}
          <a
            href={`tel:${CONTACT.phoneFixedClean}`}
            className="hidden md:flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>{CONTACT.phoneFixed}</span>
          </a>

          <span className="hidden md:inline text-white/40">|</span>

          {/* Mobile Phone */}
          <a
            href={`tel:${CONTACT.phoneMobileClean}`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <Smartphone className="h-4 w-4" />
            <span>{CONTACT.phoneMobile}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
