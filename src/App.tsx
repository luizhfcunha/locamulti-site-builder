import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AdminRoute } from "@/components/admin/AdminRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CatalogItemList } from "@/components/admin/CatalogItemList";
import { CatalogItemForm } from "@/components/admin/CatalogItemForm";
import { BulkImageUpload } from "@/components/admin/BulkImageUpload";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Index from "./pages/Index";
import CatalogHome from "./pages/CatalogHome";
import CatalogCategory from "./pages/CatalogCategory";
import CatalogFamily from "./pages/CatalogFamily";
import QuemSomos from "./pages/QuemSomos";
import Contato from "./pages/Contato";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ImportCatalogItems from "./pages/admin/ImportCatalogItems";
import MissingImages from "./pages/admin/MissingImages";
import AdminCategories from "./pages/admin/AdminCategories";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Admin catalog page component - inline to avoid deleted file dependency

const AdminCatalogo = () => {
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (item: any) => {
    setEditingItem(item);
  };

  const handleFormClose = () => {
    setEditingItem(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleBulkSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-heading text-3xl font-bold text-lm-plum">
              Catálogo de Produtos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie equipamentos e consumíveis do catálogo
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowBulkUpload(true)}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Importar Imagens
          </Button>
        </div>

        {editingItem ? (
          <CatalogItemForm item={editingItem} onClose={handleFormClose} />
        ) : (
          <CatalogItemList refreshTrigger={refreshKey} onEdit={handleEdit} />
        )}

        <Dialog open={showBulkUpload} onOpenChange={setShowBulkUpload}>
          <DialogContent className="max-w-4xl h-[80vh] p-0">
            <BulkImageUpload
              onClose={() => setShowBulkUpload(false)}
              onSuccess={handleBulkSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

const App = () => {
  // Check if we are on the admin subdomain
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith("admin.");
  
  // Check if we're in Lovable preview environment
  const isPreviewEnv = hostname.includes("lovableproject.com") || hostname.includes("lovable.app");

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
                      <AdminCatalogo />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/import-catalog"
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
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  }
                />
                {/* Redirect any unknown admin route to dashboard or login */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              // Public Site Routes (and Preview Environment)
              <>
                <Route path="/" element={<Index />} />
                <Route path="/catalogo" element={<CatalogHome />} />
                <Route path="/catalogo/:categoriaSlug" element={<CatalogCategory />} />
                <Route path="/catalogo/:categoriaSlug/:familiaSlug" element={<CatalogFamily />} />
                <Route path="/catalogo/:categoriaSlug/:familiaSlug/:code" element={<CatalogFamily />} />
                <Route path="/quem-somos" element={<QuemSomos />} />
                <Route path="/contato" element={<Contato />} />
                
                {/* Login - In preview env, show login page. In prod, redirect to admin subdomain */}
                <Route
                  path="/login"
                  element={
                    isPreviewEnv ? (
                      <Login />
                    ) : (
                      <ExternalRedirect url="https://admin.locamulti.com" />
                    )
                  }
                />
                
                {/* Admin routes accessible in preview environment */}
                {isPreviewEnv && (
                  <>
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
                          <AdminCatalogo />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/import-catalog"
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
                    <Route
                      path="/admin/categories"
                      element={
                        <AdminRoute>
                          <AdminCategories />
                        </AdminRoute>
                      }
                    />
                  </>
                )}

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

// Component for external redirects (avoids cross-origin issues with Navigate)
const ExternalRedirect = ({ url }: { url: string }) => {
  window.location.href = url;
  return null;
};

export default App;
