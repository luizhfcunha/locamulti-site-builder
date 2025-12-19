import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, MessageCircle, Smartphone } from "lucide-react";
import { LOGO_FOOTER } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";

export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-lm-orange text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo Centralizada - Marca d'Água */}
        <div className="w-full mb-10 flex items-center justify-center">
          <Link to="/" onClick={scrollToTop} className="inline-block opacity-90 hover:opacity-100 transition-opacity">
            <img 
              src={LOGO_FOOTER.url} 
              alt="Logo LOCAMULTI versão branca" 
              className="h-auto w-[320px] md:w-[400px] object-contain" 
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Institucional */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold mb-4">Institucional</h3>
            <ul className="space-y-2">
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
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-left">
                  Av. Juscelino Kubitscheck, 2058 - JK Nova Capital, Anápolis - GO, 75114-225
                </span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+556233244024" className="hover:text-lm-plum transition-colors text-sm">
                  (62) 3324-4024
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Smartphone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+5562984194024" className="hover:text-lm-plum transition-colors text-sm">
                  (62) 9 8419-4024
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a className="hover:text-lm-plum transition-colors text-sm" href="mailto:atendimento@locamulti.com.br">
                  atendimento@locamulti.com.br
                </a>
              </li>
              <li className="flex items-start gap-2 justify-center md:justify-start">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-left">Seg-Sex: 7h às 17h | Sáb: 8h às 11:30h</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div className="text-center md:text-left">
            <h3 className="font-heading text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-5 justify-center md:justify-start">
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
                <MessageCircle className="h-8 w-8" />
              </a>
            </div>
            <p className="text-sm mt-4 opacity-80">
              Siga-nos e fique por dentro das novidades!
            </p>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} <span className="font-bold">LOCAMULTI</span>. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
