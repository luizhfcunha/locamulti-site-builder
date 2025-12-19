import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X, MapPin } from "lucide-react";
import { CONTACT } from "@/config/contact";
import { WHATSAPP } from "@/config/whatsapp";
import { Input } from "@/components/ui/input";

const mobileNavItems = [
  { path: "/", label: "Início" },
  { path: "/catalogo", label: "Equipamentos" },
  { path: "/quem-somos", label: "Por que alugar conosco" },
  { path: "/contato", label: "Contato" },
];

export const HeaderMobile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
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

  const renderMobileLink = (path: string, label: string) => {
    if (isAdminSubdomain) {
      return (
        <a
          href={`${mainDomain}${path}`}
          className="block py-3 text-foreground hover:text-primary transition-colors font-semibold text-base border-b border-border/30"
          onClick={() => setMenuOpen(false)}
        >
          {label}
        </a>
      );
    }
    return (
      <Link
        to={path}
        className="block py-3 text-foreground hover:text-primary transition-colors font-semibold text-base border-b border-border/30"
        onClick={() => setMenuOpen(false)}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-soft">
      <div className="px-4 py-3 space-y-3">
        {/* Line 1: Logo + Location + Menu */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          {isAdminSubdomain ? (
            <a href={mainDomain} className="flex-shrink-0">
              <img
                src="/lovable-uploads/9eafa2ff-d727-4867-b847-d9f097bacc48.jpg"
                alt="LOCAMULTI"
                className="h-8 w-auto"
              />
            </a>
          ) : (
            <Link to="/" className="flex-shrink-0">
              <img
                src="/lovable-uploads/9eafa2ff-d727-4867-b847-d9f097bacc48.jpg"
                alt="LOCAMULTI"
                className="h-8 w-auto"
              />
            </Link>
          )}

          {/* Location */}
          <a
            href={CONTACT.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>{CONTACT.city} / {CONTACT.state}</span>
          </a>

          {/* Menu Button */}
          <button
            className="p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Line 2: Search - Full Width */}
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="O que você precisa alugar hoje?"
              className="pl-10 pr-4 h-12 text-base rounded-xl border-2 border-border focus:border-primary bg-secondary/30 w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1 pl-1">
            Ex: Betoneira, andaime, compactador…
          </p>
        </form>

        {/* Line 3: WhatsApp CTA - Full Width */}
        <div className="space-y-1">
          <a
            href={WHATSAPP.header}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-xl transition-all duration-200 shadow-md"
          >
            <img src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" alt="WhatsApp" className="w-5 h-5" />
            <span>Orçamento grátis no WhatsApp</span>
          </a>
          <p className="text-xs text-center text-muted-foreground">
            👆 Precisa para hoje? {CONTACT.immediateService}
          </p>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="px-4 pb-4 border-t border-border/50 bg-background">
          {mobileNavItems.map((item, index) => (
            <div key={index}>{renderMobileLink(item.path, item.label)}</div>
          ))}
        </nav>
      )}
    </header>
  );
};
