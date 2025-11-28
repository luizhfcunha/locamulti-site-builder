-- Criar tabela para rastrear eventos de analytics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'product_view', 'whatsapp_click', 'catalog_visit'
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance de queries analíticas
CREATE INDEX idx_analytics_events_event_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_product_id ON public.analytics_events(product_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);

-- RLS Policies para analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Permitir inserção pública (para tracking anônimo)
CREATE POLICY "Allow public insert to analytics_events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Apenas admins podem ler os dados de analytics
CREATE POLICY "Allow admins read analytics_events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- View materializada para otimizar consultas de produtos mais visualizados
CREATE MATERIALIZED VIEW IF NOT EXISTS public.product_analytics_summary AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.supplier_code,
  p.image_url,
  c.name as category_name,
  COUNT(CASE WHEN ae.event_type = 'product_view' THEN 1 END) as total_views,
  COUNT(CASE WHEN ae.event_type = 'whatsapp_click' THEN 1 END) as total_conversions,
  CASE 
    WHEN COUNT(CASE WHEN ae.event_type = 'product_view' THEN 1 END) > 0 
    THEN ROUND((COUNT(CASE WHEN ae.event_type = 'whatsapp_click' THEN 1 END)::numeric / 
                COUNT(CASE WHEN ae.event_type = 'product_view' THEN 1 END)::numeric) * 100, 2)
    ELSE 0
  END as conversion_rate,
  MAX(ae.created_at) as last_activity
FROM public.products p
LEFT JOIN public.analytics_events ae ON p.id = ae.product_id
LEFT JOIN public.categories c ON p.category_id = c.id
WHERE p.active = true
GROUP BY p.id, p.name, p.supplier_code, p.image_url, c.name;

-- Índice na view materializada
CREATE UNIQUE INDEX idx_product_analytics_summary_product_id 
  ON public.product_analytics_summary(product_id);

-- Função para atualizar a view materializada
CREATE OR REPLACE FUNCTION refresh_product_analytics_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.product_analytics_summary;
END;
$$;

-- Grant para a view materializada
GRANT SELECT ON public.product_analytics_summary TO authenticated;

COMMENT ON TABLE public.analytics_events IS 'Tabela para rastreamento de eventos de analytics (visualizações, conversões, etc)';
COMMENT ON MATERIALIZED VIEW public.product_analytics_summary IS 'View materializada com resumo de analytics por produto';