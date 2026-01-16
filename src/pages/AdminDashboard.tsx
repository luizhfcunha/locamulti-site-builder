import { useEffect, useState } from "react";
import { format, subDays, subMonths, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, FolderTree, CheckCircle, XCircle, Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

type PresetPeriod = "all" | "7d" | "30d" | "90d" | "6m" | "1y" | "custom";

interface DashboardStats {
  totalItems: number;
  totalCategories: number;
  totalFamilies: number;
  activeItems: number;
  inactiveItems: number;
  equipmentCount: number;
  consumableCount: number;
  itemsByCategory: { name: string; count: number }[];
  itemsByFamily: { name: string; count: number }[];
  itemsByType: { name: string; count: number }[];
  itemsByMonth: { month: string; count: number }[];
}

const COLORS = ["#DB5A34", "#B94935", "#3E2229", "#373435", "#F6F3F2", "#DB5A3480", "#B9493580"];

const PRESET_PERIODS: { value: PresetPeriod; label: string }[] = [
  { value: "all", label: "Todo o período" },
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "6m", label: "Últimos 6 meses" },
  { value: "1y", label: "Último ano" },
  { value: "custom", label: "Período personalizado" },
];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [presetPeriod, setPresetPeriod] = useState<PresetPeriod>("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalCategories: 0,
    totalFamilies: 0,
    activeItems: 0,
    inactiveItems: 0,
    equipmentCount: 0,
    consumableCount: 0,
    itemsByCategory: [],
    itemsByFamily: [],
    itemsByType: [],
    itemsByMonth: [],
  });

  // Calculate date range based on preset
  const getDateRangeFromPreset = (preset: PresetPeriod): DateRange => {
    const now = new Date();
    switch (preset) {
      case "7d":
        return { from: subDays(now, 7), to: now };
      case "30d":
        return { from: subDays(now, 30), to: now };
      case "90d":
        return { from: subDays(now, 90), to: now };
      case "6m":
        return { from: subMonths(now, 6), to: now };
      case "1y":
        return { from: subMonths(now, 12), to: now };
      case "custom":
        return dateRange;
      default:
        return { from: undefined, to: undefined };
    }
  };

  const effectiveDateRange = presetPeriod === "custom" ? dateRange : getDateRangeFromPreset(presetPeriod);

  useEffect(() => {
    fetchDashboardData();
  }, [presetPeriod, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Build query with date filters
      let baseQuery = supabase.from("catalog_items").select("*", { count: "exact" });
      
      if (effectiveDateRange.from) {
        baseQuery = baseQuery.gte("created_at", startOfDay(effectiveDateRange.from).toISOString());
      }
      if (effectiveDateRange.to) {
        baseQuery = baseQuery.lte("created_at", endOfDay(effectiveDateRange.to).toISOString());
      }

      const { data: allItems, count: totalItems } = await baseQuery;

      // Filter items for other counts
      const filteredItems = allItems || [];
      const activeItems = filteredItems.filter(item => item.active === true).length;
      const inactiveItems = filteredItems.filter(item => item.active === false).length;
      const equipmentCount = filteredItems.filter(item => item.item_type === "equipamento").length;
      const consumableCount = filteredItems.filter(item => item.item_type === "consumivel").length;

      // Calculate unique categories and families from items
      const uniqueCategories = new Set(filteredItems.map(item => item.category_slug));
      const uniqueFamilies = new Set(filteredItems.map(item => item.family_slug));

      // Items by category
      const categoryMap = new Map<string, number>();
      filteredItems.forEach((item) => {
        const name = item.category_name;
        categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
      });
      const itemsByCategory = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Items by family (top 10)
      const familyMap = new Map<string, number>();
      filteredItems.forEach((item) => {
        const name = item.family_name;
        familyMap.set(name, (familyMap.get(name) || 0) + 1);
      });
      const itemsByFamily = Array.from(familyMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Items by type
      const itemsByType = [
        { name: "Equipamentos", count: equipmentCount },
        { name: "Consumíveis", count: consumableCount },
      ];

      // Items by month (last 6 months)
      const now = new Date();
      const monthMap = new Map<string, number>();
      const last6Months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        last6Months.push(monthKey);
        monthMap.set(monthKey, 0);
      }

      filteredItems.forEach((item) => {
        if (item.created_at) {
          const date = new Date(item.created_at);
          const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
          if (monthMap.has(monthKey)) {
            monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
          }
        }
      });

      const itemsByMonth = last6Months.map((month) => ({
        month,
        count: monthMap.get(month) || 0,
      }));

      setStats({
        totalItems: totalItems || 0,
        totalCategories: uniqueCategories.size,
        totalFamilies: uniqueFamilies.size,
        activeItems,
        inactiveItems,
        equipmentCount,
        consumableCount,
        itemsByCategory,
        itemsByFamily,
        itemsByType,
        itemsByMonth,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Ocorreu um erro ao buscar os dados do dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Tabs defaultValue="products" className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-lm-plum mb-2">
            Dashboard
          </h1>
          <p className="text-lm-ink mb-4">Visão geral do catálogo e analytics</p>
          
          <TabsList>
            <TabsTrigger value="products">Catálogo</TabsTrigger>
            <TabsTrigger value="analytics">Analytics e Conversões</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-6">
          {/* Period Filter */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Filtrar por período</CardTitle>
              <CardDescription>Selecione um período para analisar os dados do catálogo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Select value={presetPeriod} onValueChange={(value: PresetPeriod) => setPresetPeriod(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESET_PERIODS.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {presetPeriod === "custom" && (
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[140px] justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? format(dateRange.from, "dd/MM/yyyy") : "Data início"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.from}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-muted-foreground">até</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[140px] justify-start text-left font-normal",
                            !dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.to ? format(dateRange.to, "dd/MM/yyyy") : "Data fim"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateRange.to}
                          onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {effectiveDateRange.from && effectiveDateRange.to && (
                  <p className="text-sm text-muted-foreground">
                    Exibindo: {format(effectiveDateRange.from, "dd/MM/yyyy")} - {format(effectiveDateRange.to, "dd/MM/yyyy")}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Itens</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">No catálogo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <FolderTree className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">{stats.totalFamilies} famílias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Itens Ativos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeItems}</div>
                <p className="text-xs text-muted-foreground">Disponíveis</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Equipamentos</CardTitle>
                <TrendingUp className="h-4 w-4 text-lm-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.equipmentCount}</div>
                <p className="text-xs text-muted-foreground">Para locação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Consumíveis</CardTitle>
                <Package className="h-4 w-4 text-lm-terrac" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.consumableCount}</div>
                <p className="text-xs text-muted-foreground">Acessórios</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Items by Category */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Itens por Categoria</CardTitle>
                <CardDescription>Distribuição de itens por categoria</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={stats.itemsByCategory}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={200}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" fill="#DB5A34" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Items by Month - Temporal Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Evolução de Cadastros</CardTitle>
                <CardDescription>Itens cadastrados nos últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.itemsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#DB5A34" 
                      strokeWidth={2}
                      dot={{ fill: '#DB5A34', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#B94935' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Items by Type */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tipo de Item</CardTitle>
                <CardDescription>Equipamentos vs Consumíveis</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.itemsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3E2229" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top 10 Families */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Top 10 Famílias</CardTitle>
                <CardDescription>Famílias com mais itens cadastrados</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.itemsByFamily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#B94935" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
