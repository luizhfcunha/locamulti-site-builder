import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CatalogSidebar } from "@/components/CatalogSidebar";
import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Grid3x3, List, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// Mock data de equipamentos
const mockEquipments = [
  {
    id: "1",
    name: "Martelo Demolidor 30kg SDS Max",
    category: "Construção e Demolição",
    brand: "Bosch",
    imageUrl: "/placeholder.svg",
    specifications: ["Potência: 1500W", "Impacto: 30 joules", "Tensão: 220V"],
  },
  {
    id: "2",
    name: "Betoneira 400L Profissional",
    category: "Concretagem e Vibração",
    brand: "Maqtron",
    imageUrl: "/placeholder.svg",
    specifications: ["Capacidade: 400L", "Motor: 2HP monofásico", "Tensão: 220V"],
  },
  {
    id: "3",
    name: "Gerador a Diesel 8kVA Silenciado",
    category: "Energia e Geração",
    brand: "Toyama",
    imageUrl: "/placeholder.svg",
    specifications: ["Potência: 8kVA", "Combustível: Diesel", "Partida elétrica"],
  },
  {
    id: "4",
    name: "Máquina de Solda Inversora MIG 250A",
    category: "Soldagem Profissional",
    brand: "ESAB",
    imageUrl: "/placeholder.svg",
    specifications: ["Corrente: 250A", "Processo: MIG/MAG", "Tensão: 220V/380V"],
  },
  {
    id: "5",
    name: "Empilhadeira Manual Hidráulica 2500kg",
    category: "Movimentação de Cargas",
    brand: "Paletrans",
    imageUrl: "/placeholder.svg",
    specifications: ["Capacidade: 2500kg", "Elevação: manual", "Garfos: 1150mm"],
  },
  {
    id: "6",
    name: "Compressor de Ar 10 Pés 100L",
    category: "Pintura e Acabamento",
    brand: "Schulz",
    imageUrl: "/placeholder.svg",
    specifications: ["Vazão: 10 pés³/min", "Reservatório: 100L", "Tensão: 220V"],
  },
  {
    id: "7",
    name: "Bomba Hidráulica 700 Bar",
    category: "Ferramentas Hidráulicas",
    brand: "Bovenau",
    imageUrl: "/placeholder.svg",
    specifications: ["Pressão: 700 bar", "Fluxo: 1,6L/min", "Acionamento: manual"],
  },
  {
    id: "8",
    name: "Roçadeira Costal 52cc",
    category: "Jardinagem e Limpeza",
    brand: "Stihl",
    imageUrl: "/placeholder.svg",
    specifications: ["Motor: 52cc 2 tempos", "Potência: 2,3HP", "Peso: 8,5kg"],
  },
  {
    id: "9",
    name: "Furadeira de Impacto 850W",
    category: "Construção e Demolição",
    brand: "DeWalt",
    imageUrl: "/placeholder.svg",
    specifications: ["Potência: 850W", "Mandril: 13mm", "Velocidade variável"],
  },
  {
    id: "10",
    name: "Vibrador de Concreto Elétrico 2200W",
    category: "Concretagem e Vibração",
    brand: "Vibromaq",
    imageUrl: "/placeholder.svg",
    specifications: ["Potência: 2200W", "Mangote: 4m", "Diâmetro: 45mm"],
  },
  {
    id: "11",
    name: "Gerador Gasolina 2,5kVA",
    category: "Energia e Geração",
    brand: "Honda",
    imageUrl: "/placeholder.svg",
    specifications: ["Potência: 2,5kVA", "Combustível: Gasolina", "Peso: 45kg"],
  },
  {
    id: "12",
    name: "Transformador de Solda 300A",
    category: "Soldagem Profissional",
    brand: "Sumig",
    imageUrl: "/placeholder.svg",
    specifications: ["Corrente: 300A", "Processo: Eletrodo", "Tensão: 220V/380V"],
  },
];

const categories = {
  id: "categories",
  label: "Categorias",
  options: [
    { id: "construcao", label: "Construção e Demolição" },
    { id: "concretagem", label: "Concretagem e Vibração" },
    { id: "energia", label: "Energia e Geração" },
    { id: "soldagem", label: "Soldagem Profissional" },
    { id: "movimentacao", label: "Movimentação de Cargas" },
    { id: "pintura", label: "Pintura e Acabamento" },
    { id: "hidraulica", label: "Ferramentas Hidráulicas" },
    { id: "jardinagem", label: "Jardinagem e Limpeza" },
  ],
};

const brands = {
  id: "brands",
  label: "Marcas",
  options: [
    { id: "bosch", label: "Bosch" },
    { id: "dewalt", label: "DeWalt" },
    { id: "esab", label: "ESAB" },
    { id: "sumig", label: "Sumig" },
    { id: "toyama", label: "Toyama" },
    { id: "vibromaq", label: "Vibromaq" },
    { id: "bovenau", label: "Bovenau" },
  ],
};

const voltages = {
  id: "voltages",
  label: "Tensão",
  options: [
    { id: "110v", label: "110V" },
    { id: "220v", label: "220V" },
    { id: "380v", label: "380V" },
    { id: "bivolt", label: "Bivolt" },
  ],
};

const applications = {
  id: "applications",
  label: "Aplicação",
  options: [
    { id: "construcao-civil", label: "Construção Civil" },
    { id: "industria", label: "Indústria" },
    { id: "manutencao", label: "Manutenção" },
    { id: "agricultura", label: "Agricultura" },
  ],
};

type ViewMode = "grid" | "list";
type SortOption = "relevance" | "name" | "popular";

const Catalogo = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filtrar e ordenar equipamentos
  const filteredEquipments = useMemo(() => {
    let result = [...mockEquipments];

    // Aplicar busca
    if (searchQuery) {
      result = result.filter((eq) =>
        eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        eq.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Aplicar ordenação
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "popular") {
      result.reverse(); // Mock: inverte a ordem
    }

    return result;
  }, [searchQuery, sortBy, filters]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="flex">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block">
            <CatalogSidebar
              categories={categories}
              brands={brands}
              voltages={voltages}
              applications={applications}
              onSearch={setSearchQuery}
              onFilterChange={setFilters}
            />
          </div>

          {/* Área Principal */}
          <div className="flex-1 min-h-screen">
            {/* Header da página */}
            <div className="border-b border-border bg-background sticky top-0 z-10">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                      Catálogo de Equipamentos
                    </h1>
                    <p className="text-muted-foreground">
                      {filteredEquipments.length} equipamentos disponíveis
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Filtros Mobile */}
                    <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden gap-2">
                          <SlidersHorizontal className="h-4 w-4" />
                          Filtros
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-0">
                        <CatalogSidebar
                          categories={categories}
                          brands={brands}
                          voltages={voltages}
                          applications={applications}
                          onSearch={setSearchQuery}
                          onFilterChange={setFilters}
                        />
                      </SheetContent>
                    </Sheet>

                    {/* Ordenação */}
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px] rounded-input">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevância</SelectItem>
                        <SelectItem value="name">Nome</SelectItem>
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
              </div>
            </div>

            {/* Grid de Equipamentos */}
            <div className="container mx-auto px-4 py-8">
              {filteredEquipments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    Nenhum equipamento encontrado.
                  </p>
                </div>
              ) : (
                <>
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredEquipments.map((equipment) => (
                        <EquipmentCard
                          key={equipment.id}
                          name={equipment.name}
                          category={equipment.category}
                          brand={equipment.brand}
                          imageUrl={equipment.imageUrl}
                          specifications={equipment.specifications}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEquipments.map((equipment) => (
                        <div
                          key={equipment.id}
                          className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-card bg-card hover:shadow-medium transition-all duration-base"
                        >
                          <div className="w-full sm:w-48 h-48 bg-muted rounded-card overflow-hidden flex-shrink-0">
                            <img
                              src={equipment.imageUrl}
                              alt={equipment.name}
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
                              <ul className="space-y-1 mb-4">
                                {equipment.specifications.map((spec, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{spec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center gap-3">
                              <Button
                                variant="default"
                                onClick={() => {
                                  const message = encodeURIComponent(
                                    `Olá! Gostaria de solicitar um orçamento para: ${equipment.name}`
                                  );
                                  window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
                                }}
                                className="flex-1 sm:flex-none"
                              >
                                Solicitar Orçamento
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalogo;
