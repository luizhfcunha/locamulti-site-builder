import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import ProductList from "@/components/admin/ProductList";

const AdminProdutos = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-lm-plum">
            Produtos
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-lm-orange hover:bg-lm-terrac"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </Button>
        </div>

        {showForm ? (
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        ) : (
          <ProductList onEdit={handleEdit} />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProdutos;
