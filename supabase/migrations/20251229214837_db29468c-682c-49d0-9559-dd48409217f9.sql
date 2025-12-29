-- Nova tabela catalog_items para o catálogo reestruturado
CREATE TABLE public.catalog_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_order INTEGER NOT NULL,
  category_no INTEGER NOT NULL,
  category_name TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  family_order INTEGER NOT NULL,
  family_no TEXT NOT NULL,
  family_name TEXT NOT NULL,
  family_slug TEXT NOT NULL,
  item_order INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  item_type TEXT NOT NULL CHECK (item_type IN ('equipamento', 'consumivel')),
  description TEXT NOT NULL,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes para performance nas consultas do catálogo
CREATE INDEX idx_catalog_items_category ON public.catalog_items(category_no, category_order);
CREATE INDEX idx_catalog_items_family ON public.catalog_items(family_no, family_order);
CREATE INDEX idx_catalog_items_item_order ON public.catalog_items(item_order);
CREATE INDEX idx_catalog_items_code ON public.catalog_items(code);
CREATE INDEX idx_catalog_items_item_type ON public.catalog_items(item_type);
CREATE INDEX idx_catalog_items_category_slug ON public.catalog_items(category_slug);
CREATE INDEX idx_catalog_items_family_slug ON public.catalog_items(family_slug);

-- Enable RLS
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to catalog_items" 
ON public.catalog_items 
FOR SELECT 
USING (active = true);

CREATE POLICY "Allow admins insert to catalog_items" 
ON public.catalog_items 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins update to catalog_items" 
ON public.catalog_items 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Allow admins delete from catalog_items" 
ON public.catalog_items 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_catalog_items_updated_at
BEFORE UPDATE ON public.catalog_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();