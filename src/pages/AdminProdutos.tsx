import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";
import { BulkImageUpload } from "@/components/admin/BulkImageUpload";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const AdminProdutos = () => {
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    setRefreshKey(prev => prev + 1); // Refresh list after edit/create
  };

  const handleBulkSuccess = () => {
    setRefreshKey(prev => prev + 1); // Refresh list after bulk upload
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-lm-plum">
            Produtos
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBulkUpload(true)}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Importar Imagens
            </Button>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-lm-orange hover:bg-lm-terrac"
            >
              <Plus className="w-4 h-4" />
              Novo Produto
            </Button>
          </div>
        </div>

        {showForm ? (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        ) : (
          <ProductList refreshTrigger={refreshKey} onEdit={handleEdit} />
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

export default AdminProdutos;
