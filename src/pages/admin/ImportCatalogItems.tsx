import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSlug } from "@/lib/catalogNew";
import { Loader2, Upload, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RawEquipment {
  ordem: string;       // "1.1.001"
  nome: string;
  descricao: string;
  tipo: "equipamento" | "consumivel";
}

interface RawFamily {
  ordem: string;       // "1.1"
  nome: string;
  equipamentos: RawEquipment[];
}

interface RawCategory {
  ordem: number;
  nome: string;
  familias: RawFamily[];
}

interface RawCatalog {
  total_categorias: number;
  total_familias: number;
  total_equipamentos: number;
  total_consumiveis: number;
  total_itens: number;
  categorias: RawCategory[];
}

interface PreparedItem {
  category_order: number;
  category_no: number;
  category_name: string;
  category_slug: string;
  family_order: number;
  family_no: string;
  family_name: string;
  family_slug: string;
  item_order: number;
  code: string;
  item_type: string;
  name: string;
  description: string;
  active: boolean;
}

export default function ImportCatalogItems() {
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);
  const [previewData, setPreviewData] = useState<{ categories: number; families: number; equipment: number; consumables: number } | null>(null);
  const { toast } = useToast();

  const parseJsonContent = (content: string): PreparedItem[] => {
    const catalog: RawCatalog = JSON.parse(content);
    
    if (!catalog.categorias || !Array.isArray(catalog.categorias)) {
      throw new Error("JSON inválido: deve conter array 'categorias'");
    }

    const items: PreparedItem[] = [];

    for (const category of catalog.categorias) {
      const categoryOrder = category.ordem;
      const categoryName = category.nome;
      const categorySlug = generateSlug(categoryName);

      for (const family of category.familias) {
        // family.ordem = "1.1", "1.2", "2.1", etc.
        const familyParts = family.ordem.split(".");
        const familyOrder = parseInt(familyParts[1], 10);
        const familyNo = family.ordem;
        const familyName = family.nome;
        const familySlug = generateSlug(familyName);

        for (const equip of family.equipamentos) {
          // equip.ordem = "1.1.001", "1.1.002", etc.
          const itemParts = equip.ordem.split(".");
          const itemOrder = parseInt(itemParts[2], 10);
          
          // Nome do equipamento
          const name = equip.nome;
          
          // Descrição técnica (especificações), sem o nome
          let description = equip.descricao && equip.descricao !== "CONSUMÍVEL" 
            ? equip.descricao 
            : "";

          items.push({
            category_order: categoryOrder,
            category_no: categoryOrder,
            category_name: categoryName,
            category_slug: categorySlug,
            family_order: familyOrder,
            family_no: familyNo,
            family_name: familyName,
            family_slug: familySlug,
            item_order: itemOrder,
            code: equip.ordem,  // Código hierárquico preservado
            item_type: equip.tipo.toLowerCase(),
            name: name,
            description: description,
            active: true
          });
        }
      }
    }

    return items;
  };

  const handlePreview = () => {
    if (!jsonContent.trim()) {
      toast({ title: "Erro", description: "Cole o JSON do catálogo.", variant: "destructive" });
      return;
    }

    try {
      const items = parseJsonContent(jsonContent);
      const categories = new Set(items.map(i => i.category_no)).size;
      const families = new Set(items.map(i => i.family_no)).size;
      const equipment = items.filter(i => i.item_type === "equipamento").length;
      const consumables = items.filter(i => i.item_type === "consumivel").length;

      setPreviewData({ categories, families, equipment, consumables });
      toast({ title: "JSON válido!", description: `${items.length} itens prontos para importação.` });
    } catch (error: any) {
      toast({ title: "Erro no JSON", description: error.message, variant: "destructive" });
      setPreviewData(null);
    }
  };

  const handleClearAndImport = async () => {
    if (!jsonContent.trim()) {
      toast({ title: "Erro", description: "Cole o JSON do catálogo.", variant: "destructive" });
      return;
    }

    setIsClearing(true);
    setIsImporting(true);
    setImportResult(null);

    try {
      // Step 1: Parse JSON
      const items = parseJsonContent(jsonContent);
      
      // Step 2: Clear existing data
      const { error: deleteError } = await supabase
        .from('catalog_items')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) {
        throw new Error(`Erro ao limpar tabela: ${deleteError.message}`);
      }
      
      setIsClearing(false);

      // Step 3: Insert in batches of 100
      const batchSize = 100;
      let successCount = 0;
      const errors: string[] = [];

      for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from('catalog_items')
          .insert(batch);

        if (insertError) {
          errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${insertError.message}`);
        } else {
          successCount += batch.length;
        }
      }

      setImportResult({ success: successCount, errors });
      
      if (errors.length === 0) {
        toast({ title: "Sucesso!", description: `${successCount} itens importados com sucesso.` });
      } else {
        toast({ title: "Importação parcial", description: `${successCount} itens importados, ${errors.length} erros.`, variant: "destructive" });
      }
      
    } catch (error: any) {
      toast({ title: "Erro na importação", description: error.message, variant: "destructive" });
      setImportResult({ success: 0, errors: [error.message] });
    } finally {
      setIsClearing(false);
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Importar Catálogo (Novo Formato)</h1>
        
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Atenção:</strong> Esta operação irá APAGAR todos os itens existentes e substituir pelo JSON importado.
            Certifique-se de que o JSON está no formato correto com a estrutura: categorias → famílias → equipamentos.
          </AlertDescription>
        </Alert>
        
        <Card>
          <CardHeader>
            <CardTitle>Colar JSON do Catálogo</CardTitle>
            <CardDescription>
              Formato esperado: {"{"}"categorias": [{"{"}"ordem": 1, "nome": "...", "familias": [...]{"}"}, ...]{"}"}
              <br />
              Cada equipamento deve ter: ordem (ex: "1.1.001"), nome, descricao, tipo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value);
                setPreviewData(null);
              }}
              placeholder='{"total_categorias": 10, "categorias": [{"ordem": 1, "nome": "DEMOLIÇÃO E PERFURAÇÃO", "familias": [...]}]}'
              rows={12}
              className="font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePreview} disabled={isImporting}>
                Validar JSON
              </Button>
              <Button 
                onClick={handleClearAndImport} 
                disabled={isImporting || !previewData}
                variant="destructive"
              >
                {isClearing ? (
                  <>
                    <Trash2 className="h-4 w-4 animate-pulse mr-2" />
                    Limpando...
                  </>
                ) : isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Limpar e Importar
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {previewData && (
          <Card>
            <CardHeader>
              <CardTitle>Prévia do JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{previewData.categories}</div>
                  <div className="text-sm text-muted-foreground">Categorias</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{previewData.families}</div>
                  <div className="text-sm text-muted-foreground">Famílias</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{previewData.equipment}</div>
                  <div className="text-sm text-muted-foreground">Equipamentos</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{previewData.consumables}</div>
                  <div className="text-sm text-muted-foreground">Consumíveis</div>
                </div>
              </div>
              <div className="mt-4 text-center text-lg font-semibold">
                Total: {previewData.equipment + previewData.consumables} itens
              </div>
            </CardContent>
          </Card>
        )}

        {importResult && (
          <Card>
            <CardContent className="pt-6">
              {importResult.success > 0 && (
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>{importResult.success} itens importados com sucesso!</span>
                </div>
              )}
              {importResult.errors.length > 0 && (
                <div className="text-destructive mt-2 space-y-1">
                  <strong>Erros:</strong>
                  {importResult.errors.map((err, i) => (
                    <div key={i} className="text-sm">{err}</div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
