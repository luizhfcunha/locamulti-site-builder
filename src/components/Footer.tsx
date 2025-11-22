import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { LOGO_FOOTER } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";
export const Footer = () => {
  return (
    <footer className="bg-lm-plum text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo Centralizada */}
        <div className="flex justify-center w-full mb-8">
          <Link to="/" className="inline-block">
            <img src={LOGO_FOOTER.url} alt="Logo LocaMulti versão branca" className="h-auto w-[180px] object-contain" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Institucional */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" className="hover:text-primary transition-colors">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="hover:text-primary transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/contato" className="hover:text-primary transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Catálogo */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Catálogo</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/catalogo?categoria=construcao" className="hover:text-primary transition-colors">
                  Construção e Demolição
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=concretagem" className="hover:text-primary transition-colors">
                  Concretagem e Vibração
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=energia" className="hover:text-primary transition-colors">
                  Energia e Geração
                </Link>
              </li>
              <li>
                <Link to="/catalogo?categoria=soldagem" className="hover:text-primary transition-colors">
                  Soldagem Profissional
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Contato</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  JK Parque Industrial - Av. Juscelino Kubitscheck, 2058 - JK Nova Capital, Anápolis - GO, 75114-225
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+5562984194024" className="hover:text-primary transition-colors text-sm">
                  (62) 98419-4024
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a className="hover:text-primary transition-colors text-sm" href="mailto:atendimento@locamulti.com.br">
                  atendimento@locamulti.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Seg-Sex: 7:30h às 17h
                  <br />
                  Sáb: 8h às 12h
                </span>
              </li>
            </ul>
            <WhatsappCTA 
              text="Falar no WhatsApp"
              href={WHATSAPP.footer}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            />
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/locamulti"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/locamulti"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/company/locamulti/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LocaMulti. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
