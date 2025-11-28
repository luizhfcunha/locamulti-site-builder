import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AdminRoute } from "@/components/admin/AdminRoute";
import Index from "./pages/Index";
import Catalogo from "./pages/Catalogo";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import AdminProdutos from "./pages/AdminProdutos";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/admin/Categories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check if we are on the admin subdomain
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith("admin.");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* WhatsApp button only on public site */}
          {!isAdminSubdomain && <WhatsAppButton />}

          <Routes>
            {isAdminSubdomain ? (
              // Admin Subdomain Routes
              <>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/produtos"
                  element={
                    <AdminRoute>
                      <AdminProdutos />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <Categories />
                    </AdminRoute>
                  }
                />
                {/* Redirect any unknown admin route to dashboard or login */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // Public Site Routes
              <>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/contato" element={<Contato />} />
                {/* Login on public site redirects to admin subdomain */}
                <Route
                  path="/login"
                  element={<Navigate to="https://admin.locamulti.com" replace />}
                />

                {/* Catch-all for public site */}
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
