import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminRoute } from "@/components/admin/AdminRoute";
import Index from "./pages/Index";
import CatalogHome from "./pages/CatalogHome";
import CatalogCategory from "./pages/CatalogCategory";
import CatalogFamily from "./pages/CatalogFamily";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import AdminProdutos from "./pages/AdminProdutos";
import AdminDashboard from "./pages/AdminDashboard";
import Categories from "./pages/admin/Categories";
import ImportCatalog from "./pages/admin/ImportCatalog";
import ImportCatalogItems from "./pages/admin/ImportCatalogItems";
import MissingImages from "./pages/admin/MissingImages";
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
          <ScrollToTop />
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
                <Route
                  path="/admin/import-catalog"
                  element={
                    <AdminRoute>
                      <ImportCatalog />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/import-catalog-items"
                  element={
                    <AdminRoute>
                      <ImportCatalogItems />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/missing-images"
                  element={
                    <AdminRoute>
                      <MissingImages />
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
                <Route path="/catalogo" element={<CatalogHome />} />
                <Route path="/catalogo/:categoriaSlug" element={<CatalogCategory />} />
                <Route path="/catalogo/:categoriaSlug/:familiaSlug" element={<CatalogFamily />} />
                <Route path="/catalogo/:categoriaSlug/:familiaSlug/:code" element={<CatalogFamily />} />
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
