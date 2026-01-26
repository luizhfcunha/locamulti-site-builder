-- Migration: Sincronizar primary image de equipment_images com catalog_items.image_url
-- Created: 2026-01-26
-- Description: Trigger automático que atualiza catalog_items.image_url quando a primary image muda

-- Função que sincroniza primary image com catalog_items.image_url
CREATE OR REPLACE FUNCTION sync_primary_image_to_catalog()
RETURNS TRIGGER AS $$
BEGIN
  -- Se uma imagem foi marcada como primary (INSERT ou UPDATE)
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_primary = true THEN
    -- Atualizar catalog_items.image_url com a public_url da nova primary image
    UPDATE catalog_items
    SET image_url = NEW.public_url,
        updated_at = NOW()
    WHERE id = NEW.equipment_id;

  -- Se uma imagem primary foi deletada
  ELSIF TG_OP = 'DELETE' AND OLD.is_primary = true THEN
    -- Buscar próxima imagem disponível (menor sort_order) para ser a nova primary
    UPDATE catalog_items
    SET image_url = (
      SELECT public_url
      FROM equipment_images
      WHERE equipment_id = OLD.equipment_id
      ORDER BY sort_order ASC
      LIMIT 1
    ),
    updated_at = NOW()
    WHERE id = OLD.equipment_id;
  END IF;

  -- Return appropriate value based on operation
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger que executa após INSERT, UPDATE ou DELETE em equipment_images
DROP TRIGGER IF EXISTS sync_primary_image_trigger ON equipment_images;

CREATE TRIGGER sync_primary_image_trigger
AFTER INSERT OR UPDATE OR DELETE ON equipment_images
FOR EACH ROW
EXECUTE FUNCTION sync_primary_image_to_catalog();

-- Comentário explicativo
COMMENT ON FUNCTION sync_primary_image_to_catalog() IS
'Automaticamente sincroniza a primary image de equipment_images com catalog_items.image_url';
