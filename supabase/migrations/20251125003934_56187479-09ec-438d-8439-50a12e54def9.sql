-- Create products table with proper foreign key relationships
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  supplier_code TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
  image_url TEXT,
  price DECIMAL(10, 2),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (active = true);
CREATE POLICY "Allow authenticated insert to products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update to products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete from products" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_subcategory_id ON public.products(subcategory_id);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_products_name ON public.products(name);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read access for product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Migrate existing data from catalog table
INSERT INTO public.products (id, name, description, brand, supplier_code, category_id, subcategory_id, image_url, created_at)
SELECT c.id, c.name, c.description, c.brand, c.supplier_code, cat.id, sub.id, c.image_url, c.created_at
FROM public.catalog c
LEFT JOIN public.categories cat ON UPPER(TRIM(c.category)) = UPPER(TRIM(cat.name))
LEFT JOIN public.subcategories sub ON UPPER(TRIM(c.subcategory)) = UPPER(TRIM(sub.name)) AND sub.category_id = cat.id
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.id = c.id);