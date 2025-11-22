import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram, Linkedin } from "lucide-react";
import { LOGO_FOOTER } from "@/lib/constants";

export const Footer = () => {
  return (
    <footer className="bg-lm-plum text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Logo */}
        <div className="mb-10">
          <Link to="/" className="inline-block">
            <img 
              src={LOGO_FOOTER.url} 
              alt="Logo LocaMulti versão branca" 
              className="h-auto w-full max-w-[110px] md:max-w-[150px] object-contain"
            />
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
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Rua Exemplo, 123 - São Paulo, SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a href="tel:+551199999999" className="hover:text-primary transition-colors text-sm">
                  (11) 9 9999-9999
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a href="mailto:contato@locamulti.com.br" className="hover:text-primary transition-colors text-sm">
                  contato@locamulti.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Seg-Sex: 8h às 18h<br />Sáb: 8h às 12h</span>
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
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
