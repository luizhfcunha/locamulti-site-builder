import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MessageCircle, TrendingUp, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DailyStats {
  date: string;
  views: number;
  conversions: number;
  conversion_rate: number;
}

export const AnalyticsDashboard = () => {
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  const [avgConversionRate, setAvgConversionRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Buscar estatísticas dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('event_type, created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (eventsError) throw eventsError;

      // Agrupar por dia
      const dailyMap = new Map<string, { views: number; conversions: number }>();
      let totalViewsCount = 0;
      let totalConversionsCount = 0;

      (eventsData || []).forEach(event => {
        const date = new Date(event.created_at!).toISOString().split('T')[0];
        const current = dailyMap.get(date) || { views: 0, conversions: 0 };

        if (event.event_type === 'product_view') {
          current.views++;
          totalViewsCount++;
        } else if (event.event_type === 'whatsapp_click') {
          current.conversions++;
          totalConversionsCount++;
        }

        dailyMap.set(date, current);
      });

      setTotalViews(totalViewsCount);
      setTotalConversions(totalConversionsCount);
      setAvgConversionRate(totalViewsCount > 0 ? (totalConversionsCount / totalViewsCount) * 100 : 0);

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
          onClick={fetchAnalytics}
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
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
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

      {/* Tabs com gráficos */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

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
