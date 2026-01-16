import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Loader2, 
  Edit, 
  Package, 
  Filter,
  ImageIcon,
  ImageOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { findImageForProduct } from "@/utils/imageMatcher";

interface CatalogItem {
  id: string;
  code: string;
  description: string;
  category_name: string;
  category_slug: string;
  family_name: string;
  family_slug: string;
  item_type: string;
  image_url: string | null;
  active: boolean;
  category_order: number;
  family_order: number;
  item_order: number;
}

interface CatalogItemListProps {
  refreshTrigger?: number;
  onEdit: (item: CatalogItem) => void;
}

export function CatalogItemList({ refreshTrigger, onEdit }: CatalogItemListProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedFamily, setSelectedFamily] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchItems();
  }, [refreshTrigger]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true })
        .order("item_order", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = [...new Set(items.map(i => i.category_name))].sort();
  
  // Get unique families (filtered by selected category)
  const families = [...new Set(
    items
      .filter(i => selectedCategory === "all" || i.category_name === selectedCategory)
      .map(i => i.family_name)
  )].sort();

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesSearch = search === "" || 
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category_name === selectedCategory;
    const matchesFamily = selectedFamily === "all" || item.family_name === selectedFamily;
    const matchesType = selectedType === "all" || item.item_type === selectedType;
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "active" && item.active) ||
      (selectedStatus === "inactive" && !item.active);

    return matchesSearch && matchesCategory && matchesFamily && matchesType && matchesStatus;
  });

  // Statistics
  const stats = {
    total: items.length,
    equipamentos: items.filter(i => i.item_type === "equipamento").length,
    consumiveis: items.filter(i => i.item_type === "consumivel").length,
    withImage: items.filter(i => i.image_url).length,
  };

  const getItemImage = (item: CatalogItem): string | null => {
    return item.image_url || findImageForProduct(item.code, item.description) || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Equipamentos</p>
                <p className="text-xl font-bold">{stats.equipamentos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Consumíveis</p>
                <p className="text-xl font-bold">{stats.consumiveis}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-xs text-muted-foreground">Com Imagem (DB)</p>
                <p className="text-xl font-bold">{stats.withImage}</p>
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
          <div className="flex flex-wrap gap-3">
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

            <Select value={selectedCategory} onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedFamily("all");
            }}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFamily} onValueChange={setSelectedFamily}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Família" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as famílias</SelectItem>
                {families.map((fam) => (
                  <SelectItem key={fam} value={fam}>{fam}</SelectItem>
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

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
              </SelectContent>
            </Select>

            {(search || selectedCategory !== "all" || selectedFamily !== "all" || 
              selectedType !== "all" || selectedStatus !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedFamily("all");
                  setSelectedType("all");
                  setSelectedStatus("all");
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader className="border-b py-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">
              Itens do Catálogo
              <Badge variant="outline" className="ml-2">
                {filteredItems.length} itens
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Img</TableHead>
                  <TableHead className="w-[120px]">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[180px]">Categoria</TableHead>
                  <TableHead className="w-[180px]">Família</TableHead>
                  <TableHead className="w-[100px]">Tipo</TableHead>
                  <TableHead className="w-[80px]">Status</TableHead>
                  <TableHead className="w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const imageUrl = getItemImage(item);
                  return (
                    <TableRow key={item.id} className={cn(!item.active && "opacity-50")}>
                      <TableCell>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.code}
                            className="w-10 h-10 object-contain rounded border bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded border bg-muted flex items-center justify-center">
                            <ImageOff className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[300px] truncate" title={item.description}>
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.category_name}
                        </Badge>
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
                      <TableCell>
                        <Badge 
                          variant={item.active ? "default" : "outline"}
                          className={cn(
                            "text-xs",
                            item.active ? "bg-green-500" : "text-muted-foreground"
                          )}
                        >
                          {item.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
