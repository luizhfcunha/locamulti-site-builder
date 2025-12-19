import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Smartphone } from "lucide-react";
import { LOGO_FOOTER } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-lm-orange text-white">
      <div className="container mx-auto px-3 xs:px-4 py-8 sm:py-12">
        {/* Logo Centralizada - Marca d'Água */}
        <div className="w-full mb-6 sm:mb-10 flex items-center justify-center">
          <Link to="/" onClick={scrollToTop} className="inline-block opacity-90 hover:opacity-100 transition-opacity">
            <img 
              src={LOGO_FOOTER.url} 
              alt="Logo LOCAMULTI versão branca" 
              className="h-auto w-[220px] xs:w-[280px] sm:w-[320px] md:w-[400px] object-contain" 
            />
          </Link>
        </div>

        {/* Redes Sociais - Primeiro no mobile */}
        <div className="mb-8 sm:hidden text-center">
          <h3 className="font-heading text-base font-bold mb-3">Redes Sociais</h3>
          <div className="flex gap-4 justify-center">
            <a
              href="https://www.facebook.com/locamulti"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 active:scale-95 transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://www.instagram.com/locamulti"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 active:scale-95 transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href={WHATSAPP.geral}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 active:scale-95 transition-all duration-300"
              aria-label="WhatsApp"
            >
              <img src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" alt="WhatsApp" className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Institucional */}
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-sm xs:text-base sm:text-lg font-bold mb-2 sm:mb-4">Institucional</h3>
            <ul className="space-y-1 sm:space-y-2 text-xs xs:text-sm">
              <li>
                <Link to="/" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/catalogo" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/contato" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="text-center sm:text-left">
            <h3 className="font-heading text-sm xs:text-base sm:text-lg font-bold mb-2 sm:mb-4">Contato</h3>
            <ul className="space-y-1.5 sm:space-y-3 text-xs xs:text-sm">
              <li className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 hidden sm:block mt-0.5" />
                <span className="text-left leading-tight">
                  <span className="sm:hidden">Anápolis - GO</span>
                  <span className="hidden sm:inline">Av. JK, 2058 - JK Nova Capital, Anápolis - GO</span>
                </span>
              </li>
              <li className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <a href="tel:+556233244024" className="hover:text-lm-plum transition-colors">
                  (62) 3324-4024
                </a>
              </li>
              <li className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <a href="tel:+5562984194024" className="hover:text-lm-plum transition-colors">
                  (62) 9 8419-4024
                </a>
              </li>
              <li className="flex items-center gap-1 sm:gap-2 justify-center sm:justify-start">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <a className="hover:text-lm-plum transition-colors break-all" href="mailto:atendimento@locamulti.com.br">
                  <span className="sm:hidden">atendimento@</span>
                  <span className="hidden sm:inline">atendimento@locamulti.com.br</span>
                </a>
              </li>
              <li className="hidden sm:flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-left">Seg-Sex: 7h às 17h | Sáb: 8h às 11:30h</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais - Desktop */}
          <div className="hidden sm:block text-left">
            <h3 className="font-heading text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-5 justify-start">
              <a
                href="https://www.facebook.com/locamulti"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-8 w-8" />
              </a>
              <a
                href="https://www.instagram.com/locamulti"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-8 w-8" />
              </a>
              <a
                href={WHATSAPP.geral}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-3 rounded-full hover:bg-white/20 hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <img src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" alt="WhatsApp" className="w-8 h-8" />
              </a>
            </div>
            <p className="text-sm mt-4 opacity-80">
              Siga-nos e fique por dentro das novidades!
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 sm:pt-6 text-center text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} <span className="font-bold">LOCAMULTI</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
