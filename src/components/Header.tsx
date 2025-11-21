import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, X } from "lucide-react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="font-heading text-2xl font-bold text-lm-plum">
              Loca<span className="text-primary">Multi</span>
            </div>
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
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              variant="default"
              className="gap-2"
              onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
            >
              <MessageCircle className="h-4 w-4" />
              Orçamento Rápido
            </Button>
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
              <Button
                variant="default"
                className="gap-2 w-full"
                onClick={() => {
                  window.open("https://wa.me/5511999999999", "_blank");
                  setMobileMenuOpen(false);
                }}
              >
                <MessageCircle className="h-4 w-4" />
                Orçamento Rápido
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
