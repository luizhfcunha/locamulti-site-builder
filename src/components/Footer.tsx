import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Facebook, Instagram } from "lucide-react";
import { LOGO_FOOTER } from "@/lib/constants";
export const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  
  return <footer className="bg-lm-orange text-white">
    <div className="container mx-auto px-4 py-12">
      {/* Logo Centralizada */}
      <div className="w-full mb-8 flex items-center justify-center">
        <Link to="/" onClick={scrollToTop} className="inline-block">
          <img src={LOGO_FOOTER.url} alt="Logo LocaMulti versão branca" className="h-auto w-[240px] object-contain" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Institucional */}
        <div>
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

        {/* Catálogo */}
        <div>
          <h3 className="font-heading text-lg font-bold mb-4">Catálogo</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/catalogo?categoria=construcao" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                Construção e Demolição
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=concretagem" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                Concretagem e Vibração
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=energia" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
                Energia e Geração
              </Link>
            </li>
            <li>
              <Link to="/catalogo?categoria=soldagem" onClick={scrollToTop} className="hover:text-lm-plum transition-colors">
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
              <span className="text-sm">
                 Av. Juscelino Kubitscheck, 2058 - JK Nova Capital, Anápolis - GO, 75114-225
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <a href="tel:+5562984194024" className="hover:text-lm-plum transition-colors text-sm">
                (62) 98419-4024
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <a className="hover:text-lm-plum transition-colors text-sm" href="mailto:atendimento@locamulti.com.br">
                atendimento@locamulti.com.br
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Seg-Sex: 7:00h às 17h Sáb: 8h às 11:30h</span>
            </li>
          </ul>
        </div>

        {/* Redes Sociais */}
        <div>
          <h3 className="font-heading text-lg font-bold mb-4">Redes Sociais</h3>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/locamulti" target="_blank" rel="noopener noreferrer" className="hover:text-lm-plum transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="https://www.instagram.com/locamulti" target="_blank" rel="noopener noreferrer" className="hover:text-lm-plum transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 pt-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} LocaMulti. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>;
};