import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ImageOff, 
  Search, 
  Download, 
  RefreshCw, 
  Loader2,
  Filter,
  Package,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { findImageForProduct } from "@/utils/imageMatcher";

interface CatalogItem {
  id: string;
  code: string;
  description: string;
  category_name: string;
  family_name: string;
  item_type: string;
  image_url: string | null;
}

export default function MissingImages() {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [totalItems, setTotalItems] = useState(0);
  const [totalWithDbImages, setTotalWithDbImages] = useState(0);
  const [totalWithFallback, setTotalWithFallback] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all catalog items
      const { data, error } = await supabase
        .from("catalog_items")
        .select("id, code, description, category_name, family_name, item_type, image_url")
        .eq("active", true)
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true })
        .order("item_order", { ascending: true });

      if (error) throw error;

      const allItems = data || [];
      setTotalItems(allItems.length);
      
      // Count items with DB images
      const withDbImages = allItems.filter(i => i.image_url).length;
      setTotalWithDbImages(withDbImages);

      // Count items with fallback images (local matching)
      const withFallback = allItems.filter(i => 
        !i.image_url && findImageForProduct(i.code, i.description)
      ).length;
      setTotalWithFallback(withFallback);

      // Filter to only show items without ANY image (no DB image AND no fallback)
      const noImageItems = allItems.filter(item => {
        if (item.image_url) return false;
        const fallback = findImageForProduct(item.code, item.description);
        return !fallback;
      });

      setItems(noImageItems);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(items.map(i => i.category_name))].sort();

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category_name === selectedCategory;
    const matchesType = selectedType === "all" || item.item_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  // Calculate statistics
  const missingCount = items.length;
  const coveragePercentage = totalItems > 0 
    ? Math.round(((totalWithDbImages + totalWithFallback) / totalItems) * 100) 
    : 0;

  // Export to CSV
  const exportToCsv = () => {
    const headers = ["Código", "Descrição", "Categoria", "Família", "Tipo"];
    const rows = filteredItems.map(i => [
      i.code,
      i.description,
      i.category_name,
      i.family_name,
      i.item_type
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `itens-sem-imagem-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Itens sem Imagem
            </h1>
            <p className="text-muted-foreground mt-1">
              Relatório de itens do catálogo que precisam de fotos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchData} disabled={loading}>
              <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
              Atualizar
            </Button>
            <Button variant="outline" onClick={exportToCsv} disabled={filteredItems.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Catálogo</p>
                  <p className="text-2xl font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Com Imagem (DB)</p>
                  <p className="text-2xl font-bold text-green-600">{totalWithDbImages}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fallback Local</p>
                  <p className="text-2xl font-bold text-blue-600">{totalWithFallback}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <ImageOff className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sem Imagem</p>
                  <p className="text-2xl font-bold text-destructive">{missingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cobertura</p>
                  <p className="text-2xl font-bold">{coveragePercentage}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código ou descrição..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="equipamento">Equipamento</SelectItem>
                  <SelectItem value="consumivel">Consumível</SelectItem>
                </SelectContent>
              </Select>

              {(search || selectedCategory !== "all" || selectedType !== "all") && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                    setSelectedType("all");
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                Itens sem Imagem
                <Badge variant="outline" className="ml-2">
                  {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'itens'}
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                {items.length === 0 ? (
                  <>
                    <Package className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-medium">Todos os itens têm imagem! 🎉</p>
                    <p className="text-sm">Nenhum item pendente de foto.</p>
                  </>
                ) : (
                  <>
                    <Search className="w-12 h-12 mb-3 opacity-50" />
                    <p className="font-medium">Nenhum item encontrado</p>
                    <p className="text-sm">Tente ajustar os filtros de busca.</p>
                  </>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[120px]">Código</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="w-[180px]">Categoria</TableHead>
                      <TableHead className="w-[180px]">Família</TableHead>
                      <TableHead className="w-[100px]">Tipo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {item.code}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                              <ImageOff className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium truncate max-w-[250px]" title={item.description}>
                              {item.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category_name}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {item.family_name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={item.item_type === "equipamento" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {item.item_type === "equipamento" ? "Equip." : "Cons."}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
