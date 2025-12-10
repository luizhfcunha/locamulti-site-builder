import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { Menu, X } from "lucide-react";
import { logoHeaderUrl } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";
export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith("admin.");
  const mainDomain = "https://locamulti.com";
  const renderLink = (path: string, label: string, end = false) => {
    const className = "text-foreground hover:text-primary transition-colors font-medium";
    if (isAdminSubdomain) {
      return <a href={`${mainDomain}${path}`} className={className}>
        {label}
      </a>;
    }
    return <NavLink to={path} end={end} className={className} activeClassName="text-primary">
      {label}
    </NavLink>;
  };
  const renderMobileLink = (path: string, label: string, end = false) => {
    const className = "text-foreground hover:text-primary transition-colors font-medium py-2";
    if (isAdminSubdomain) {
      return <a href={`${mainDomain}${path}`} className={className} onClick={() => setMobileMenuOpen(false)}>
        {label}
      </a>;
    }
    return <NavLink to={path} end={end} className={className} activeClassName="text-primary" onClick={() => setMobileMenuOpen(false)}>
      {label}
    </NavLink>;
  };
  return <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-soft">
    <div className="container mx-auto px-4">
      <div className="flex h-20 items-center justify-between">
        {/* Logo */}
        {isAdminSubdomain ? <a href={mainDomain} className="flex items-center">
          <img src={logoHeaderUrl} alt="LOCAMULTI - Equipamentos Profissionais" className="h-12 w-auto" />
        </a> : <Link to="/" className="flex items-center">
          <img alt="LOCAMULTI - Equipamentos Profissionais" className="h-12 w-auto" src="/lovable-uploads/9eafa2ff-d727-4867-b847-d9f097bacc48.jpg" />
        </Link>}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {renderLink("/", "Início", true)}
          {renderLink("/catalogo", "Catálogo")}
          {renderLink("/quem-somos", "Quem Somos")}
          {renderLink("/contato", "Contato")}

          {/* Login Link - Always points to admin subdomain */}
          <a href="https://admin.locamulti.com" className="text-foreground hover:text-primary transition-colors font-medium">
            Login
          </a>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <WhatsappCTA text="Orçamento Rápido" href={WHATSAPP.geral} />
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-foreground hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && <nav className="md:hidden py-4 border-t border-border">
        <div className="flex flex-col gap-4">
          {renderMobileLink("/", "Início", true)}
          {renderMobileLink("/catalogo", "Catálogo")}
          {renderMobileLink("/quem-somos", "Quem Somos")}
          {renderMobileLink("/contato", "Contato")}

          <a href="https://admin.locamulti.com" className="text-foreground hover:text-primary transition-colors font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
            Login
          </a>
          <div onClick={() => setMobileMenuOpen(false)}>
            <WhatsappCTA text="Orçamento Rápido" href={WHATSAPP.geral} fullWidth />
          </div>
        </div>
      </nav>}
    </div>
  </header>;
};