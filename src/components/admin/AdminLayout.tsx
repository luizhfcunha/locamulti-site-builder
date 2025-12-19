import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { BarChart3, Package, LogOut, FolderTree, Upload, ImageOff } from "lucide-react";
import logoHeader from "@/assets/logo-locamulti-header-horizontal.png";
import { toast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: BarChart3 },
  { title: "Produtos", url: "/admin/produtos", icon: Package },
  { title: "Sem Imagem", url: "/admin/missing-images", icon: ImageOff },
  { title: "Categorias", url: "/admin/categories", icon: FolderTree },
  { title: "Importar Catálogo", url: "/admin/import-catalog", icon: Upload },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado",
    });
    navigate("/login");
  };

  const isActive = (url: string) => location.pathname === url;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="w-64 border-r border-border">
          <SidebarContent>
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <img
                src={logoHeader}
                alt="LOCAMULTI"
                className="w-full h-auto"
              />
            </div>

            {/* Menu de Navegação */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.url)}
                        className={`w-full justify-start gap-3 ${isActive(item.url)
                          ? "bg-lm-orange text-white hover:bg-lm-terrac"
                          : "hover:bg-muted"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-body">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Botão de Logout */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-body">Sair</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Área de Conteúdo Principal */}
        <main className="flex-1 bg-lm-muted p-8 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
