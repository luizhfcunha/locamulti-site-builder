-- Remover tabelas obsoletas (ordem correta para respeitar foreign keys)
-- Primeiro remover a view materializada que referencia products
DROP MATERIALIZED VIEW IF EXISTS public.product_analytics_summary CASCADE;

-- Remover função que atualiza a view
DROP FUNCTION IF EXISTS public.refresh_product_analytics_summary() CASCADE;

-- Agora remover as tabelas
DROP TABLE IF EXISTS public.catalog CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.subfamilies CASCADE;
DROP TABLE IF EXISTS public.families CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;