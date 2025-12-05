-- Migration to reconfigure catalog structure
-- Clears existing categories and subcategories and inserts new structure based on mermaid diagram

-- 1. Clear existing data (Subcategories first due to FK constraint)
DELETE FROM subcategories;
DELETE FROM categories;

-- 2. Insert Categories and Subcategories
-- Function to insert category and its subcategories
CREATE OR REPLACE FUNCTION insert_catalog_structure() RETURNS void AS $$
DECLARE
    cat_id uuid;
BEGIN
    -- CATEGORIA 1: ACESSÓRIOS DE MONTAGEM
    INSERT INTO categories (name, slug, display_order) VALUES ('Acessórios de Montagem', 'acessorios-de-montagem', 10) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Andaimes de Painel NR18', 'andaimes-painel-nr18'),
        (cat_id, 'Carros de Transporte', 'carros-transporte'),
        (cat_id, 'Cintos de Segurança', 'cintos-seguranca'),
        (cat_id, 'Escadas Extensíveis', 'escadas-extensiveis'),
        (cat_id, 'Escadas Tesoura', 'escadas-tesoura'),
        (cat_id, 'Extensões Monofásicas', 'extensoes-monofasicas'),
        (cat_id, 'Morças de Bancada', 'morcas-bancada'),
        (cat_id, 'Pistolas de Pintura', 'pistolas-pintura');

    -- CATEGORIA 2: BOMBAS E GERADORES
    INSERT INTO categories (name, slug, display_order) VALUES ('Bombas e Geradores', 'bombas-e-geradores', 20) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Bombas de Mangote', 'bombas-mangote'),
        (cat_id, 'Bombas Submersíveis Elétricas', 'bombas-submersiveis-eletricas'),
        (cat_id, 'Geradores de Energia', 'geradores-energia'),
        (cat_id, 'Motobombas Diesel', 'motobombas-diesel'),
        (cat_id, 'Motores Gasolina', 'motores-gasolina');

    -- CATEGORIA 3: COMPRESSORES DE AR
    INSERT INTO categories (name, slug, display_order) VALUES ('Compressores de Ar', 'compressores-de-ar', 30) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Compressores c/ Reservatório', 'compressores-reservatorio'),
        (cat_id, 'Compressores Ar Direto', 'compressores-ar-direto');

    -- CATEGORIA 4: ELEVAÇÃO E MOVIMENTAÇÃO DE CARGAS
    INSERT INTO categories (name, slug, display_order) VALUES ('Elevação e Movimentação de Cargas', 'elevacao-moveimentacao-cargas', 40) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Acessórios Elevação', 'acessorios-elevacao'),
        (cat_id, 'Bombas Hidráulicas', 'bombas-hidraulicas'),
        (cat_id, 'Carros Alavanca', 'carros-alavanca'),
        (cat_id, 'Carros Trolley', 'carros-trolley'),
        (cat_id, 'Catracas Amarração', 'catracas-amarracao'),
        (cat_id, 'Cavaletes Mecânicos', 'cavaletes-mecanicos'),
        (cat_id, 'Cilindros Hidráulicos', 'cilindros-hidraulicos'),
        (cat_id, 'Cintas Elevação', 'cintas-elevacao'),
        (cat_id, 'Empilhadeiras Manuais', 'empilhadeiras-manuais'),
        (cat_id, 'Guinchos Tirfor', 'guinchos-tirfor'),
        (cat_id, 'Macacos Hidráulicos', 'macacos-hidraulicos'),
        (cat_id, 'Macacos Tipo Unha', 'macacos-tipo-unha'),
        (cat_id, 'Prensas Hidráulicas', 'prensas-hidraulicas'),
        (cat_id, 'Talhas de Corrente', 'talhas-corrente'),
        (cat_id, 'Tartarugas Direcionais', 'tartarugas-direcionais'),
        (cat_id, 'Tartarugas Fixas', 'tartarugas-fixas'),
        (cat_id, 'Transpaletes Manuais', 'transpaletes-manuais');

    -- CATEGORIA 5: EQUIPAMENTOS AGRÍCOLAS
    INSERT INTO categories (name, slug, display_order) VALUES ('Equipamentos Agrícolas', 'equipamentos-agricolas', 50) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Cortadores de Grama', 'cortadores-grama'),
        (cat_id, 'Furadeiras de Mourão', 'furadeiras-mourao'),
        (cat_id, 'Motosserras Gasolina', 'motosserras-gasolina'),
        (cat_id, 'Perfuradores de Solo', 'perfuradores-solo'),
        (cat_id, 'Podadores Cerca Viva', 'podadores-cerca-viva'),
        (cat_id, 'Roçadeiras Lateral', 'rocadeiras-lateral'),
        (cat_id, 'Sopradores de Folha', 'sopradores-folha');

    -- CATEGORIA 6: EQUIPAMENTOS CIVIS
    INSERT INTO categories (name, slug, display_order) VALUES ('Equipamentos Civis', 'equipamentos-civis', 60) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Alisadoras de Piso', 'alisadoras-piso'),
        (cat_id, 'Betoneiras', 'betoneiras'),
        (cat_id, 'Compactadores Percussão', 'compactadores-percussao'),
        (cat_id, 'Cortadores Azulejo/Piso', 'cortadores-azulejo'),
        (cat_id, 'Cortadoras de Piso', 'cortadoras-piso'),
        (cat_id, 'Guinchos de Coluna', 'guinchos-coluna'),
        (cat_id, 'Misturadores Argamassa', 'misturadores-argamassa'),
        (cat_id, 'Motores Elétricos', 'motores-eletricos'),
        (cat_id, 'Motores Gasolina', 'motores-gasolina-civis'),
        (cat_id, 'Placas Vibratórias', 'placas-vibratorias'),
        (cat_id, 'Réguas Vibratórias', 'reguas-vibratorias'),
        (cat_id, 'Serras Circulares Bancada', 'serras-circulares-bancada'),
        (cat_id, 'Vibradores de Imersão', 'vibradores-imersao');

    -- CATEGORIA 7: EQUIPAMENTOS ESPECÍFICOS
    INSERT INTO categories (name, slug, display_order) VALUES ('Equipamentos Específicos', 'equipamentos-especificos', 70) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Alicates Hidráulicos', 'alicates-hidraulicos'),
        (cat_id, 'Alicates Rebitadores', 'alicates-rebitadores'),
        (cat_id, 'Aspiradores de Pó', 'aspiradores-po'),
        (cat_id, 'Carregadores Bateria', 'carregadores-bateria'),
        (cat_id, 'Chaves de Corrente', 'chaves-corrente'),
        (cat_id, 'Chaves de Grifo', 'chaves-grifo'),
        (cat_id, 'Chaves de Impacto', 'chaves-impacto'),
        (cat_id, 'Cortadoras Piso Elétricas', 'cortadoras-piso-eletricas'),
        (cat_id, 'Enceradeiras de Piso', 'enceradeiras-piso'),
        (cat_id, 'Furadeiras Base Magnética', 'furadeiras-base-magnetica'),
        (cat_id, 'Jogos de Soquete', 'jogos-soquete'),
        (cat_id, 'Lavadoras Alta Pressão', 'lavadoras-alta-pressao'),
        (cat_id, 'Lixadeiras Teto/Parede', 'lixadeiras-teto-parede'),
        (cat_id, 'Marretas', 'marretas'),
        (cat_id, 'Nebulizadores', 'nebulizadores'),
        (cat_id, 'Perfuratrizes Diamantadas', 'perfuratrizes-diamantadas'),
        (cat_id, 'Policorte', 'policorte'),
        (cat_id, 'Politrizes de Piso', 'politrizes-piso'),
        (cat_id, 'Saca Polias Hidráulico', 'saca-polias-hidraulico'),
        (cat_id, 'Torquímetros', 'torquimetros');

    -- CATEGORIA 8: FERRAMENTAS À BATERIA
    INSERT INTO categories (name, slug, display_order) VALUES ('Ferramentas à Bateria', 'ferramentas-bateria', 80) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Baterias Li-Ion', 'baterias-li-ion'),
        (cat_id, 'Carregadores Li-Ion', 'carregadores-li-ion'),
        (cat_id, 'Chaves Impacto Bateria', 'chaves-impacto-bateria'),
        (cat_id, 'Níveis a Laser', 'niveis-laser'),
        (cat_id, 'Parafusadeiras Bateria', 'parafusadeiras-bateria');

    -- CATEGORIA 9: FERRAMENTAS ELÉTRICAS
    INSERT INTO categories (name, slug, display_order) VALUES ('Ferramentas Elétricas', 'ferramentas-eletricas', 90) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Esmeris Retos', 'esmeris-retos'),
        (cat_id, 'Esmerilhadeiras Angulares', 'esmerilhadeiras-angulares'),
        (cat_id, 'Furadeiras', 'furadeiras'),
        (cat_id, 'Lixadeiras', 'lixadeiras'),
        (cat_id, 'Marteletes Perfuradores', 'marteletes-perfuradores'),
        (cat_id, 'Martelos Demolidores', 'martelos-demolidores'),
        (cat_id, 'Martelos Perfuradores', 'martelos-perfuradores-eletricos'),
        (cat_id, 'Martelos Rompedores', 'martelos-rompedores'),
        (cat_id, 'Multicortadoras', 'multicortadoras'),
        (cat_id, 'Parafusadeiras', 'parafusadeiras'),
        (cat_id, 'Plainas Elétricas', 'plainas-eletricas'),
        (cat_id, 'Politrizes', 'politrizes'),
        (cat_id, 'Retificadeiras', 'retificadeiras'),
        (cat_id, 'Serras Circulares', 'serras-circulares'),
        (cat_id, 'Serras Mármores', 'serras-marmores'),
        (cat_id, 'Serras Sabre', 'serras-sabre'),
        (cat_id, 'Serras Tico Tico', 'serras-tico-tico'),
        (cat_id, 'Sopradores Térmicos', 'sopradores-termicos');

    -- CATEGORIA 10: MÁQUINAS DE CORTE E SOLDA
    INSERT INTO categories (name, slug, display_order) VALUES ('Máquinas de Corte e Solda', 'maquinas-corte-solda', 100) RETURNING id INTO cat_id;
    INSERT INTO subcategories (category_id, name, slug) VALUES 
        (cat_id, 'Conjuntos Oxi-Acetilênicos', 'conjuntos-oxi-acetilenicos'),
        (cat_id, 'Inversores Solda TIG', 'inversores-solda-tig'),
        (cat_id, 'Máquinas Corte Plasma', 'maquinas-corte-plasma'),
        (cat_id, 'Máquinas Solda MIG/MAG', 'maquinas-solda-mig-mag'),
        (cat_id, 'Reguladores de Gás', 'reguladores-gas'),
        (cat_id, 'Retificadores de Solda', 'retificadores-solda'),
        (cat_id, 'Tochas Solda/Corte', 'tochas-solda-corte'),
        (cat_id, 'Transformadores Solda', 'transformadores-solda');

END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT insert_catalog_structure();

-- Drop the function after use
DROP FUNCTION insert_catalog_structure();
