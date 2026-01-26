import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { equipmentKeys } from "@/lib/queries/equipment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Loader2, ImageIcon, Search, CheckCircle2, AlertCircle, HelpCircle, Code, Wrench, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  findBestMatchEnhanced, 
  getConfidenceColor, 
  getConfidenceLabel,
  getMatchTypeLabel,
  getMatchTypeColor,
  type MatchResult,
  type MatchType 
} from "@/lib/fuzzyMatch";

interface ProductMatch {
  file: File;
  preview: string;
  product: any | null;
  status: "pending" | "uploading" | "success" | "error";
  message?: string;
  matchResult?: MatchResult | null;
}

interface BulkImageUploadProps {
  onClose: () => void;
  onSuccess: () => void;
}

type ConfidenceFilter = "all" | "high" | "medium" | "low" | "none";

export const BulkImageUpload = ({ onClose, onSuccess }: BulkImageUploadProps) => {
  const queryClient = useQueryClient();
  const [matches, setMatches] = useState<ProductMatch[]>([]);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState<{ [key: number]: string }>({});
  const [confidenceFilter, setConfidenceFilter] = useState<ConfidenceFilter>("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("id, code, description, image_url, category_name, family_name")
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true })
        .order("item_order", { ascending: true });

      if (error) throw error;
      // Map to expected format for compatibility
      const mapped = (data || []).map(item => ({
        id: item.id,
        name: item.description,
        supplier_code: item.code,
        image_url: item.image_url,
        brand: item.category_name,
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Error fetching catalog items:", error);
      toast({
        title: "Erro ao carregar itens do catálogo",
        variant: "destructive",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      toast({
        title: "Nenhuma imagem válida",
        description: "Selecione apenas arquivos de imagem (PNG, JPEG, WebP).",
        variant: "destructive",
      });
      return;
    }

    const newMatches: ProductMatch[] = imageFiles.map((file) => {
      // Use enhanced fuzzy matching to find the best product match
      const matchResult = findBestMatchEnhanced(file.name, products);

      return {
        file,
        preview: URL.createObjectURL(file),
        product: matchResult?.product || null,
        status: "pending",
        matchResult,
      };
    });

    setMatches((prev) => [...prev, ...newMatches]);

    // Count matches by type
    const byModelCode = newMatches.filter(m => m.matchResult?.matchType === "model_code").length;
    const byEquipmentName = newMatches.filter(m => m.matchResult?.matchType === "equipment_name").length;
    const byFuzzy = newMatches.filter(m => m.matchResult?.matchType === "fuzzy").length;
    const noMatch = newMatches.filter(m => !m.matchResult || m.matchResult.matchType === "none").length;

    toast({
      title: `${imageFiles.length} imagens analisadas`,
      description: (
        <div className="flex flex-col gap-1 mt-1 text-sm">
          <span className="flex items-center gap-1.5">
            <Code className="w-3 h-3 text-emerald-500" />
            <span>Por código de modelo: <strong>{byModelCode}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Wrench className="w-3 h-3 text-blue-500" />
            <span>Por tipo de equipamento: <strong>{byEquipmentName}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Por similaridade: <strong>{byFuzzy}</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <X className="w-3 h-3 text-red-500" />
            <span>Sem correspondência: <strong>{noMatch}</strong></span>
          </span>
        </div>
      ),
    });
  }, [products]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploading || loadingProducts) return;
    
    if (e.dataTransfer.files?.length) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [uploading, loadingProducts, handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeMatch = (index: number) => {
    setMatches((prev) => {
      const newMatches = [...prev];
      URL.revokeObjectURL(newMatches[index].preview);
      return newMatches.filter((_, i) => i !== index);
    });
  };

  const updateProductMatch = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId);
    setMatches((prev) => prev.map((m, i) => 
      i === index ? { 
        ...m, 
        product: product || null,
        matchResult: product ? { 
          product, 
          similarity: 1, 
          confidence: "high" as const,
          matchType: "model_code" as const
        } : null
      } : m
    ));
  };

  const handleUpload = async () => {
    const pendingMatches = matches.filter(m => m.status === "pending" && m.product);

    if (pendingMatches.length === 0) {
      toast({
        title: "Nada para enviar",
        description: "Selecione arquivos que correspondam a produtos existentes.",
      });
      return;
    }

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      if (match.status !== "pending" || !match.product) continue;

      try {
        // Update status to uploading
        setMatches(prev => prev.map((m, idx) =>
          idx === i ? { ...m, status: "uploading" } : m
        ));

        // 1. Upload image
        const fileExt = match.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, match.file);

        if (uploadError) throw uploadError;

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        // 3. Update catalog_items
        const { error: updateError } = await supabase
          .from("catalog_items")
          .update({ image_url: publicUrl })
          .eq("id", match.product.id);

        if (updateError) throw updateError;

        setMatches(prev => prev.map((m, idx) =>
          idx === i ? { ...m, status: "success" } : m
        ));
        successCount++;

      } catch (error: any) {
        console.error("Upload error:", error);
        setMatches(prev => prev.map((m, idx) =>
          idx === i ? { ...m, status: "error", message: error.message } : m
        ));
        errorCount++;
      }
    }

    setUploading(false);
    
    if (successCount > 0) {
      toast({
        title: "Upload concluído",
        description: `${successCount} ${successCount === 1 ? 'imagem enviada' : 'imagens enviadas'} com sucesso${errorCount > 0 ? `, ${errorCount} ${errorCount === 1 ? 'falha' : 'falhas'}` : ''}.`,
      });
    } else if (errorCount > 0) {
      toast({
        title: "Erro no upload",
        description: `Todas as ${errorCount} tentativas falharam.`,
        variant: "destructive",
      });
    }

    // Call onSuccess if at least one upload was successful
    if (matches.some(m => m.status === "success")) {
      // Invalidar cache de listagem do catálogo após upload em massa
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.lists(),
      });

      onSuccess();
    }
  };

  // Get filtered products for a specific row's search
  const getFilteredProducts = (index: number) => {
    const search = productSearch[index]?.toLowerCase() || "";
    if (!search) return products;
    return products.filter(p => 
      p.name?.toLowerCase().includes(search) || 
      p.supplier_code?.toLowerCase().includes(search) ||
      p.brand?.toLowerCase().includes(search)
    );
  };

  const uploadProgress = matches.length > 0 
    ? (matches.filter(m => m.status === "success" || m.status === "error").length / matches.length) * 100 
    : 0;

  // Statistics
  const stats = useMemo(() => {
    const total = matches.length;
    const withProduct = matches.filter(m => m.product).length;
    const highConfidence = matches.filter(m => m.matchResult?.confidence === "high").length;
    const mediumConfidence = matches.filter(m => m.matchResult?.confidence === "medium").length;
    const lowConfidence = matches.filter(m => m.matchResult?.confidence === "low").length;
    const pending = matches.filter(m => m.status === "pending" && m.product).length;
    const success = matches.filter(m => m.status === "success").length;
    const errors = matches.filter(m => m.status === "error").length;
    
    // Match type stats
    const byModelCode = matches.filter(m => m.matchResult?.matchType === "model_code").length;
    const byEquipmentName = matches.filter(m => m.matchResult?.matchType === "equipment_name").length;
    const byFuzzy = matches.filter(m => m.matchResult?.matchType === "fuzzy").length;
    const noMatch = matches.filter(m => !m.matchResult || m.matchResult.matchType === "none").length;

    return { 
      total, withProduct, highConfidence, mediumConfidence, lowConfidence, 
      pending, success, errors,
      byModelCode, byEquipmentName, byFuzzy, noMatch
    };
  }, [matches]);

  // Filtered matches based on confidence filter
  const filteredMatches = useMemo(() => {
    if (confidenceFilter === "all") return matches;
    return matches.filter(m => m.matchResult?.confidence === confidenceFilter);
  }, [matches, confidenceFilter]);

  const getConfidenceIcon = (confidence: string | undefined) => {
    switch (confidence) {
      case "high":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "medium":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "low":
        return <HelpCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <X className="w-4 h-4 text-destructive" />;
    }
  };

  const getMatchTypeIcon = (matchType: MatchType | undefined) => {
    switch (matchType) {
      case "model_code":
        return <Code className="w-3 h-3" />;
      case "equipment_name":
        return <Wrench className="w-3 h-3" />;
      case "fuzzy":
        return <Sparkles className="w-3 h-3" />;
      default:
        return <X className="w-3 h-3" />;
    }
  };

  const autoConfirmHighConfidence = () => {
    // Already high confidence matches are auto-confirmed, this just filters the view
    setConfidenceFilter("high");
    toast({
      title: "Filtro aplicado",
      description: `Exibindo ${stats.highConfidence} matches de alta confiança prontos para upload.`,
    });
  };

  return (
    <Card className="w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b flex-shrink-0">
        <div>
          <CardTitle>Importação em Massa de Imagens</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Arraste imagens ou clique para selecionar. O sistema sugere correspondências automaticamente.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-6 min-h-0 overflow-auto">
        {/* Drag and Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
            uploading || loadingProducts 
              ? "border-muted bg-muted/20 cursor-not-allowed" 
              : "border-border hover:border-primary hover:bg-primary/5"
          )}
          onClick={() => !uploading && !loadingProducts && document.getElementById('file-input')?.click()}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            Arraste imagens aqui ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPEG, WebP até 10MB • Nomes de arquivo são usados para correspondência automática
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleInputChange}
            disabled={uploading || loadingProducts}
            className="hidden"
          />
        </div>

        {/* Statistics */}
        {matches.length > 0 && (
          <div className="space-y-3">
            {/* Match type stats */}
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="outline" className="gap-1">
                Total: {stats.total}
              </Badge>
              <Badge className="gap-1 bg-emerald-500">
                <Code className="w-3 h-3" />
                Por Código: {stats.byModelCode}
              </Badge>
              <Badge className="gap-1 bg-blue-500">
                <Wrench className="w-3 h-3" />
                Por Equipamento: {stats.byEquipmentName}
              </Badge>
              <Badge className="gap-1 bg-amber-500">
                <Sparkles className="w-3 h-3" />
                Por Similaridade: {stats.byFuzzy}
              </Badge>
              <Badge variant="destructive" className="gap-1">
                <X className="w-3 h-3" />
                Sem match: {stats.noMatch}
              </Badge>
            </div>

            {/* Filter and actions row */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select 
                  value={confidenceFilter} 
                  onValueChange={(v) => setConfidenceFilter(v as ConfidenceFilter)}
                >
                  <SelectTrigger className="w-[180px] h-8">
                    <SelectValue placeholder="Filtrar por confiança" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos ({stats.total})</SelectItem>
                    <SelectItem value="high">Alta confiança ({stats.highConfidence})</SelectItem>
                    <SelectItem value="medium">Média confiança ({stats.mediumConfidence})</SelectItem>
                    <SelectItem value="low">Baixa confiança ({stats.lowConfidence})</SelectItem>
                    <SelectItem value="none">Sem match ({stats.noMatch})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {stats.highConfidence > 0 && confidenceFilter !== "high" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={autoConfirmHighConfidence}
                  className="gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  Ver {stats.highConfidence} de alta confiança
                </Button>
              )}

              {stats.success > 0 && (
                <Badge className="gap-1 bg-green-600">
                  Enviadas: {stats.success}
                </Badge>
              )}
              {stats.errors > 0 && (
                <Badge variant="destructive" className="gap-1">
                  Erros: {stats.errors}
                </Badge>
              )}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso do Upload</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {matches.length} {matches.length === 1 ? 'arquivo selecionado' : 'arquivos selecionados'}
            {stats.withProduct > 0 && ` • ${stats.withProduct} com produto associado`}
          </p>
          {matches.length > 0 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  matches.forEach(m => URL.revokeObjectURL(m.preview));
                  setMatches([]);
                }}
                disabled={uploading}
              >
                Limpar tudo
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploading || stats.pending === 0}
                className="gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Enviar {stats.pending} {stats.pending === 1 ? 'imagem' : 'imagens'}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 border rounded-md min-h-0 max-h-[calc(80vh-350px)]">
          {matches.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhuma imagem selecionada</p>
              <p className="text-xs mt-1">
                Dica: Nomeie os arquivos com o nome do produto para correspondência automática
              </p>
            </div>
          ) : (
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Preview</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead className="w-[140px]">Match</TableHead>
                    <TableHead className="w-[350px]">Produto</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMatches.map((match, index) => {
                    const originalIndex = matches.indexOf(match);
                    return (
                    <TableRow key={originalIndex} className={cn(
                      match.status === "success" && "bg-green-50 dark:bg-green-950/20",
                      match.status === "error" && "bg-red-50 dark:bg-red-950/20"
                    )}>
                      <TableCell>
                        <img
                          src={match.preview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border"
                        />
                      </TableCell>
                      <TableCell className="font-medium text-sm max-w-[200px]">
                        <div className="truncate" title={match.file.name}>
                          {match.file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(match.file.size / 1024).toFixed(0)} KB
                        </div>
                        {/* Show detected codes and equipment */}
                        {match.matchResult?.detectedCodes && match.matchResult.detectedCodes.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {match.matchResult.detectedCodes.slice(0, 3).map((code, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {/* Match type badge */}
                          {match.matchResult && match.matchResult.matchType !== "none" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge 
                                  className={cn(
                                    "gap-1 w-fit cursor-help",
                                    getMatchTypeColor(match.matchResult.matchType)
                                  )}
                                >
                                  {getMatchTypeIcon(match.matchResult.matchType)}
                                  {getMatchTypeLabel(match.matchResult.matchType)}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  {match.matchResult.matchType === "model_code" && "Match por código de modelo (ex: D25960K)"}
                                  {match.matchResult.matchType === "equipment_name" && "Match por tipo de equipamento"}
                                  {match.matchResult.matchType === "fuzzy" && "Match por similaridade de texto"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Badge variant="outline" className="gap-1 w-fit">
                              <X className="w-3 h-3" />
                              Manual
                            </Badge>
                          )}
                          
                          {/* Confidence indicator */}
                          {match.matchResult && match.matchResult.similarity > 0 && (
                            <div className="text-xs text-muted-foreground">
                              {Math.round(match.matchResult.similarity * 100)}%
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Select
                            value={match.product?.id || ""}
                            onValueChange={(value) => updateProductMatch(originalIndex, value)}
                            disabled={uploading || match.status === "success"}
                          >
                            <SelectTrigger className={cn(
                              "w-full",
                              !match.product && "border-orange-300 dark:border-orange-700"
                            )}>
                              <SelectValue placeholder="Selecione um produto">
                                {match.product ? (
                                  <div className="flex flex-col items-start">
                                    <span className="text-sm truncate max-w-[280px]">{match.product.name}</span>
                                    {match.product.supplier_code && (
                                      <span className="text-xs text-muted-foreground">
                                        Cód: {match.product.supplier_code}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Selecione...</span>
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <div className="p-2 sticky top-0 bg-background">
                                <div className="relative">
                                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Buscar produto..."
                                    className="pl-8"
                                    value={productSearch[originalIndex] || ""}
                                    onChange={(e) => setProductSearch(prev => ({ ...prev, [originalIndex]: e.target.value }))}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                              </div>
                              <ScrollArea className="h-[200px]">
                                {getFilteredProducts(originalIndex).map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    <div className="flex flex-col">
                                      <span className="truncate max-w-[280px]">{product.name}</span>
                                      <div className="flex gap-2 text-xs text-muted-foreground">
                                        {product.supplier_code && (
                                          <span>Cód: {product.supplier_code}</span>
                                        )}
                                        {product.brand && (
                                          <span>• {product.brand}</span>
                                        )}
                                        {product.image_url && (
                                          <span className="text-green-600">✓ Tem imagem</span>
                                        )}
                                      </div>
                                    </div>
                                  </SelectItem>
                                ))}
                                {getFilteredProducts(originalIndex).length === 0 && (
                                  <div className="p-4 text-center text-sm text-muted-foreground">
                                    Nenhum produto encontrado
                                  </div>
                                )}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        {match.status === "pending" && (
                          <Badge variant="outline">
                            {match.product ? "Pronto" : "Sem produto"}
                          </Badge>
                        )}
                        {match.status === "uploading" && (
                          <Badge variant="secondary">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Enviando
                          </Badge>
                        )}
                        {match.status === "success" && (
                          <Badge className="bg-green-600">Sucesso</Badge>
                        )}
                        {match.status === "error" && (
                          <Badge variant="destructive" title={match.message}>
                            Erro
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMatch(originalIndex)}
                          disabled={uploading || match.status === "success"}
                          className="h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TooltipProvider>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
