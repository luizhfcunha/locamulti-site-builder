import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, FolderTree, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  PieChart,
  Pie,
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
  Cell,
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
  const navigate = useNavigate();
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }
    
    await fetchDashboardData();
  };

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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/produtos")}
            className="gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Produtos
          </Button>
          
          <h1 className="font-heading text-3xl text-lm-plum">
            Dashboard de Produtos
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lm-orange">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <FolderTree className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lm-plum">{stats.totalCategories}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Ativos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Inativos</CardTitle>
              <XCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.inactiveProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lm-terrac">{stats.productsThisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products by Category - Pie Chart */}
          {stats.productsByCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Produtos por Categoria</CardTitle>
                <CardDescription>Distribuição de produtos entre categorias</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.productsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.productsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Products by Month - Line Chart */}
          {stats.productsByMonth.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Produtos Cadastrados por Mês</CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats.productsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#DB5A34"
                      strokeWidth={2}
                      name="Produtos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Products by Subcategory - Bar Chart */}
          {stats.productsBySubcategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Subcategorias</CardTitle>
                <CardDescription>Produtos por subcategoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.productsBySubcategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#B94935" name="Produtos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Products by Brand - Bar Chart */}
          {stats.productsByBrand.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Marcas</CardTitle>
                <CardDescription>Produtos por marca</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.productsByBrand}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3E2229" name="Produtos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
