import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, CheckCircle, XCircle, Calendar } from "lucide-react";
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

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  activeProducts: number;
  inactiveProducts: number;
  productsThisMonth: number;
  productsByCategory: { name: string; count: number }[];
  productsBySubcategory: { name: string; count: number }[];
  productsByBrand: { name: string; count: number }[];
  productsByMonth: { month: string; count: number }[];
}

const COLORS = ["#DB5A34", "#B94935", "#3E2229", "#373435", "#F6F3F2", "#DB5A3480", "#B9493580"];

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    productsThisMonth: 0,
    productsByCategory: [],
    productsBySubcategory: [],
    productsByBrand: [],
    productsByMonth: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        { count: totalProducts },
        { count: totalCategories },
        { count: activeProducts },
        { count: inactiveProducts },
        { data: products },
        { data: categories },
        { data: productsWithData },
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("active", true),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("active", false),
        supabase.from("products").select("created_at"),
        supabase.from("categories").select("id, name"),
        supabase
          .from("products")
          .select("brand, category_id, subcategory_id, categories(name), subcategories(name)"),
      ]);

      // Products this month
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const productsThisMonth = (products || []).filter(
        (p: any) => new Date(p.created_at) >= firstDayOfMonth
      ).length;

      // Products by category
      const categoryMap = new Map<string, number>();
      (productsWithData || []).forEach((p: any) => {
        if (p.categories?.name) {
          categoryMap.set(p.categories.name, (categoryMap.get(p.categories.name) || 0) + 1);
        }
      });
      const productsByCategory = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      // Products by subcategory (top 10)
      const subcategoryMap = new Map<string, number>();
      (productsWithData || []).forEach((p: any) => {
        if (p.subcategories?.name) {
          subcategoryMap.set(p.subcategories.name, (subcategoryMap.get(p.subcategories.name) || 0) + 1);
        }
      });
      const productsBySubcategory = Array.from(subcategoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by brand (top 10)
      const brandMap = new Map<string, number>();
      (productsWithData || []).forEach((p: any) => {
        if (p.brand) {
          brandMap.set(p.brand, (brandMap.get(p.brand) || 0) + 1);
        }
      });
      const productsByBrand = Array.from(brandMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Products by month (last 6 months)
      const monthMap = new Map<string, number>();
      const last6Months = [];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        last6Months.push(monthKey);
        monthMap.set(monthKey, 0);
      }

      (products || []).forEach((p: any) => {
        const date = new Date(p.created_at);
        const monthKey = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        if (monthMap.has(monthKey)) {
          monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
        }
      });

      const productsByMonth = last6Months.map((month) => ({
        month,
        count: monthMap.get(month) || 0,
      }));

      setStats({
        totalProducts: totalProducts || 0,
        totalCategories: totalCategories || 0,
        activeProducts: activeProducts || 0,
        inactiveProducts: inactiveProducts || 0,
        productsThisMonth,
        productsByCategory,
        productsBySubcategory,
        productsByBrand,
        productsByMonth,
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
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-lm-plum mb-2">
            Dashboard de Produtos
          </h1>
          <p className="text-lm-ink">Visão geral dos produtos e estatísticas</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Cadastrados no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCategories}</div>
              <p className="text-xs text-muted-foreground">Categorias ativas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">Disponíveis no catálogo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Inativos</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inactiveProducts}</div>
              <p className="text-xs text-muted-foreground">Indisponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos (Mês)</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.productsThisMonth}</div>
              <p className="text-xs text-muted-foreground">Cadastrados este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products by Category */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Produtos por Categoria</CardTitle>
              <CardDescription>Distribuição de produtos por categoria</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.productsByCategory}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={150}
                    tick={{ fontSize: 12 }}
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

          {/* Products by Month */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Evolução de Cadastro</CardTitle>
              <CardDescription>Novos produtos nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.productsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#DB5A34" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Products by Brand */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>Top 10 Marcas</CardTitle>
              <CardDescription>Marcas com mais produtos cadastrados</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.productsByBrand}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3E2229" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
