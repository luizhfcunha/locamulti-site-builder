-- Adicionar coluna 'name' para o nome do equipamento
ALTER TABLE catalog_items 
ADD COLUMN name TEXT;

-- Popular a coluna 'name' extraindo do description (antes do primeiro " - ")
UPDATE catalog_items 
SET name = SPLIT_PART(description, ' - ', 1)
WHERE name IS NULL;

-- Tornar a coluna obrigatória após popular
ALTER TABLE catalog_items 
ALTER COLUMN name SET NOT NULL;