import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/catalogNew";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

interface RawItem {
  category_order: number;
  category_no: number;
  category_name: string;
  family_order: number;
  family_no: string;
  family_name: string;
  item_order: number;
  code: string;
  item_type: string;
  description: string;
}

export default function ImportCatalogItems() {
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!jsonContent.trim()) {
      toast({ title: "Erro", description: "Cole o JSON do catálogo.", variant: "destructive" });
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      const items: RawItem[] = JSON.parse(jsonContent);
      
      if (!Array.isArray(items)) {
        throw new Error("JSON deve ser um array de itens");
      }

      const preparedItems = items.map(item => ({
        category_order: item.category_order,
        category_no: item.category_no,
        category_name: item.category_name,
        category_slug: generateSlug(item.category_name),
        family_order: item.family_order,
        family_no: String(item.family_no),
        family_name: item.family_name,
        family_slug: generateSlug(item.family_name),
        item_order: item.item_order,
        code: item.code,
        item_type: item.item_type.toLowerCase(),
        description: item.description, // EXATAMENTE como está
        active: true
      }));

      const { error } = await supabase
        .from('catalog_items')
        .upsert(preparedItems, { onConflict: 'code' });

      if (error) throw error;

      setImportResult({ success: preparedItems.length, errors: [] });
      toast({ title: "Sucesso!", description: `${preparedItems.length} itens importados.` });
      
    } catch (error: any) {
      toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
      setImportResult({ success: 0, errors: [error.message] });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Importar Catálogo (Nova Estrutura)</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Colar JSON do Catálogo</CardTitle>
            <CardDescription>
              Cole o JSON exportado da planilha. Campos: category_order, category_no, category_name, 
              family_order, family_no, family_name, item_order, code, item_type, description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder='[{"category_order":1,"category_no":1,"category_name":"DEMOLIÇÃO E PERFURAÇÃO",...}]'
              rows={12}
              className="font-mono text-sm"
            />
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Importar
            </Button>
          </CardContent>
        </Card>

        {importResult && (
          <Card>
            <CardContent className="pt-6">
              {importResult.success > 0 && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{importResult.success} itens importados com sucesso!</span>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <div className="text-red-600 mt-2">
                  Erros: {importResult.errors.join(", ")}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
