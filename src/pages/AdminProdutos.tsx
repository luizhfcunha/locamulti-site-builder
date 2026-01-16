import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CatalogItemList } from "@/components/admin/CatalogItemList";
import { CatalogItemForm } from "@/components/admin/CatalogItemForm";
import { BulkImageUpload } from "@/components/admin/BulkImageUpload";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const AdminProdutos = () => {
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
          <CatalogItemForm
            item={editingItem}
            onClose={handleFormClose}
          />
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

export default AdminProdutos;
