import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProductAnalytics {
  product_id: string;
  product_name: string;
  supplier_code: string;
  image_url: string;
  category_name: string;
  total_views: number;
  total_conversions: number;
  conversion_rate: number;
  last_activity: string;
}

interface DailyStats {
  date: string;
  views: number;
  conversions: number;
  conversion_rate: number;
}

export const AnalyticsDashboard = () => {
  const [topProducts, setTopProducts] = useState<ProductAnalytics[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [avgConversionRate, setAvgConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshMaterializedView();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar produtos mais visualizados
      const { data: productsData, error: productsError } = await supabase
        .from('product_analytics_summary')
        .select('*')
        .order('total_views', { ascending: false })
        .limit(10);

      if (productsError) throw productsError;
      setTopProducts(productsData || []);

      // Calcular totais
      const views = (productsData || []).reduce((sum, p) => sum + p.total_views, 0);
      const conversions = (productsData || []).reduce((sum, p) => sum + p.total_conversions, 0);
      setTotalViews(views);
      setTotalConversions(conversions);
      setAvgConversionRate(views > 0 ? (conversions / views) * 100 : 0);

      // Buscar estatísticas diárias dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (eventsError) throw eventsError;

      // Agrupar por dia
      const dailyMap = new Map<string, { views: number; conversions: number }>();

      (eventsData || []).forEach(event => {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        const current = dailyMap.get(date) || { views: 0, conversions: 0 };

        if (event.event_type === 'product_view') {
          current.views++;
        } else if (event.event_type === 'whatsapp_click') {
          current.conversions++;
        }

        dailyMap.set(date, current);
      });

      const dailyArray: DailyStats[] = Array.from(dailyMap.entries())
        .map(([date, stats]) => ({
          date,
          views: stats.views,
          conversions: stats.conversions,
          conversion_rate: stats.views > 0 ? (stats.conversions / stats.views) * 100 : 0
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setDailyStats(dailyArray);

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshMaterializedView = async () => {
    try {
      setLoading(true);
      await supabase.rpc('refresh_product_analytics_summary');
      await fetchAnalytics();
    } catch (error) {
      console.error('Error refreshing analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={refreshMaterializedView}
          className="text-sm text-primary hover:underline flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          Atualizar Dados
        </button>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Visualizações de produtos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversões (WhatsApp)</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Cliques no WhatsApp</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgConversionRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Visualizações → WhatsApp</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs com gráficos e tabelas */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Produtos Mais Visualizados</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Top 10 Produtos por Visualizações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Visualizações</TableHead>
                    <TableHead className="text-right">Conversões</TableHead>
                    <TableHead className="text-right">Taxa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell>
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.product_name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded" />
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.product_name}</div>
                        {product.supplier_code && (
                          <div className="text-xs text-muted-foreground">
                            Cód: {product.supplier_code}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.category_name || '-'}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {product.total_views}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {product.total_conversions}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={product.conversion_rate > 10 ? "default" : "secondary"}
                          className={product.conversion_rate > 10 ? "bg-green-600" : ""}
                        >
                          {product.conversion_rate.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Visualizações e Conversões (Últimos 30 Dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#DB5A34"
                    name="Visualizações"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    name="Conversões"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Taxa de Conversão Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                  <Bar
                    dataKey="conversion_rate"
                    fill="#3E2229"
                    name="Taxa de Conversão (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
