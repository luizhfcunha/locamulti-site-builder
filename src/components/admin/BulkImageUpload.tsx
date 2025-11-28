import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductMatch {
    file: File;
    preview: string;
    product: any | null;
    status: "pending" | "uploading" | "success" | "error";
    message?: string;
}

interface BulkImageUploadProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const BulkImageUpload = ({ onClose, onSuccess }: BulkImageUploadProps) => {
    const [matches, setMatches] = useState<ProductMatch[]>([]);
    const [uploading, setUploading] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("id, name, supplier_code, image_url");

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast({
                title: "Erro ao carregar produtos",
                variant: "destructive",
            });
        } finally {
            setLoadingProducts(false);
        }
    };

    const normalizeString = (str: string) => {
        return str?.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
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
            const fileName = file.name.split(".")[0];
            const normalizedFileName = normalizeString(fileName);

            const matchedProduct = products.find((p) => {
                const codeMatch = p.supplier_code && normalizeString(p.supplier_code) === normalizedFileName;
                const nameMatch = normalizeString(p.name) === normalizedFileName;
                return codeMatch || nameMatch;
            });

            return {
                file,
                preview: URL.createObjectURL(file),
                product: matchedProduct || null,
                status: "pending",
            };
        });

        setMatches((prev) => [...prev, ...newMatches]);
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
            i === index ? { ...m, product: product || null } : m
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

                // 3. Update product
                const { error: updateError } = await supabase
                    .from("products")
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
            onSuccess();
        }
    };

    const uploadProgress = matches.length > 0 
        ? (matches.filter(m => m.status === "success" || m.status === "error").length / matches.length) * 100 
        : 0;

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between border-b">
                <div>
                    <CardTitle>Importação em Massa de Imagens</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Arraste imagens ou clique para selecionar. Associe cada imagem a um produto.
                    </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-6">
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
                        PNG, JPEG, WebP até 10MB
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
                    </p>
                    {matches.length > 0 && (
                        <Button
                            onClick={handleUpload}
                            disabled={uploading || matches.filter(m => m.status === "pending" && m.product).length === 0}
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
                                    Enviar {matches.filter(m => m.status === "pending" && m.product).length} {matches.filter(m => m.status === "pending" && m.product).length === 1 ? 'imagem' : 'imagens'}
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <ScrollArea className="flex-1 border rounded-md">
                    {matches.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Nenhuma imagem selecionada</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Preview</TableHead>
                                    <TableHead>Arquivo</TableHead>
                                    <TableHead className="w-[300px]">Produto</TableHead>
                                    <TableHead className="w-[120px]">Status</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {matches.map((match, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <img
                                                src={match.preview}
                                                alt="Preview"
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-sm">
                                            {match.file.name}
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={match.product?.id || ""}
                                                onValueChange={(value) => updateProductMatch(index, value)}
                                                disabled={uploading || match.status === "success"}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione um produto">
                                                        {match.product ? (
                                                            <div className="flex flex-col items-start">
                                                                <span className="text-sm">{match.product.name}</span>
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
                                                    <ScrollArea className="h-[200px]">
                                                        {products.map((product) => (
                                                            <SelectItem key={product.id} value={product.id}>
                                                                <div className="flex flex-col">
                                                                    <span>{product.name}</span>
                                                                    {product.supplier_code && (
                                                                        <span className="text-xs text-muted-foreground">
                                                                            Cód: {product.supplier_code}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
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
                                            {match.status !== "success" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeMatch(index)}
                                                    disabled={uploading}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
