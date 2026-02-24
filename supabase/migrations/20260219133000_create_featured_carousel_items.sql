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

CREATE POLICY "Public read active featured carousel items"
ON public.featured_carousel_items
FOR SELECT
USING (active = true);

CREATE POLICY "Allow admins read all featured carousel items"
ON public.featured_carousel_items
FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins insert featured carousel items"
ON public.featured_carousel_items
FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins update featured carousel items"
ON public.featured_carousel_items
FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins delete featured carousel items"
ON public.featured_carousel_items
FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS update_featured_carousel_items_updated_at ON public.featured_carousel_items;
CREATE TRIGGER update_featured_carousel_items_updated_at
BEFORE UPDATE ON public.featured_carousel_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
