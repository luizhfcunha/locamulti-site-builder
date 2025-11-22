-- Create catalog table
CREATE TABLE IF NOT EXISTS public.catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  description TEXT,
  brand TEXT,
  supplier_code TEXT,
  category TEXT,
  subcategory TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.catalog ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to catalog"
  ON public.catalog
  FOR SELECT
  USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert to catalog"
  ON public.catalog
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update to catalog"
  ON public.catalog
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete from catalog"
  ON public.catalog
  FOR DELETE
  USING (auth.role() = 'authenticated');