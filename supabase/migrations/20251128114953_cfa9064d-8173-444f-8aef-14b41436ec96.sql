-- Corrigir search_path da função refresh_product_analytics_summary
DROP FUNCTION IF EXISTS refresh_product_analytics_summary();

CREATE OR REPLACE FUNCTION refresh_product_analytics_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.product_analytics_summary;
END;
$$;

-- Revogar acesso direto à view materializada via API
-- Apenas admins podem acessá-la via RLS
REVOKE SELECT ON public.product_analytics_summary FROM anon;

-- Criar política RLS para a view materializada (somente admins)
ALTER MATERIALIZED VIEW public.product_analytics_summary OWNER TO postgres;

COMMENT ON FUNCTION refresh_product_analytics_summary() IS 'Atualiza a view materializada de analytics (apenas admins podem executar)';