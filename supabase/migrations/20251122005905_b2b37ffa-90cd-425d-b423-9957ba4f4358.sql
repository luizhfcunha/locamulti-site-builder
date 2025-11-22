-- Create public storage bucket for brand assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
);

-- Allow public read access to brand assets
CREATE POLICY "Public read access for brand assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-assets');

-- Allow authenticated users to upload brand assets (for admin purposes)
CREATE POLICY "Authenticated users can upload brand assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-assets' 
  AND auth.role() = 'authenticated'
);