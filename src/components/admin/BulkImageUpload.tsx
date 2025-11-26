import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react";

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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        const newFiles = Array.from(e.target.files);
        const newMatches: ProductMatch[] = newFiles.map((file) => {
            const fileName = file.name.split(".")[0]; // Remove extension
            const normalizedFileName = normalizeString(fileName);

            // Try to find match by supplier_code or name
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
    };

    const removeMatch = (index: number) => {
        setMatches((prev) => prev.filter((_, i) => i !== index));
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

                // Update status to success
                setMatches(prev => prev.map((m, idx) =>
                    idx === i ? { ...m, status: "success" } : m
                ));

            } catch (error: any) {
                console.error("Upload error:", error);
                setMatches(prev => prev.map((m, idx) =>
                    idx === i ? { ...m, status: "error", message: error.message } : m
                ));
            }
        }

        setUploading(false);
        toast({
            title: "Processo finalizado",
            description: "Verifique o status de cada item na lista.",
        });

        // Call onSuccess if at least one upload was successful
        if (matches.some(m => m.status === "success")) {
            onSuccess();
        }
    };

    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Importação em Massa de Imagens</CardTitle>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={uploading || loadingProducts}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Nome do arquivo deve ser igual ao Nome ou Código do produto.
                        </p>
                    </div>
                    <Button
                        onClick={handleUpload}
                        disabled={uploading || matches.filter(m => m.status === "pending" && m.product).length === 0}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4 mr-2" />
                                Iniciar Upload
                            </>
                        )}
                    </Button>
                </div>

                <ScrollArea className="flex-1 border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Arquivo</TableHead>
                                <TableHead>Produto Encontrado</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {matches.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhum arquivo selecionado
                                    </TableCell>
                                </TableRow>
                            ) : (
                                matches.map((match, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <img
                                                src={match.preview}
                                                alt="Preview"
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{match.file.name}</TableCell>
                                        <TableCell>
                                            {match.product ? (
                                                <div className="flex flex-col">
                                                    <span>{match.product.name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        Cód: {match.product.supplier_code || "-"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-destructive">Não encontrado</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {match.status === "pending" && <Badge variant="outline">Pendente</Badge>}
                                            {match.status === "uploading" && <Badge variant="secondary">Enviando...</Badge>}
                                            {match.status === "success" && <Badge className="bg-green-500">Sucesso</Badge>}
                                            {match.status === "error" && (
                                                <Badge variant="destructive" title={match.message}>Erro</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeMatch(index)}
                                                disabled={uploading}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};
