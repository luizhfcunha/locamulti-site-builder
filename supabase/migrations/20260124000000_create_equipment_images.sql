-- =====================================================
-- Migration: Create equipment_images table
-- Description: Adiciona suporte para múltiplas imagens por equipamento
-- Date: 2026-01-24
-- =====================================================

-- 1) Criar tabela equipment_images
CREATE TABLE public.equipment_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES public.catalog_items(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  width INTEGER,
  height INTEGER,
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2) Índices para performance
CREATE INDEX idx_equipment_images_equipment_id ON public.equipment_images(equipment_id);
CREATE INDEX idx_equipment_images_sort_order ON public.equipment_images(equipment_id, sort_order);
CREATE INDEX idx_equipment_images_is_primary ON public.equipment_images(equipment_id, is_primary) WHERE is_primary = true;

-- 3) Constraint: apenas UMA imagem primary por equipamento
CREATE UNIQUE INDEX idx_equipment_images_unique_primary ON public.equipment_images(equipment_id) WHERE is_primary = true;

-- 4) Enable RLS
ALTER TABLE public.equipment_images ENABLE ROW LEVEL SECURITY;

-- 5) RLS Policies (herda lógica de catalog_items)
-- Leitura pública (apenas de equipamentos ativos)
CREATE POLICY "Allow public read equipment_images"
ON public.equipment_images
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.catalog_items
    WHERE catalog_items.id = equipment_images.equipment_id
    AND catalog_items.active = true
  )
);

-- Admins podem inserir
CREATE POLICY "Allow admins insert equipment_images"
ON public.equipment_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar
CREATE POLICY "Allow admins update equipment_images"
ON public.equipment_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar
CREATE POLICY "Allow admins delete equipment_images"
ON public.equipment_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6) Trigger para atualizar updated_at
CREATE TRIGGER update_equipment_images_updated_at
BEFORE UPDATE ON public.equipment_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 7) MIGRAÇÃO DE DADOS LEGADOS
-- Preservar image_url existente como primeira imagem (is_primary = true)
INSERT INTO public.equipment_images (equipment_id, storage_path, public_url, is_primary, sort_order, alt_text)
SELECT
  id AS equipment_id,
  -- Extrair path do URL (assumindo padrão atual)
  SUBSTRING(image_url FROM 'product-images/(.*)') AS storage_path,
  image_url AS public_url,
  true AS is_primary,
  0 AS sort_order,
  name || ' - ' || description AS alt_text
FROM public.catalog_items
WHERE image_url IS NOT NULL
  AND image_url != '';

-- 8) Comentários para documentação
COMMENT ON TABLE public.equipment_images IS 'Galeria de imagens para equipamentos do catálogo (relacionamento 1:N com catalog_items)';
COMMENT ON COLUMN public.equipment_images.is_primary IS 'Apenas UMA imagem pode ser primária por equipamento (exibida nos cards)';
COMMENT ON COLUMN public.equipment_images.sort_order IS 'Ordem de exibição no carrossel (0 = primeira)';
COMMENT ON COLUMN public.equipment_images.storage_path IS 'Caminho no Supabase Storage (ex: equipment/01.01.001/primary-123.jpg)';
COMMENT ON COLUMN public.equipment_images.public_url IS 'URL pública completa da imagem';
