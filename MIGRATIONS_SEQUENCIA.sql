-- ============================================================================
-- MIGRATIONS STAB - REFATORAÇÃO ESTRUTURA CATÁLOGO
-- Execute em sequência no Supabase SQL Editor
-- Tempo total estimado: ~20-30 segundos
-- ============================================================================

-- ============================================================================
-- MIGRATION 1 de 5: Fix RLS Policy
-- Arquivo: 20260219120000_fix_catalog_items_admin_select_policy.sql
-- Tempo estimado: ~1 segundo
-- Risco: BAIXO
-- ============================================================================

-- Fix: permitir SELECT de admins em catalog_items mesmo quando active = false
-- Motivo: updates que inativam item podem falhar sem policy de leitura administrativa.

DROP POLICY IF EXISTS "Allow admins read all catalog_items" ON public.catalog_items;

CREATE POLICY "Allow admins read all catalog_items"
ON public.catalog_items
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ✅ Migration 1 concluída


-- ============================================================================
-- MIGRATION 2 de 5: Featured Carousel Items
-- Arquivo: 20260219133000_create_featured_carousel_items.sql
-- Tempo estimado: ~2 segundos
-- Risco: BAIXO
-- ============================================================================

-- Tabela para configuracao manual do carrossel de equipamentos da home
CREATE TABLE IF NOT EXISTS public.featured_carousel_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_item_id UUID NOT NULL REFERENCES public.catalog_items(id) ON DELETE CASCADE,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (catalog_item_id)
);

CREATE INDEX IF NOT EXISTS idx_featured_carousel_items_order
ON public.featured_carousel_items(display_order);

ALTER TABLE public.featured_carousel_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active featured carousel items" ON public.featured_carousel_items;
CREATE POLICY "Public read active featured carousel items"
ON public.featured_carousel_items
FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Allow admins read all featured carousel items" ON public.featured_carousel_items;
CREATE POLICY "Allow admins read all featured carousel items"
ON public.featured_carousel_items
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins insert featured carousel items" ON public.featured_carousel_items;
CREATE POLICY "Allow admins insert featured carousel items"
ON public.featured_carousel_items
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins update featured carousel items" ON public.featured_carousel_items;
CREATE POLICY "Allow admins update featured carousel items"
ON public.featured_carousel_items
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins delete featured carousel items" ON public.featured_carousel_items;
CREATE POLICY "Allow admins delete featured carousel items"
ON public.featured_carousel_items
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_featured_carousel_items_updated_at ON public.featured_carousel_items;
CREATE TRIGGER update_featured_carousel_items_updated_at
BEFORE UPDATE ON public.featured_carousel_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ✅ Migration 2 concluída


-- ============================================================================
-- MIGRATION 3 de 5: Reindexação Automática
-- Arquivo: 20260219184000_reindex_catalog_orders_after_mutations.sql
-- Tempo estimado: ~5-10 segundos
-- Risco: MÉDIO (lock leve durante normalização inicial)
-- ATENÇÃO: Esta migration executa normalização imediata na última linha
-- ============================================================================

-- Garantir sequencia continua de ordenacao no catalogo apos inserir/editar/excluir.
-- Reindexa:
-- - category_order (entre categorias)
-- - family_order (dentro da categoria)
-- - item_order (dentro da familia)

CREATE OR REPLACE FUNCTION public.reindex_catalog_orders()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1) Reindexar ordem de categorias (sem alterar category_no)
  WITH categories AS (
    SELECT
      category_slug,
      DENSE_RANK() OVER (
        ORDER BY
          MIN(category_order),
          MIN(category_no),
          category_slug
      ) AS new_category_order
    FROM public.catalog_items
    GROUP BY category_slug
  )
  UPDATE public.catalog_items ci
  SET category_order = c.new_category_order
  FROM categories c
  WHERE ci.category_slug = c.category_slug
    AND ci.category_order IS DISTINCT FROM c.new_category_order;

  -- 2) Reindexar ordem de familias dentro da categoria (sem alterar family_no)
  WITH families AS (
    SELECT
      category_slug,
      family_slug,
      DENSE_RANK() OVER (
        PARTITION BY category_slug
        ORDER BY
          MIN(family_order),
          MIN(family_no),
          family_slug
      ) AS new_family_order
    FROM public.catalog_items
    GROUP BY category_slug, family_slug
  )
  UPDATE public.catalog_items ci
  SET family_order = f.new_family_order
  FROM families f
  WHERE ci.category_slug = f.category_slug
    AND ci.family_slug = f.family_slug
    AND ci.family_order IS DISTINCT FROM f.new_family_order;

  -- 3) Reindexar ordem de itens dentro da familia
  WITH items AS (
    SELECT
      id,
      ROW_NUMBER() OVER (
        PARTITION BY category_slug, family_slug
        ORDER BY
          item_order,
          code,
          id
      ) AS new_item_order
    FROM public.catalog_items
  )
  UPDATE public.catalog_items ci
  SET item_order = i.new_item_order
  FROM items i
  WHERE ci.id = i.id
    AND ci.item_order IS DISTINCT FROM i.new_item_order;
END;
$$;

CREATE OR REPLACE FUNCTION public.reindex_catalog_orders_trigger()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Evita recursao quando a propria reindexacao dispara UPDATE.
  IF pg_trigger_depth() > 1 THEN
    RETURN NULL;
  END IF;

  PERFORM public.reindex_catalog_orders();
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_reindex_catalog_orders ON public.catalog_items;

CREATE TRIGGER trg_reindex_catalog_orders
AFTER INSERT OR UPDATE OR DELETE ON public.catalog_items
FOR EACH STATEMENT
EXECUTE FUNCTION public.reindex_catalog_orders_trigger();

-- ⚠️ ATENÇÃO: Normaliza estado atual imediatamente ao aplicar migration.
-- Esta linha pode demorar 5-10 segundos dependendo do volume de dados.
SELECT public.reindex_catalog_orders();

-- ✅ Migration 3 concluída


-- ============================================================================
-- MIGRATION 4 de 5: Tabelas Mestres (Categorias e Famílias)
-- Arquivo: 20260219190000_create_catalog_master_tables.sql
-- Tempo estimado: ~10-15 segundos
-- Risco: MÉDIO-ALTO (lock crítico ao adicionar Foreign Keys)
-- ATENÇÃO: Esta é a migration CRÍTICA - causa lock temporário em catalog_items
-- Durante lock: catálogo público FUNCIONA, admin NÃO pode criar/editar itens
-- ============================================================================

-- STAB-011
-- Modelo mestre de categorias e familias para o catalogo.
-- Objetivo: manter fonte unica de estrutura e garantir integridade referencial
-- de category_slug/family_slug usados em catalog_items.

-- Dropar tabelas existentes para garantir recriação limpa
DROP TABLE IF EXISTS public.catalog_families CASCADE;
DROP TABLE IF EXISTS public.catalog_categories CASCADE;

CREATE TABLE public.catalog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_no INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_no),
  UNIQUE (display_order)
);

CREATE TABLE public.catalog_families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT NOT NULL REFERENCES public.catalog_categories(slug) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  family_no TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_slug, slug),
  UNIQUE (category_slug, family_no),
  UNIQUE (category_slug, display_order)
);

CREATE INDEX idx_catalog_categories_order
ON public.catalog_categories(display_order);

CREATE INDEX idx_catalog_families_category_order
ON public.catalog_families(category_slug, display_order);

-- Backfill inicial a partir de catalog_items.

INSERT INTO public.catalog_categories (slug, name, category_no, display_order, active)
SELECT
  ci.category_slug,
  MIN(ci.category_name) AS name,
  MIN(ci.category_no) AS category_no,
  MIN(ci.category_order) AS display_order,
  BOOL_OR(COALESCE(ci.active, true)) AS active
FROM public.catalog_items ci
GROUP BY ci.category_slug
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  category_no = EXCLUDED.category_no,
  display_order = EXCLUDED.display_order,
  active = EXCLUDED.active,
  updated_at = now();

INSERT INTO public.catalog_families (category_slug, slug, name, family_no, display_order, active)
SELECT
  ci.category_slug,
  ci.family_slug,
  MIN(ci.family_name) AS name,
  MIN(ci.family_no) AS family_no,
  MIN(ci.family_order) AS display_order,
  BOOL_OR(COALESCE(ci.active, true)) AS active
FROM public.catalog_items ci
GROUP BY ci.category_slug, ci.family_slug
ON CONFLICT (category_slug, slug) DO UPDATE
SET
  name = EXCLUDED.name,
  family_no = EXCLUDED.family_no,
  display_order = EXCLUDED.display_order,
  active = EXCLUDED.active,
  updated_at = now();

-- ⚠️ SEÇÃO CRÍTICA: Adicionar Foreign Keys
-- As linhas abaixo causam lock temporário (~10-15s) em catalog_items
-- Durante este período: catálogo público continua funcionando (apenas leitura)
-- Admin NÃO consegue criar/editar itens temporariamente

-- Integridade referencial de catalog_items com a estrutura mestre.
ALTER TABLE public.catalog_items
DROP CONSTRAINT IF EXISTS fk_catalog_items_category_slug;

ALTER TABLE public.catalog_items
ADD CONSTRAINT fk_catalog_items_category_slug
FOREIGN KEY (category_slug)
REFERENCES public.catalog_categories(slug)
ON UPDATE CASCADE
ON DELETE RESTRICT;

ALTER TABLE public.catalog_items
DROP CONSTRAINT IF EXISTS fk_catalog_items_family;

ALTER TABLE public.catalog_items
ADD CONSTRAINT fk_catalog_items_family
FOREIGN KEY (category_slug, family_slug)
REFERENCES public.catalog_families(category_slug, slug)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- Fim da seção crítica de lock

ALTER TABLE public.catalog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_families ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active catalog_categories" ON public.catalog_categories;
CREATE POLICY "Public read active catalog_categories"
ON public.catalog_categories
FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Allow admins read all catalog_categories" ON public.catalog_categories;
CREATE POLICY "Allow admins read all catalog_categories"
ON public.catalog_categories
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins insert catalog_categories" ON public.catalog_categories;
CREATE POLICY "Allow admins insert catalog_categories"
ON public.catalog_categories
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins update catalog_categories" ON public.catalog_categories;
CREATE POLICY "Allow admins update catalog_categories"
ON public.catalog_categories
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins delete catalog_categories" ON public.catalog_categories;
CREATE POLICY "Allow admins delete catalog_categories"
ON public.catalog_categories
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Public read active catalog_families" ON public.catalog_families;
CREATE POLICY "Public read active catalog_families"
ON public.catalog_families
FOR SELECT
USING (active = true);

DROP POLICY IF EXISTS "Allow admins read all catalog_families" ON public.catalog_families;
CREATE POLICY "Allow admins read all catalog_families"
ON public.catalog_families
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins insert catalog_families" ON public.catalog_families;
CREATE POLICY "Allow admins insert catalog_families"
ON public.catalog_families
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins update catalog_families" ON public.catalog_families;
CREATE POLICY "Allow admins update catalog_families"
ON public.catalog_families
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Allow admins delete catalog_families" ON public.catalog_families;
CREATE POLICY "Allow admins delete catalog_families"
ON public.catalog_families
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_catalog_categories_updated_at ON public.catalog_categories;
CREATE TRIGGER update_catalog_categories_updated_at
BEFORE UPDATE ON public.catalog_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_catalog_families_updated_at ON public.catalog_families;
CREATE TRIGGER update_catalog_families_updated_at
BEFORE UPDATE ON public.catalog_families
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ✅ Migration 4 concluída (CRÍTICA)


-- ============================================================================
-- MIGRATION 5 de 5: Código Automático
-- Arquivo: 20260219194000_auto_generate_catalog_item_code.sql
-- Tempo estimado: ~1 segundo
-- Risco: BAIXO
-- ============================================================================

-- STAB-014
-- Geracao automatica de codigo no insert de catalog_items.
-- Formato: CC.FF.III

CREATE OR REPLACE FUNCTION public.generate_catalog_item_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_item_no INTEGER;
  category_part TEXT;
  family_digits TEXT;
  family_part TEXT;
  candidate_code TEXT;
BEGIN
  IF NEW.code IS NOT NULL AND btrim(NEW.code) <> '' THEN
    RETURN NEW;
  END IF;

  -- Evita colisao em criacoes concorrentes da mesma categoria/familia.
  PERFORM pg_advisory_xact_lock(hashtext(COALESCE(NEW.category_slug, '') || ':' || COALESCE(NEW.family_slug, '')));

  IF NEW.item_order IS NULL OR NEW.item_order <= 0 THEN
    SELECT COALESCE(MAX(ci.item_order), 0) + 1
      INTO next_item_no
    FROM public.catalog_items ci
    WHERE ci.category_slug = NEW.category_slug
      AND ci.family_slug = NEW.family_slug;

    NEW.item_order := next_item_no;
  END IF;

  category_part := LPAD(COALESCE(NEW.category_no, 0)::TEXT, 2, '0');
  family_digits := regexp_replace(COALESCE(NEW.family_no, ''), '[^0-9]', '', 'g');
  family_part := LPAD(COALESCE(NULLIF(family_digits, ''), '0'), 2, '0');

  candidate_code := category_part || '.' || family_part || '.' || LPAD(NEW.item_order::TEXT, 3, '0');

  WHILE EXISTS (
    SELECT 1
    FROM public.catalog_items ci
    WHERE ci.code = candidate_code
  ) LOOP
    NEW.item_order := NEW.item_order + 1;
    candidate_code := category_part || '.' || family_part || '.' || LPAD(NEW.item_order::TEXT, 3, '0');
  END LOOP;

  NEW.code := candidate_code;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_catalog_item_code ON public.catalog_items;

CREATE TRIGGER trg_generate_catalog_item_code
BEFORE INSERT ON public.catalog_items
FOR EACH ROW
EXECUTE FUNCTION public.generate_catalog_item_code();

-- ✅ Migration 5 concluída


-- ============================================================================
-- 🎉 TODAS AS 5 MIGRATIONS CONCLUÍDAS COM SUCESSO!
-- ============================================================================
--
-- Próximos passos:
-- 1. ✅ Verificar se há erros no console do Supabase
-- 2. ✅ Testar catálogo público (deve continuar funcionando normalmente)
-- 3. ✅ Aguardar deploy do frontend (Lovable.dev deploy automático)
-- 4. ✅ Validar admin após deploy do frontend
--
-- Tempo total decorrido: ~20-30 segundos
-- Lock temporário: ~10-15 segundos (Migration 4)
-- Site offline: ❌ NUNCA (0 segundos de downtime)
--
-- ============================================================================
