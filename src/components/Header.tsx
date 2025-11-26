import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { Menu, X } from "lucide-react";
import { logoHeaderUrl } from "@/lib/constants";
import { WHATSAPP } from "@/config/whatsapp";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logoHeaderUrl}
              alt="LocaMulti - Equipamentos Profissionais"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              end
              className="text-foreground hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              Home
            </NavLink>
            <NavLink
              to="/catalogo"
              className="text-foreground hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/quem-somos"
              className="text-foreground hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              Quem Somos
            </NavLink>
            <NavLink
              to="/contato"
              className="text-foreground hover:text-primary transition-colors font-medium"
              activeClassName="text-primary"
            >
              Contato
            </NavLink>
            <a
              href="https://admin.locamulti.com"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Login
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <WhatsappCTA
              text="Orçamento Rápido"
              href={WHATSAPP.geral}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <NavLink
                to="/"
                end
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                activeClassName="text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/catalogo"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                activeClassName="text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Catálogo
              </NavLink>
              <NavLink
                to="/quem-somos"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                activeClassName="text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Quem Somos
              </NavLink>
              <NavLink
                to="/contato"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                activeClassName="text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contato
              </NavLink>
              <a
                href="https://admin.locamulti.com"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </a>
              <div onClick={() => setMobileMenuOpen(false)}>
                <WhatsappCTA
                  text="Orçamento Rápido"
                  href={WHATSAPP.geral}
                  fullWidth
                />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
