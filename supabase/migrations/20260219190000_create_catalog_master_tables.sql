-- STAB-011
-- Modelo mestre de categorias e familias para o catalogo.
-- Objetivo: manter fonte unica de estrutura e garantir integridade referencial
-- de category_slug/family_slug usados em catalog_items.

CREATE TABLE IF NOT EXISTS public.catalog_categories (
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

CREATE TABLE IF NOT EXISTS public.catalog_families (
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

CREATE INDEX IF NOT EXISTS idx_catalog_categories_order
ON public.catalog_categories(display_order);

CREATE INDEX IF NOT EXISTS idx_catalog_families_category_order
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

