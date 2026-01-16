import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, FolderTree, CheckCircle, XCircle, Calendar, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
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
}

const COLORS = ["#DB5A34", "#B94935", "#3E2229", "#373435", "#F6F3F2", "#DB5A3480", "#B9493580"];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data from catalog_items in parallel
      const [
        { data: allItems, count: totalItems },
        { count: activeItems },
        { count: inactiveItems },
        { count: equipmentCount },
        { count: consumableCount },
      ] = await Promise.all([
        supabase.from("catalog_items").select("*", { count: "exact" }),
        supabase.from("catalog_items").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("catalog_items").select("*", { count: "exact", head: true }).eq("active", false),
        supabase.from("catalog_items").select("*", { count: "exact", head: true }).eq("item_type", "equipamento"),
        supabase.from("catalog_items").select("*", { count: "exact", head: true }).eq("item_type", "consumivel"),
      ]);

      // Calculate unique categories and families from items
      const uniqueCategories = new Set((allItems || []).map(item => item.category_slug));
      const uniqueFamilies = new Set((allItems || []).map(item => item.family_slug));

      // Items by category
      const categoryMap = new Map<string, number>();
      (allItems || []).forEach((item) => {
        const name = item.category_name;
        categoryMap.set(name, (categoryMap.get(name) || 0) + 1);
      });
      const itemsByCategory = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Items by family (top 10)
      const familyMap = new Map<string, number>();
      (allItems || []).forEach((item) => {
        const name = item.family_name;
        familyMap.set(name, (familyMap.get(name) || 0) + 1);
      });
      const itemsByFamily = Array.from(familyMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Items by type
      const itemsByType = [
        { name: "Equipamentos", count: equipmentCount || 0 },
        { name: "Consumíveis", count: consumableCount || 0 },
      ];

      setStats({
        totalItems: totalItems || 0,
        totalCategories: uniqueCategories.size,
        totalFamilies: uniqueFamilies.size,
        activeItems: activeItems || 0,
        inactiveItems: inactiveItems || 0,
        equipmentCount: equipmentCount || 0,
        consumableCount: consumableCount || 0,
        itemsByCategory,
        itemsByFamily,
        itemsByType,
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
