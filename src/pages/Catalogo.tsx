import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/CatalogSidebar";
import { EquipmentCard } from "@/components/EquipmentCard";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { WHATSAPP } from "@/config/whatsapp";
import { getCatalog, getCategoriesWithFamiliesAndSubfamilies } from "@/lib/catalog";
import { useToast } from "@/hooks/use-toast";
import { trackWhatsAppClick } from "@/lib/analytics";

interface Equipment {
  id: string;
  name: string | null;
  category: string | null;
  family: string | null;
  subfamily: string | null;
  brand: string | null;
  image_url: string | null;
  description: string | null;
  supplier_code: string | null;
}

type ViewMode = "grid" | "list";
type SortOption = "relevance" | "name" | "name_desc" | "popular";

const Catalogo = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<{ category: string; families: { name: string; subfamilies: string[] }[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 24;

  // Estados para filtros com accordion de 3 níveis
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedSubfamily, setSelectedSubfamily] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedFamily, setExpandedFamily] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Carregar categorias com hierarquia completa
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategoriesWithFamiliesAndSubfamilies();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };

    loadCategories();
  }, []);

  // Handler para selecionar subfamília
  const handleSubfamilyClick = (category: string, family: string, subfamily: string) => {
    setSelectedCategory(category);
    setSelectedFamily(family);
    setSelectedSubfamily(subfamily);
    setCurrentPage(1);
    setIsFilterOpen(false); // Fechar drawer no mobile
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedFamily(null);
    setSelectedSubfamily(null);
    setExpandedCategory(null);
    setExpandedFamily(null);
    setCurrentPage(1);
  };

  // Aplicar filtros do Supabase
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        const catalogFilters: any = {
          page: currentPage,
          pageSize,
        };

        if (selectedCategory) {
          catalogFilters.category = selectedCategory;
        }

        if (selectedFamily) {
          catalogFilters.family = selectedFamily;
        }

        if (selectedSubfamily) {
          catalogFilters.subfamily = selectedSubfamily;
        }

        if (searchQuery) {
          catalogFilters.search = searchQuery;
        }

        const result = await getCatalog(catalogFilters);
        setEquipments(result.data || []);
        setTotalCount(result.count || 0);
      } catch (error) {
        console.error("Erro ao filtrar catálogo:", error);
        toast({
          title: "Erro ao filtrar catálogo",
          description: "Não foi possível filtrar os equipamentos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [selectedCategory, selectedFamily, selectedSubfamily, searchQuery, currentPage, toast]);

  // Sincronizar busca da URL quando parâmetro mudar
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  // Reset para página 1 quando busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Scroll automático para o topo ao mudar de página
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Ordenar equipamentos
  const sortedEquipments = useMemo(() => {
    let result = [...equipments];

    if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "name_desc") {
      result.sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    } else if (sortBy === "popular") {
      result.reverse();
    }

    return result;
  }, [equipments, sortBy]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="flex min-h-screen">
          {/* Sidebar Desktop - largura fixa */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CatalogSidebar
              categories={categories}
              onSearch={setSearchQuery}
              onSubfamilyClick={handleSubfamilyClick}
              selectedCategory={selectedCategory}
              selectedFamily={selectedFamily}
              selectedSubfamily={selectedSubfamily}
              expandedCategory={expandedCategory}
              expandedFamily={expandedFamily}
              onExpandedCategoryChange={setExpandedCategory}
              onExpandedFamilyChange={setExpandedFamily}
            />
          </div>

          {/* Área Principal - flex-1 com min-w-0 para evitar overflow */}
          <div className="flex-1 min-w-0">
            {/* Header da página */}
            <div className="border-b border-border bg-background sticky top-0 z-10">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                      Catálogo de Equipamentos
                    </h1>
                    <p className="text-muted-foreground">
                      {loading ? "Carregando..." : `${totalCount} equipamentos disponíveis`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Filtros Mobile */}
                    <Button
                      variant="outline"
                      className="lg:hidden gap-2"
                      onClick={() => setIsFilterOpen(true)}
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filtrar
                    </Button>

                    {/* Ordenação */}
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px] rounded-input">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevância</SelectItem>
                        <SelectItem value="name">Nome (A-Z)</SelectItem>
                        <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                        <SelectItem value="popular">Mais Locados</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Visualização */}
                    <div className="flex items-center gap-1 border border-border rounded-button p-1">
                      <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className="h-8 w-8"
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className="h-8 w-8"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Badge de filtros ativos */}
                {(selectedCategory || selectedFamily || selectedSubfamily) && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">Filtros ativos:</span>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {[selectedCategory, selectedFamily, selectedSubfamily].filter(Boolean).join(" → ")}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-8 text-xs"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpar
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Grid de Equipamentos */}
            <div className="container mx-auto px-4 py-8">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center justify-between">
                <Breadcrumb>
                  <BreadcrumbList>
                    {!selectedCategory && !selectedFamily && !selectedSubfamily ? (
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-sm text-muted-foreground">
                          Todos os equipamentos
                        </BreadcrumbPage>
                      </BreadcrumbItem>
                    ) : (
                      <>
                        <BreadcrumbItem>
                          {selectedFamily || selectedSubfamily ? (
                            <BreadcrumbLink
                              asChild
                              className="text-sm cursor-pointer"
                            >
                              <button onClick={() => { setSelectedFamily(null); setSelectedSubfamily(null); }}>
                                {selectedCategory}
                              </button>
                            </BreadcrumbLink>
                          ) : (
                            <BreadcrumbPage className="text-sm">
                              {selectedCategory}
                            </BreadcrumbPage>
                          )}
                        </BreadcrumbItem>
                        {selectedFamily && (
                          <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              {selectedSubfamily ? (
                                <BreadcrumbLink
                                  asChild
                                  className="text-sm cursor-pointer"
                                >
                                  <button onClick={() => setSelectedSubfamily(null)}>
                                    {selectedFamily}
                                  </button>
                                </BreadcrumbLink>
                              ) : (
                                <BreadcrumbPage className="text-sm">
                                  {selectedFamily}
                                </BreadcrumbPage>
                              )}
                            </BreadcrumbItem>
                          </>
                        )}
                        {selectedSubfamily && (
                          <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage className="text-sm">
                                {selectedSubfamily}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        )}
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb>
                {(selectedCategory || selectedFamily || selectedSubfamily) && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs h-auto p-0"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full rounded-card" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : sortedEquipments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Nenhum equipamento encontrado.
                  </p>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                      {sortedEquipments.map((equipment) => (
                        <EquipmentCard
                          key={equipment.id}
                          id={equipment.id}
                          name={equipment.name || "Equipamento"}
                          category={equipment.category || ""}
                          subcategory={equipment.subfamily}
                          brand={equipment.brand || ""}
                          imageUrl={equipment.image_url || "/placeholder.svg"}
                          specifications={equipment.description ? [equipment.description] : []}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedEquipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-card bg-card hover:shadow-medium transition-all duration-base"
                        >
                          <div className="w-full sm:w-48 h-48 bg-muted rounded-card overflow-hidden flex-shrink-0">
                            <img
                              src={equipment.image_url || "/placeholder.svg"}
                              alt={equipment.name || "Equipamento"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                                  {equipment.category}
                                </span>
                                {equipment.brand && (
                                  <span className="text-xs text-muted-foreground font-medium">
                                    {equipment.brand}
                                  </span>
                                )}
                              </div>
                              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                                {equipment.name}
                              </h3>
                              {equipment.description && (
                                <p className="text-sm text-muted-foreground mb-4">
                                  {equipment.description}
                                </p>
                              )}
                              {equipment.subfamily && (
                                <p className="text-xs text-muted-foreground">
                                  <span className="font-medium">Subfamília:</span> {equipment.subfamily}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                              <WhatsappCTA
                                text="Solicitar Orçamento"
                                href={WHATSAPP.catalogoEquipamento.replace('[EQUIPAMENTO]', encodeURIComponent(equipment.name || "equipamento"))}
                                className="flex-1 sm:flex-none"
                                onClick={() => trackWhatsAppClick(equipment.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Paginação */}
              {!loading && sortedEquipments.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </PaginationItem>

                      {[...Array(Math.ceil(totalCount / pageSize))].map((_, i) => {
                        const pageNum = i + 1;
                        const totalPages = Math.ceil(totalCount / pageSize);

                        // Mostrar apenas páginas próximas à atual
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <span className="px-4">...</span>
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / pageSize), p + 1))}
                          disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                          className="gap-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Drawer Mobile */}
      <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-heading text-xl">Filtrar Equipamentos</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="absolute right-4 top-4">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            <CatalogSidebar
              categories={categories}
              onSearch={setSearchQuery}
              onSubfamilyClick={handleSubfamilyClick}
              selectedCategory={selectedCategory}
              selectedFamily={selectedFamily}
              selectedSubfamily={selectedSubfamily}
              expandedCategory={expandedCategory}
              expandedFamily={expandedFamily}
              onExpandedCategoryChange={setExpandedCategory}
              onExpandedFamilyChange={setExpandedFamily}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Footer />
    </div>
  );
};

export default Catalogo;
