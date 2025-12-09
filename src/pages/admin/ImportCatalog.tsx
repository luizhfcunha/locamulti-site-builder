import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileJson, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportStats {
  categories: number;
  families: number;
  subfamilies: number;
  errors: string[];
}

export default function ImportCatalog() {
  const [jsonContent, setJsonContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; stats?: ImportStats; error?: string } | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonContent(content);
      setResult(null);
      toast({
        title: "Arquivo carregado",
        description: `${file.name} foi carregado com sucesso.`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Erro ao ler arquivo",
        description: "Não foi possível ler o arquivo JSON.",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!jsonContent.trim()) {
      toast({
        title: "Conteúdo vazio",
        description: "Por favor, carregue ou cole o JSON do catálogo.",
        variant: "destructive",
      });
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonContent);
    } catch {
      toast({
        title: "JSON inválido",
        description: "O conteúdo não é um JSON válido.",
        variant: "destructive",
      });
      return;
    }

    if (!parsedData.catalog || !Array.isArray(parsedData.catalog)) {
      toast({
        title: "Formato inválido",
        description: "O JSON deve conter uma propriedade 'catalog' com array de categorias.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      const response = await supabase.functions.invoke("import-catalog", {
        body: parsedData,
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao importar catálogo");
      }

      setResult({
        success: true,
        stats: response.data.stats,
      });

      toast({
        title: "Importação concluída!",
        description: `${response.data.stats.categories} categorias, ${response.data.stats.families} famílias e ${response.data.stats.subfamilies} subfamílias importadas.`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      setResult({
        success: false,
        error: errorMessage,
      });
      toast({
        title: "Erro na importação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Importar Catálogo</h1>
          <p className="text-muted-foreground mt-2">
            Importe categorias, famílias e subfamílias a partir de um arquivo JSON.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Carregar Arquivo JSON
            </CardTitle>
            <CardDescription>
              Selecione o arquivo JSON com a estrutura do catálogo (catalogo_locamulti_2026.json)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                  <Upload className="h-4 w-4" />
                  Escolher arquivo
                </div>
              </label>
              <span className="text-sm text-muted-foreground">
                ou cole o conteúdo JSON abaixo
              </span>
            </div>

            <Textarea
              placeholder='{"catalog": [...]}'
              value={jsonContent}
              onChange={(e) => {
                setJsonContent(e.target.value);
                setResult(null);
              }}
              className="min-h-[300px] font-mono text-sm"
            />

            <div className="flex items-center gap-4">
              <Button
                onClick={handleImport}
                disabled={isImporting || !jsonContent.trim()}
                size="lg"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Iniciar Importação
                  </>
                )}
              </Button>
              
              {jsonContent && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setJsonContent("");
                    setResult(null);
                  }}
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                Resultado da Importação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.success && result.stats ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.stats.categories}</div>
                      <div className="text-sm text-muted-foreground">Categorias</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.stats.families}</div>
                      <div className="text-sm text-muted-foreground">Famílias</div>
                    </div>
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{result.stats.subfamilies}</div>
                      <div className="text-sm text-muted-foreground">Subfamílias</div>
                    </div>
                  </div>
                  
                  {result.stats.errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Erros durante importação</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc list-inside mt-2 text-sm max-h-40 overflow-y-auto">
                          {result.stats.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro na importação</AlertTitle>
                  <AlertDescription>{result.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Estrutura Esperada do JSON</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "catalog": [
    {
      "id": "1",
      "name": "NOME DA CATEGORIA",
      "slug": "slug-categoria",
      "families": [
        {
          "id": "1.1",
          "name": "NOME DA FAMÍLIA",
          "slug": "slug-familia",
          "subfamilies": [
            {
              "id": "1.1.1",
              "description": "Descrição do equipamento",
              "is_consumable": false
            }
          ]
        }
      ]
    }
  ]
}`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
