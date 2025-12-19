import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "lucide-react";
import { logoHeaderUrl } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";
import { Input } from "@/components/ui/input";

const navItems = [
  { path: "/", label: "Início" },
  { path: "/catalogo", label: "Equipamentos" },
  { path: "/quem-somos", label: "Por que alugar conosco" },
  { path: "/contato", label: "Contato" },
];

export const HeaderDesktop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith("admin.");
  const mainDomain = "https://locamulti.com";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const renderNavLink = (path: string, label: string) => {
    if (isAdminSubdomain) {
      return (
        <a
          href={`${mainDomain}${path}`}
          className="text-foreground hover:text-primary transition-colors font-semibold text-base"
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        to={path}
        className="text-foreground hover:text-primary transition-colors font-semibold text-base"
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        {/* Main Header Row */}
        <div className="flex h-20 items-center justify-between gap-6">
          {/* Logo */}
          {isAdminSubdomain ? (
            <a href={mainDomain} className="flex-shrink-0">
              <img
                src="/lovable-uploads/9eafa2ff-d727-4867-b847-d9f097bacc48.jpg"
                alt="LOCAMULTI - Equipamentos Profissionais"
                className="h-10 w-auto"
              />
            </a>
          ) : (
            <Link to="/" className="flex-shrink-0">
              <img
                src="/lovable-uploads/9eafa2ff-d727-4867-b847-d9f097bacc48.jpg"
                alt="LOCAMULTI - Equipamentos Profissionais"
                className="h-10 w-auto"
              />
            </Link>
          )}

          {/* Search Bar - Central & Prominent */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Buscar equipamento… Ex: betoneira, andaime, compactador"
                className="pl-12 pr-4 h-12 text-base rounded-xl border-2 border-border focus:border-primary bg-secondary/30 w-full"
              />
            </div>
          </form>

          {/* WhatsApp CTA - Green Button */}
          <a
            href={WHATSAPP.header}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-md"
          >
            <img src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" alt="WhatsApp" className="w-5 h-5" />
            <span>Orçamento imediato</span>
          </a>
        </div>

        {/* Navigation Row */}
        <nav className="flex items-center justify-center gap-8 py-3 border-t border-border/50">
          {navItems.map((item, index) => (
            <div key={index}>{renderNavLink(item.path, item.label)}</div>
          ))}
        </nav>
      </div>
    </header>
  );
};
