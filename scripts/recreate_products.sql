-- =====================================================
-- SQL para Recriação de Produtos - LocaMulti
-- Gerado em: 2025-12-09T14:05:30.577Z
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- PASSO 1: Excluir todos os produtos existentes
DELETE FROM products;

-- PASSO 2: Criar produtos a partir das subfamílias do catálogo
-- Cada subfamília se torna um produto vinculado corretamente


-- ========== CATEGORIA: DEMOLIÇÃO E PERFURAÇÃO ==========

-- Família: MARTELOS DEMOLIDORES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELO DEMOLIDOR 16 Kg - D25960',
    'MARTELO DEMOLIDOR 16 Kg - D25960 / POTÊNCIA 1600W / TENSÃO 220V MONO / ROTAÇÃO 1450 RPM / IMPACTO 41J / ENCAIXE HEXAGONAL 1.1/8" (28mm) / 16Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.1'
  AND s.catalog_id = '1.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELO DEMOLIDOR 30 Kg - D25980',
    'MARTELO DEMOLIDOR 30 Kg - D25980 / POTÊNCIA 2000W / TENSÃO 220V MONO / 900 IPM / IMPACTO 68J / ENCAIXE SEXT 1.1/8" / 31 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.1'
  AND s.catalog_id = '1.1.2';


-- Família: MARTELOS ROMPEDORES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELO DEMOLIDOR 11 Kg - D25899',
    'MARTELO DEMOLIDOR 11 Kg - D25899 / POTÊNCIA 1500W / TENSÃO 220V MONO / 2040 IPM / IMPACTO 25J / ENCAIXE SDS-MAX / 10,5g',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.2'
  AND s.catalog_id = '1.2.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELO ROMPEDOR 5 kg - D25810',
    'MARTELO ROMPEDOR 5 kg - D25810 / SDS-MAX /  220V MONOFÁSICO / POTÊNCIA 1050W /  impacto 7J 2840 BPM / 6,4 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.2'
  AND s.catalog_id = '1.2.2';


-- Família: MARTELETES PERFURADORES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELETE PERFURADOR 2 Kg D25133K',
    'MARTELETE PERFURADOR 2 Kg D25133K / POTÊNCIA 800W / TENSÃO 220V / ROTAÇÃO 0-1500 / IMPACTO 0-5500ipm / FORÇA DE 2,9J / MANDRIL SDS-PLUS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.3'
  AND s.catalog_id = '1.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARTELO PERFURADOR 5 kg SDS-MAX - DEWALT D25481',
    'MARTELO PERFURADOR 5 kg SDS-MAX - DEWALT D25481 / 220V MONOFÁSICO / POTÊNCIA 1050W /  540 RPM / IMPACTO 6,1J PERFURANDO / 3150 IPM / 6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.3'
  AND s.catalog_id = '1.3.2';


-- Família: FURADEIRAS DE IMPACTO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA DE IMPACTO 1/2" - DW505',
    'FURADEIRA DE IMPACTO 1/2" - DW505 / MANDRIL 1/2" / IMPACTO - REVERSÍVEL / POTÊNCIA 800W',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.4'
  AND s.catalog_id = '1.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA DE IMPACTO 5/8" - GSB 30-2',
    'FURADEIRA DE IMPACTO 5/8" - GSB 30-2 / POTÊNCIA 900W / TENSÃO 220V MONOFÁSICO / 645-1400 rpm / IMPACTO 10320-22400 min-1 / BROCA Ø20-100mm / MANDRIL 5/8" (16mm) / 4,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.4'
  AND s.catalog_id = '1.4.2';


-- Família: FURADEIRAS METAL MADEIRA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA METAL MADEIRA 5/8" -  GBM 1600 RE',
    'FURADEIRA METAL MADEIRA 5/8" -  GBM 1600 RE / MANDRIL 5/8" / REVERSÍVEL / POTÊNCIA 850W - BOSCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.5'
  AND s.catalog_id = '1.5.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA METAL MADEIRA 5/8" - DW130 RE',
    'FURADEIRA METAL MADEIRA 5/8" - DW130 RE / MANDRIL 5/8" / REVERSÍVEL / POTÊNCIA 710W - DEWALT',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.5'
  AND s.catalog_id = '1.5.2';


-- Família: FURADEIRAS DE BASE MAGNÉTICA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA DE BASE MAGNÉTICA DWE1622 - DEWALT',
    'FURADEIRA DE BASE MAGNÉTICA DWE1622 - DEWALT / POTÊNCIA 1200W / TENSÃO 220V MONO / 2 VELOCIDADES 300-450 rpm / Ø BROCA HELICOIDAL até 16mm / Ø BROCA ANULAR até 50mm / curso 180mm / 15 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.6'
  AND s.catalog_id = '1.6.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA DE BASE MAGNÉTICA FE-45 - MERAX',
    'FURADEIRA DE BASE MAGNÉTICA FE-45 - MERAX / POTÊNCIA 1200W / TENSÃO 220V MONO / 0-350 rpm / ØBROCA 3-16mm / curso 180mm / 22,4 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.6'
  AND s.catalog_id = '1.6.2';


-- Família: PERFURATRIZES DIAMANTADAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PERFURATRIZ DIAMANTADA DMS 240 HUSQVARNA C/ SUPORTE INCLINÁVEL 0-60º',
    'PERFURATRIZ DIAMANTADA DMS 240 HUSQVARNA C/ SUPORTE INCLINÁVEL 0-60º / POTÊNCIA 2400W / TENSÃO 220V MONO / Ø BROCA MÁX 250mm / ROTAÇÃO 390-890 rpm / CURSO SUPORTE 686 mm / PESO TOTAL 20,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.7'
  AND s.catalog_id = '1.7.1';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PONTEIRO SDS MAX 18 X 400 mm',
    'PONTEIRO SDS MAX 18 X 400 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PONTEIRO SEXTAVADO HEXAGONAL 28mm - 28 x 520 mm',
    'PONTEIRO SEXTAVADO HEXAGONAL 28mm - 28 x 520 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA COPO COROA DIAMANTADA D465',
    'SERRA COPO COROA DIAMANTADA D465 / 1.1/4" - Ø 107 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA COPO COROA DIAMANTADA D465',
    'SERRA COPO COROA DIAMANTADA D465 / 1.1/4" - Ø 159 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA COPO COROA DIAMANTADA D465',
    'SERRA COPO COROA DIAMANTADA D465 / 1.1/4" - Ø 57 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA COPO COROA DIAMANTADA D465',
    'SERRA COPO COROA DIAMANTADA D465 / 1.1/4" - Ø 82 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHADEIRA LARGA SDS MAX 400 MM X 50 MM',
    'TALHADEIRA LARGA SDS MAX 400 MM X 50 MM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHADEIRA SDS MAX 18 X 400 x 30 mm',
    'TALHADEIRA SDS MAX 18 X 400 x 30 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHADEIRA SEXTAVADA HEXAGONAL 28mm - 28 x 520 x 35 mm',
    'TALHADEIRA SEXTAVADA HEXAGONAL 28mm - 28 x 520 x 35 mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '1'
  AND f.catalog_id = '1.8'
  AND s.catalog_id = '1.8.9';


-- ========== CATEGORIA: CONCRETAGEM E ACABAMENTO ==========

-- Família: COMPACTADORES DE SOLO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPACTADOR DE PERCUSSÃO HUSQVARNA LT6005',
    'COMPACTADOR DE PERCUSSÃO HUSQVARNA LT6005 / GASOLINA 4 TEMPOS / 3,5 HP / 20 KN x 7,5 cm / 720 IMPAC / min / SAPATA 280x330mm / 70 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.1'
  AND s.catalog_id = '2.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPACTADOR DE PERCUSSÃO WACKER BS 50 2plus',
    'COMPACTADOR DE PERCUSSÃO WACKER BS 50 2plus / GASOLINA 4 TEMPOS / 2 KW / 16 KN x 6,4 cm / 687 IMPAC / min / SAPATA 280x340mm / 59 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.1'
  AND s.catalog_id = '2.1.2';


-- Família: RÉGUAS VIBRATÓRIAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RÉGUA VIBRATÓRIA SIMPLES RV-SI VIBROMAK',
    'RÉGUA VIBRATÓRIA SIMPLES RV-SI VIBROMAK / PERFIL ALUMÍNIO INJETADO 3M/2M / MOTOR GASOLINA 2T KAWASHIMA  - 1,5 HP / DIMENSÕES  670 x 980 mm / 21 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.3'
  AND s.catalog_id = '2.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RÉGUA VIBRATÓRIA SIMPLES RV-VK PETROTEC',
    'RÉGUA VIBRATÓRIA SIMPLES RV-VK PETROTEC / PERFIL ALUMÍNIO INJETADO 2M/3M / MOTOR GASOLINA 4T HONDA GX35  - 1,5 HP / DIMENSÕES  670 x 980 mm / 21 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.3'
  AND s.catalog_id = '2.3.2';


-- Família: ALISADORAS DE PISO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALISADORA DE PISO GASOLINA TPT900',
    'ALISADORA DE PISO GASOLINA TPT900 / GASOLINA 4 TEMPOS / 6 HP / Ø900mm x 4 PÁS 350x150mm / 0-15º INCLINAÇÃO / 68 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.4'
  AND s.catalog_id = '2.4.1';


-- Família: CORTADORAS DE PISO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADORA DE PISO GASOLINA TCC450',
    'CORTADORA DE PISO GASOLINA TCC450 / GASOLINA 4 TEMPOS / 13 HP / DISCO 12" - 18" C/ PROFUNDIDADE MÁXIMA DE CORTE 150mm / TANQUE ÁGUA 30 l / 115 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.5'
  AND s.catalog_id = '2.5.1';


-- Família: POLITRIZES DE PISO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'POLITRIZ DE PISO PG280G HUSQVARNA',
    'POLITRIZ DE PISO PG280G HUSQVARNA / POTÊNCIA 2200 W / MONOFÁSICA 220V / Ø DESBASTE 280mm / 1730 rpm / 70 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.6'
  AND s.catalog_id = '2.6.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'POLITRIZ DE PISO PG280S HUSQVARNA',
    'POLITRIZ DE PISO PG280S HUSQVARNA / POTÊNCIA 2200 W / MONOFÁSICA 220V / Ø DESBASTE 280mm / 1730 rpm / 70 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.6'
  AND s.catalog_id = '2.6.2';


-- Família: BETONEIRAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BETONEIRA 400 LITROS RENTAL',
    'BETONEIRA 400 LITROS RENTAL / MOTOR 2CV MONOFÁSICO 220V / CAPAC MISTURA 280L / 12 CICLOS/h / 3m³/h / TRANSMISSÃO CORREIA A76 / 240 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.7'
  AND s.catalog_id = '2.7.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BETONEIRA NR-12 - 400 LITROS RENTAL',
    'BETONEIRA NR-12 - 400 LITROS RENTAL / MOTOR 2CV MONOFÁSICO 220V / CAPAC MISTURA 280L / 12 CICLOS/h / PRODUÇÃO 4 m³/h / TRANSMISSÃO 2 CORREIAS  A44 / 210 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.7'
  AND s.catalog_id = '2.7.2';


-- Família: GUINCHOS DE COLUNA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GUINCHO DE COLUNA 200 Kg',
    'GUINCHO DE COLUNA 200 Kg / MOTOR 1,25 CV MONOFÁSICO 220V / ELEVAÇÃO 30 m / VELOC 25 m/min / 1 CABO Ø5mm / CAÇAMBA 512x512x390mm / BOTOEIRA 48V x 3m / 43 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.8'
  AND s.catalog_id = '2.8.1';


-- Família: VIBRADORES DE IMERSÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MOTOR ELÉTRICO PARA VIBRADOR DE IMERSÃO e BOMBA DE MANGOTE',
    'MOTOR ELÉTRICO PARA VIBRADOR DE IMERSÃO e BOMBA DE MANGOTE / 220V MONOFÁSICO / 2 CV - 4 POLOS / 17 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MOTOR GASOLINA PARA BOMBA DE MANGOTE e VIBRADOR DE IMERSÃO',
    'MOTOR GASOLINA PARA BOMBA DE MANGOTE e VIBRADOR DE IMERSÃO / GASOLINA 4 TEMPOS - 6,5 HP / 3600 rpm / partida manual / 25 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO 36 mm',
    'VIBRADOR DE IMERSÃO 36 mm / COMPRIMENTO 5 m / FREQUÊNCIA 12500 vpm / AMPLITUDE 8,0mm / 10 Kg / VIBROMAK',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO 46 mm',
    'VIBRADOR DE IMERSÃO 46 mm / COMPRIMENTO 5 m / FREQUÊNCIA 12500 vpm / AMPLITUDE 8,0mm / 10 Kg / VIBROMAK',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO 63 mm',
    'VIBRADOR DE IMERSÃO 63 mm / COMPRIMENTO 5 m / FREQUÊNCIA 12500 vpm / AMPLITUDE 8,0mm / 10 Kg / VIBROMAK',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO PORTÁTIL GVC 20EX',
    'VIBRADOR DE IMERSÃO PORTÁTIL GVC 20EX / POTÊNCIA 1400W / 220V MONOFÁSICO / 20.000 vpm / MANGOTE Ø35mm x 3,5m / 5,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO PORTÁTIL GVC 22EX',
    'VIBRADOR DE IMERSÃO PORTÁTIL GVC 22EX / POTÊNCIA 2200W / 220V MONOFÁSICO / 15.000 vpm / MANGOTE Ø35mm x 3,5m / 5,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO PORTÁTIL VIBROMAK Ø25 x 1,20m',
    'VIBRADOR DE IMERSÃO PORTÁTIL VIBROMAK Ø25 x 1,20m / COM MOTOR ACOPLADO / POTÊNCIA 600W / 220V MONOFÁSICO / 15600 vpm / MANGOTE Ø25mm x 1,2m / 3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'VIBRADOR DE IMERSÃO PORTÁTIL VIBROMAK Ø35 x 3,50m',
    'VIBRADOR DE IMERSÃO PORTÁTIL VIBROMAK Ø35 x 3,50m / COM MOTOR ALTA FREQUÊNCIA ACOPLADO / POTÊNCIA 2400W / 220V MONOFÁSICO / 15600 vpm / MANGOTE Ø35mm x 3,5m / 6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.9'
  AND s.catalog_id = '2.9.9';


-- Família: SERRAS CIRCULARES DE BANCADA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA CIRCULAR DE BANCADA NR-12 HORBACH',
    'SERRA CIRCULAR DE BANCADA NR-12 HORBACH / 5CV 3680W / TRIFÁSICA 380V / ESPESSURA DE CORTE 90mm / TAMANHO DA LÂMINA Ø350x30mm C/ 60 DENTES / MESA 770x930x860 mm / 90 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.10'
  AND s.catalog_id = '2.10.1';


-- Família: MISTURADORES DE ARGAMASSA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MISTURADOR ELÉTRICO PARA ARGAMASSA CORTAG HM-140',
    'MISTURADOR ELÉTRICO PARA ARGAMASSA CORTAG HM-140 / 220V MONOFÁSICO / POTÊNCIA 1600W / HASTE (60576) C/ COMPRIMENTO 60cm X DIÂMETRO 140 mm / ROSCA EIXO M14 / 6 VELOCIDADES DE OPERAÇÃO / 0-380 e 0-660 RPM / VOLUME DE MISTURA 90 LITROS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.11'
  AND s.catalog_id = '2.11.1';


-- Família: LIXADEIRAS DE TETO E PAREDE
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA DE PAREDE C/ LED',
    'LIXADEIRA DE PAREDE C/ LED / STONE HAMMER SH700 - POTÊNCIA 1050W / 800-1800rpm / Ø180mm /C/ SACO COLETOR DE PÓ /  3,75 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.14'
  AND s.catalog_id = '2.14.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA DE TETO E PAREDE C/ LED',
    'LIXADEIRA DE TETO E PAREDE C/ LED / DEWALT SW75 - POTÊNCIA 750W / 600-1700rpm / Ø225mm / 1,10 - 1,80m CABEÇA ARTICULÁVEL /  3,75 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.14'
  AND s.catalog_id = '2.14.2';


-- Família: CORTADORES DE AZULEJO E PISO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADOR DE AZULEJO E PISO DUPLEX',
    'CORTADOR DE AZULEJO E PISO DUPLEX / LARGURA MÁXIMA 90cm / ESPESSURA MÁXIMA 12mm / QUEBRA EM CIMA E EMBAIXO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.16'
  AND s.catalog_id = '2.16.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADOR DE AZULEJO E PISO HD-1000',
    'CORTADOR DE AZULEJO E PISO HD-1000 / LARGURA MÁXIMA 100cm / ESPESSURA MÁXIMA 12mm / QUEBRA EM CIMA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.16'
  AND s.catalog_id = '2.16.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADOR DE PISO PORCELANATO CORTAG MEGA 155',
    'CORTADOR DE PISO PORCELANATO CORTAG MEGA 155 / LARGURA MÁXIMA DO PISO 155cm / ESPESSURA MÁXIMA 15mm / DIAGONAL MÁXIMA 1,10 x 1,10m / RODEL TITÂNIO UNIVERSAL Ø18mm x 90mm (Cód 61293) / QUEBRA EM CIMA E EMBAIXO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.16'
  AND s.catalog_id = '2.16.3';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CONJUNTO DE LÂMINAS C/ 4 PÁS SIMPLES 36" P/ ALISADORA DE PISO',
    'CONJUNTO DE LÂMINAS C/ 4 PÁS SIMPLES 36" P/ ALISADORA DE PISO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DE FLOTAÇÃO 36" AC SAE1020 P/ ALISADORA DE PISO',
    'DISCO DE FLOTAÇÃO 36" AC SAE1020 P/ ALISADORA DE PISO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DIAMANTADO 350mm',
    'DISCO DIAMANTADO 350mm / PROFUNDIDADE DE CORTE 12cm P/ CORTADORA DE PAREDE /mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DIAMANTADO 350mm',
    'DISCO DIAMANTADO 350mm / PROFUNDIDADE DE CORTE 12cm P/ CORTADORA DE PAREDE /mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DIAMANTADO 350mm',
    'DISCO DIAMANTADO 350mm / PROFUNDIDADE DE CORTE 7cm P/ CORTADORA DE PISO /mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DIAMANTADO 450mm',
    'DISCO DIAMANTADO 450mm / PROFUNDIDADE DE CORTE 14cm P/ CORTADORA DE PISO /mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DISCO DIAMANTADO Ø 125 mm',
    'DISCO DIAMANTADO Ø 125 mm / CONSUMO / mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FRESA ',
    'FRESA  / FRESA Ø 116 MM / 10 DENTES / Ø FURO FRESA 5/8'''' / PROF MAX 35 MM / LARGURA MAX 3,5 CM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FRESA ',
    'FRESA  / FRESA Ø 116 MM / 10 DENTES / Ø FURO FRESA 5/8'''' / PROF MAX 35 MM / LARGURA MAX 3,5 CM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.9';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'HASTE PARA MISTURADOR ELÉTRICO HM-140',
    'HASTE PARA MISTURADOR ELÉTRICO HM-140 / Ø 140 mm x COMPRIMENTO 60 cm / ENCAIXE ROSCA M14',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.10';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'JOGO DE DIAMANTADOS - 6 PEÇAS - GRAMATURAS 20 - 50 - 100',
    'JOGO DE DIAMANTADOS - 6 PEÇAS - GRAMATURAS 20 - 50 - 100 / LOCAÇÃO POR MILÍMETRO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.11';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'JOGO DE DIAMANTADOS - 6 PEÇAS - TIPO SETA - GRÃO 20',
    'JOGO DE DIAMANTADOS - 6 PEÇAS - TIPO SETA - GRÃO 20 / LOCAÇÃO POR MILÍMETRO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.12';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LAMINA DE SERRA Ø 350mm x ',
    'LAMINA DE SERRA Ø 350mm x  / ALTURA MÁXIMA CORTE 90cm P/ SERRA DE BANCADA HORBACH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.13';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA PARA LIXADEIRA DE PAREDE',
    'LIXA PARA LIXADEIRA DE PAREDE / CADA UNIDADE   ( 60, 80, 100, 120, 150, 180, 240)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.14';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA PARA LIXADEIRA DE TETO E PAREDE',
    'LIXA PARA LIXADEIRA DE TETO E PAREDE / CADA UNIDADE   ( 60, 80, 100, 120, 150, 180, 240)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.17'
  AND s.catalog_id = '2.17.15';


-- Família: CORTADORAS DE PAREDE CANALETADEIRAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADOR DE PAREDE TIPO CANALETADEIRA CORTAG BRIC-35',
    'CORTADOR DE PAREDE TIPO CANALETADEIRA CORTAG BRIC-35 / 2000W / 220V / 2200 RPM / LARGURA CORTE 35 mm / PROFUNDIDADE MAX 35 mm / FRESA Ø 116 MM / 10 DENTES / Ø FURO 5/8'''' / PESO 10,9 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.18'
  AND s.catalog_id = '2.18.1';


-- Família: CORTADORAS DE PISO E PAREDE
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADORA DE PISO E PAREDE RUSQVARNA K4000',
    'CORTADORA DE PISO E PAREDE RUSQVARNA K4000 / 2700 W / 220V / 6300 rpm / Ø DISCO máx 350mm / PROFUND máx 125mm / Ø furo disco 25,4mm / RUÍDO 95dB / 7,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.19'
  AND s.catalog_id = '2.19.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADORA DE PISO E PEDRA STIHL TS 420',
    'CORTADORA DE PISO E PEDRA STIHL TS 420 / GASOLINA 2T / 4,3 HP (3,2 KW) / 66,7 CC / 4800 rpm / Ø DISCO máx 350mm / PROFUND máx 125mm / Ø furo disco 25,4mm / RUÍDO 109dB / 9,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.19'
  AND s.catalog_id = '2.19.2';


-- Família: LIXADEIRAS DE CONCRETO E TEXTURA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA DE TEXTURA/CONCRETO',
    'LIXADEIRA DE TEXTURA/CONCRETO / STONE HAMMER SH49SP - POTÊNCIA 1500W / 2500-4500rpm / DISCO DIAMANTADO Ø125mm / ROSCA EIXO M10 /',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.20'
  AND s.catalog_id = '2.20.1';


-- Família: PLACAS VIBRATÓRIAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PLACA VIBRATÓRIA UNIDIRECIONAL TPC100WT',
    'PLACA VIBRATÓRIA UNIDIRECIONAL TPC100WT / GASOLINA 4 TEMPOS / 6,5 HP / 13 KN x 30cm COMPACTAÇÃO / 660 m²/h / PLACA 530x500 mm / 97 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '2'
  AND f.catalog_id = '2.21'
  AND s.catalog_id = '2.21.1';


-- ========== CATEGORIA: FERRAMENTAS DE CORTAR, LIXAR E PARAFUSAR ==========

-- Família: LIXADEIRAS MANUAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA 7" DWE 493PW',
    'LIXADEIRA 7" DWE 493PW / 2200W / 220V MONO / 5000 RPM / PRATO 7" - REBOLO-ESCOVA 5" / EIXO M-14 / 4,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.4'
  AND s.catalog_id = '3.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA EXCÊNTRICA GEX 125-150 AVE',
    'LIXADEIRA EXCÊNTRICA GEX 125-150 AVE / 600W / 220V MONO / 5500-12000 RPM / Ø PRATO LIXAR 150mm / 11000-24000 OSCILAÇÕES / EXCENTRICIDADE 2mm / 2,4 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.4'
  AND s.catalog_id = '3.4.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXADEIRA ROTO ORBITAL EXCÊNTRICA GEX 125-1 AE',
    'LIXADEIRA ROTO ORBITAL EXCÊNTRICA GEX 125-1 AE / 250W / 220V MONO / 7000-12000 RPM / Ø PRATO LIXAR 125mm / OSCILAÇÕES 15000-24000 OPM / EXCENTRICIDADE 1,25mm / 1,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.4'
  AND s.catalog_id = '3.4.3';


-- Família: POLITRIZES MANUAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'POLITRIZ ELETRÔNICA DWP 849X',
    'POLITRIZ ELETRÔNICA DWP 849X / 1250W / 220V MONO / 0-600-3500 RPM / PRATO 7" / ROSCA M-14 / 2,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.5'
  AND s.catalog_id = '3.5.1';


-- Família: SERRAS MANUAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA CIRCULAR 7.1/4" DWE 575',
    'SERRA CIRCULAR 7.1/4" DWE 575 / POTÊNCIA 1800W / TENSÃO 220V MONO / 5200 rpm / disco 184mm / 4,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.6'
  AND s.catalog_id = '3.6.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA CIRCULAR GKS 235',
    'SERRA CIRCULAR GKS 235 / POTÊNCIA 2100W / TENSÃO 220V MONO / 5000 rpm / disco 235mm / 7,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.6'
  AND s.catalog_id = '3.6.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA MÁRMORE DEWALT DW862 B2',
    'SERRA MÁRMORE DEWALT DW862 B2 / POTÊNCIA 1400W / TENSÃO 220V MONO / 13000 rpm / disco 125mm / profundidade 40mm / 2,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.6'
  AND s.catalog_id = '3.6.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA SABRE DW304PK',
    'SERRA SABRE DW304PK / POTÊNCIA 1000W / TENSÃO 220V MONO / / golpe 2900 GPM/ 3,2 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.6'
  AND s.catalog_id = '3.6.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SERRA TICO TICO GST 150 BCE',
    'SERRA TICO TICO GST 150 BCE / POTÊNCIA 780W / TENSÃO 220V MONO / 500-3100 rpm / 10mm aço 150mm madeira / 2,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.6'
  AND s.catalog_id = '3.6.5';


-- Família: PARAFUSADEIRAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PARAFUSADEIRA DW 268 CONTROLE TORQUE',
    'PARAFUSADEIRA DW 268 CONTROLE TORQUE / TORQUE 4 - 26 Nm / POTÊNCIA 550W / TENSÃO 220V MONO / 0-2500rpm / parafuso M6 1/4" sextavado / 1,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.7'
  AND s.catalog_id = '3.7.1';


-- Família: CHAVES DE IMPACTO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE DE IMPACTO DW 292',
    'CHAVE DE IMPACTO DW 292 / POTÊNCIA 710W / TENSÃO 220V MONO / rotação 2100 min-1 / impactos 0-2700 ipm / Ø parafuso M6-M18 / torque 70-325 Nm / Encaixe quadrado 1/2" / 3,2 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.8'
  AND s.catalog_id = '3.8.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE DE IMPACTO GDS 18 E',
    'CHAVE DE IMPACTO GDS 18 E / POTÊNCIA 500W / TENSÃO 220V MONO / rotação 800-1900 min-1 / Ø parafuso M6-M18 / torque 70-250 Nm / Encaixe quadrado 1/2" / 3,2 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.8'
  AND s.catalog_id = '3.8.2';


-- Família: ESMERIS RETOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERIL RETO 6" DW 882 PROFISSIONAL',
    'ESMERIL RETO 6" DW 882 PROFISSIONAL / POTÊNCIA 1800W / 5600 rpm / REBOLO 5" /  EIXO M16 / 3,9 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.9'
  AND s.catalog_id = '3.9.1';


-- Família: POLICORTES CORTADORAS DE METAL
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'POLICORTE',
    'POLICORTE / CORTADORA DE METAIS GCO 2000 / POTÊNCIA 2000W / TENSÃO 220V MONO / 3500 rpm / disco 355mm / furo central 1" / 16,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.10'
  AND s.catalog_id = '3.10.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'POLICORTE',
    'POLICORTE / SERRA CORTE RÁPIDO D28720 / POTÊNCIA 2200W / TENSÃO 220V MONO / 3800 rpm / disco 355mm / furo central 1" / 16,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.10'
  AND s.catalog_id = '3.10.2';


-- Família: RETIFICADEIRAS MANUAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADORA DWALT DW 888-B2 - TIPO 3 - 600W, 19000 rpm, 220V',
    'RETIFICADORA DWALT DW 888-B2 - TIPO 3 - 600W, 19000 rpm, 220V',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.11'
  AND s.catalog_id = '3.11.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADORA DWALT DWE 4887 ',
    'RETIFICADORA DWALT DWE 4887  / POTÊNCIA 450W /  ROTAÇÃO 25000 rpm / TENSÃO 220V MONOFÁSICO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.11'
  AND s.catalog_id = '3.11.2';


-- Família: MULTICORTADORAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MULTICORTADORA GOP 250 CE',
    'MULTICORTADORA GOP 250 CE / POTÊNCIA 250W / TENSÃO 220V MONO / 8000-20000rpm / ângulo 1,4º / 1,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.12'
  AND s.catalog_id = '3.12.1';


-- Família: PLAINAS MANUAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PLAINA DWALT DW680',
    'PLAINA DWALT DW680 / 600W / 220V MONO / 15000 rpm / PROF CORTE 2,5mm / LARG CORTE 82mm / CAP MÁX REBAIXO 13mm / 2,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.13'
  AND s.catalog_id = '3.13.1';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA COM VELCRO P/ SUPORTE Ø 5" (80, 100, 120, 180)',
    'LIXA COM VELCRO P/ SUPORTE Ø 5" (80, 100, 120, 180)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA COM VELCRO P/ SUPORTE Ø 7" (80, 100, 120, 180)',
    'LIXA COM VELCRO P/ SUPORTE Ø 7" (80, 100, 120, 180)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA PARA LIXADEIRA EXCÊNTRICA 5"',
    'LIXA PARA LIXADEIRA EXCÊNTRICA 5" / CADA UNIDADE   ( 80, 100, 120, 180, 320)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA PARA LIXADEIRA ROTO ORBITAL 5"',
    'LIXA PARA LIXADEIRA ROTO ORBITAL 5" / CADA UNIDADE   ( 80, 100, 120, 180, 320)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LIXA SEM VELCRO - Ø 7" C/ FURO CENTRAL ( 36, 60, 80, 100, 120, 180)',
    'LIXA SEM VELCRO - Ø 7" C/ FURO CENTRAL ( 36, 60, 80, 100, 120, 180)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PRATO DE BORRACHA CORRUGADO PARA BOINA POLIMENTO 7"',
    'PRATO DE BORRACHA CORRUGADO PARA BOINA POLIMENTO 7"',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PRATO DE BORRACHA LISO PARA LIXADEIRA 7"',
    'PRATO DE BORRACHA LISO PARA LIXADEIRA 7"',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PRATO DE BORRACHA LISO PARA LIXADEIRA 7"',
    'PRATO DE BORRACHA LISO PARA LIXADEIRA 7"',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SUPORTE DISCO DE LIXA COM VELCRO - Ø 5" M-14  C/ ADAPATADOR P/ MANDRIL APERTO FURADEIRA',
    'SUPORTE DISCO DE LIXA COM VELCRO - Ø 5" M-14  C/ ADAPATADOR P/ MANDRIL APERTO FURADEIRA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.9';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SUPORTE DISCO DE LIXA COM VELCRO - Ø 7" M-14  C/ ADAPATADOR P/ MANDRIL APERTO FURADEIRA',
    'SUPORTE DISCO DE LIXA COM VELCRO - Ø 7" M-14  C/ ADAPATADOR P/ MANDRIL APERTO FURADEIRA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.14'
  AND s.catalog_id = '3.14.10';


-- Família: ESMERILHADEIRAS ANGULARES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERILHADEIRA ANGULAR 5" DWE 4314',
    'ESMERILHADEIRA ANGULAR 5" DWE 4314 / 1500W - 220v MONO / 10000 RPM / DISCO 5" (125mm) / 2 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.15'
  AND s.catalog_id = '3.15.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERILHADEIRA ANGULAR 7" DWE 491 (180 mm)',
    'ESMERILHADEIRA ANGULAR 7" DWE 491 (180 mm) / POTÊNCIA 2200W / 8500 RPM / 220V MONOFÁSICO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.15'
  AND s.catalog_id = '3.15.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERILHADEIRA ANGULAR 7" GWS 22-180',
    'ESMERILHADEIRA ANGULAR 7" GWS 22-180 / 2200W - 220V MONO / 8500 RPM / DISCO 7" (180mm) / 4,9 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.15'
  AND s.catalog_id = '3.15.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERILHADEIRA ANGULAR 9" DWE490 (230 mm)',
    'ESMERILHADEIRA ANGULAR 9" DWE490 (230 mm) / POTÊNCIA 2200W / 6500 RPM / 220V MONOFÁSICO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.15'
  AND s.catalog_id = '3.15.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESMERILHADEIRA ANGULAR 9" GWS 21-230',
    'ESMERILHADEIRA ANGULAR 9" GWS 21-230 / 2200W - 220V MONO / 6500 RPM / DISCO 9" (230mm) / 5,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '3'
  AND f.catalog_id = '3.15'
  AND s.catalog_id = '3.15.5';


-- ========== CATEGORIA: BOMBAS, GERADORES E COMPRESSORES ==========

-- Família: BOMBAS CENTRÍGUGAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA SUBMERSIVEL DE MANGOTE BF3  BUFFALO',
    'BOMBA SUBMERSIVEL DE MANGOTE BF3  BUFFALO / MANGOTE 6M / Ø RECALQUE 3" - 12 MCA - 40 M³/h - 25 KG C/ MANGUEIRA CONDUTO FLAT Ø3 X 10M',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA SUBMERSIVEL DE MANGOTE BSK-3.0',
    'BOMBA SUBMERSIVEL DE MANGOTE BSK-3.0 / MANGOTE 5 m / Ø RECALQUE 3" - 12 MCA - 40 M³/H - 24 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA SUBMERSÍVEL ELÉTRICA',
    'BOMBA SUBMERSÍVEL ELÉTRICA / RHINO RF-033 / ÁGUA SUJA / 3 CV / 220V MONOFÁSICO / 3450 rpm / RECALQUE Ø3" / 78 m³/h / 20 mca / 32 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA SUBMERSÍVEL ELÉTRICA SA750',
    'BOMBA SUBMERSÍVEL ELÉTRICA SA750 / ÁGUA LIMPA / 750W x 220V MONOFÁSICO / 3420 rpm / RECALQUE Ø2" / 20 m³/h / 12 mca',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MOTOBOMBA AUTOESCORVANTE DIESEL 7 hp',
    'MOTOBOMBA AUTOESCORVANTE DIESEL 7 hp / TDAE3CN7 E / 7 HP / MANUAL / 3"x3"',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MOTOR GASOLINA PARA BOMBA DE MANGOTE e VIBRADOR DE IMERSÃO',
    'MOTOR GASOLINA PARA BOMBA DE MANGOTE e VIBRADOR DE IMERSÃO / GASOLINA 4 TEMPOS - 6,5 HP / 3600 rpm / partida manual / 25 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.1'
  AND s.catalog_id = '4.1.6';


-- Família: GERADORES DE ENERGIA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GERADOR GASOLINA 10 KVA',
    'GERADOR GASOLINA 10 KVA / MONOFÁSICO / TG 12000 CXE  / 20 HP / TANQUE 25L / 8 h autonomia / Part. Elétrica / 155 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.2'
  AND s.catalog_id = '4.2.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GERADOR GASOLINA 3,1 KVA BUFFALO',
    'GERADOR GASOLINA 3,1 KVA BUFFALO / MONOFÁSICO / BFG 3500 / 7 HP / TANQUE 18L / 13 H AUTONOMIA / PARTIDA MANUAL / 42 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.2'
  AND s.catalog_id = '4.2.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GERADOR GASOLINA 3,1 KVA TOYAMA',
    'GERADOR GASOLINA 3,1 KVA TOYAMA / TG 3800 CX / 8 HP / TANQUE 18L / 13 horas autonomia / 55 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.2'
  AND s.catalog_id = '4.2.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GERADOR GASOLINA 7 KVA  TOYAMA',
    'GERADOR GASOLINA 7 KVA  TOYAMA / MONOFÁSICO / TG 8000 CXEV / 13HP / TANQUE 25L / 8 h autonomia / Partida Manual-Elétrica / 90 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.2'
  AND s.catalog_id = '4.2.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GERADOR GASOLINA 7 KVA BUFFALO',
    'GERADOR GASOLINA 7 KVA BUFFALO / MONOFÁSICO / BFG 6500 / 15HP / TANQUE 25L / 8 h autonomia / Partida Manual / 89 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.2'
  AND s.catalog_id = '4.2.5';


-- Família: COMPRESSORES DE AR
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPRESSOR - BRAVO CSL 10BR/200',
    'COMPRESSOR - BRAVO CSL 10BR/200 / 10 PCM / 100-140 PSI / 200 L / MONOFÁSICO 220V /  90 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.3'
  AND s.catalog_id = '4.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPRESSOR - MAX MSV 20MAX/300',
    'COMPRESSOR - MAX MSV 20MAX/300 / 20 PCM / 135-175 PSI / 300 L / TRIFÁSICO 380V / 208 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.3'
  AND s.catalog_id = '4.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPRESSOR - TWISTER BRAVO CSL 10/100',
    'COMPRESSOR - TWISTER BRAVO CSL 10/100 / 10 PCM / 100-140 PSI / 100 L  / TRIFÁSICO 380 / 62 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.3'
  AND s.catalog_id = '4.3.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPRESSOR AR - MC 7.6/21L  CHIAPERINI ',
    'COMPRESSOR AR - MC 7.6/21L  CHIAPERINI  / 7,6 PCM / 80-116 PSI / 21 L / MONO 220 / 12,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.3'
  AND s.catalog_id = '4.3.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'COMPRESSOR AR DIRETO MUNDIAL MSI 5,2 ML/AD - 5,2 PCM',
    'COMPRESSOR AR DIRETO MUNDIAL MSI 5,2 ML/AD - 5,2 PCM / 120 PSI / MONO 220 / 19,5 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.3'
  AND s.catalog_id = '4.3.5';


-- Família: PISTOLAS DE PINTURA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PISTOLA DE PINTURA',
    'PISTOLA DE PINTURA /  AR DIRETO CHIAPERINI / AD-80 ALUMINIO / 600 ml /  CH AD-80 ALUMINIO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.4'
  AND s.catalog_id = '4.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PISTOLA DE PINTURA TIPO GRAVIDADE FORT G MOD FG8640',
    'PISTOLA DE PINTURA TIPO GRAVIDADE FORT G MOD FG8640 /  ALTA PRODUÇÃO / 29-50 PSI / 6 PCM / BICOS 1,4 1,7 E 2,0 MM / LEQUE 220-270 MM / CANECA PLÁSTICO 600ML',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.4'
  AND s.catalog_id = '4.4.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PISTOLA DE PINTURA TIPO SUCÇÃO RONGPENG MOD R4001',
    'PISTOLA DE PINTURA TIPO SUCÇÃO RONGPENG MOD R4001 /  ALTA PRODUÇÃO / 43-58 PSI / 4,6 PCM / BICO 1,8 MM / LEQUE 220-270MM / CANECA ALUMÍNIO 1L',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '4'
  AND f.catalog_id = '4.4'
  AND s.catalog_id = '4.4.3';


-- ========== CATEGORIA: ELEVAÇÃO, MOVIMENTAÇÃO E REMOÇÃO ==========

-- Família: TARTARUGAS DE MOVIMENTAÇÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA DIRECIONAL RODA PU - 24 TONELADAS',
    'TARTARUGA DIRECIONAL RODA PU - 24 TONELADAS / Apoio Ø270 / Altura 155 / 144 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA DIRECIONAL RODA PU - 4 TONELADAS',
    'TARTARUGA DIRECIONAL RODA PU - 4 TONELADAS / Apoio 82x140 / Altura 110 / 16 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA DIRECIONAL RODA PU - 6 TONELADAS',
    'TARTARUGA DIRECIONAL RODA PU - 6 TONELADAS / Apoio 220x400 / Altura 110 / 53 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA FIXA RODA PU - 12 TONELADAS',
    'TARTARUGA FIXA RODA PU - 12 TONELADAS / Apoio 270x230 / Altura 155 / 39,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA FIXA RODA PU - 2 TONELADAS',
    'TARTARUGA FIXA RODA PU - 2 TONELADAS / Apoio 115x270 / Altura 110 / 6,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA FIXA RODA PU - 4 TONELADAS',
    'TARTARUGA FIXA RODA PU - 4 TONELADAS / Apoio 230x270 / Altura 110 / 14,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TARTARUGA FIXA RODA PU - 6 TONELADAS',
    'TARTARUGA FIXA RODA PU - 6 TONELADAS / Apoio 345x270 / Altura 110 / 21,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.1'
  AND s.catalog_id = '5.1.7';


-- Família: MACACOS HIDRÁULICOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO HIDRAULICO MT 30 TON',
    'MACACO HIDRAULICO MT 30 TON / 30403RP / RETORNO POR PESO / altura fechado 250mm / altura aberto 400 mm + FUSO 100 mm / ALTURA TOTAL 500mm / CURSO HIDRÁULICO 150mm / FUSO REGULAGEM 100mm / 16 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO HIDRAULICO MTO-12TON',
    'MACACO HIDRAULICO MTO-12TON / MODELO 12500RP - 2 ESTÁGIOS / RETORNO POR PESO / altura fechado 150mm / altura aberto 330 mm / CURSO HIDRÁULICO 180 mm / ACIONAMENTO HORIZONTAL / 10 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO HIDRÁULICO TIPO UNHA INDUSTRIAL - 10t',
    'MACACO HIDRÁULICO TIPO UNHA INDUSTRIAL - 10t / altura fechado inferior 30mm / altura aberto inferior 265mm / altura fechado superior 420mm / altura aberto superior 655mm / CURSO 235mm / 34,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO HIDRÁULICO TIPO UNHA INDUSTRIAL - 5t',
    'MACACO HIDRÁULICO TIPO UNHA INDUSTRIAL - 5t / altura fechado inferior 20mm / altura aberto inferior 230mm / altura fechado superior 370mm / altura aberto superior 580mm / CURSO 210mm / 23,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO MT  SIMPLES AÇÃO 35t',
    'MACACO MT  SIMPLES AÇÃO 35t / RETORNO POR PESO / altura fechado 270 / altura aberto 420 + 100 / CURSO 150 / 21,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO MT SIMPLES AÇÃO 20t',
    'MACACO MT SIMPLES AÇÃO 20t / RETORNO POR PESO / altura fechado 165 / altura aberto 245 + 40 / CURSO 80 / 9,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MACACO MT SIMPLES AÇÃO 50t',
    'MACACO MT SIMPLES AÇÃO 50t / RETORNO POR PESO / altura fechado 250 / altura aberto 400 / CURSO 150 / 28,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.2'
  AND s.catalog_id = '5.2.7';


-- Família: BOMBAS E CILINDROS HIDRÁULICOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA HIDRÁULICA - 600 bar',
    'BOMBA HIDRÁULICA - 600 bar / Mangueira 1,4m / Reserv 0,4 l / 1/4" BSP / 6,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA HIDRÁULICA MANUAL MERAX CP-700A',
    'BOMBA HIDRÁULICA MANUAL MERAX CP-700A / 2 estágios / reservatório 2700cc / PRESSÃO 700 Kg/cm² / 10000 psi / 14 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BOMBA HIDRÁULICA MANUAL MERAX CP-700B',
    'BOMBA HIDRÁULICA MANUAL MERAX CP-700B / 2 estágios / reservatório 700cc / PRESSÃO 700 Kg/cm² / 10000 psi / 12 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO CURTO - 10 TONELADAS ',
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO CURTO - 10 TONELADAS  / altura fechado 88 / altura aberto 126 / CURSO 38 / 4,2 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO CURTO - 30 TONELADAS',
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO CURTO - 30 TONELADAS / altura fechado 117 / altura aberto 179 / CURSO 62 / 6,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO LONGO - 10 TONELADAS',
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO LONGO - 10 TONELADAS / altura fechado 171 / altura aberto 276 / CURSO 105 / 3,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO LONGO - 30 TONELADAS',
    'CILINDRO HIDRÁULICO SIMPLES AÇÃO LONGO - 30 TONELADAS / altura fechado 387 / altura aberto 596 / CURSO 209 / 18,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.3'
  AND s.catalog_id = '5.3.7';


-- Família: TALHAS MANUAIS DE CORRENTE
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE ALAVANCA - 5m ELEVAÇÃO - 3 TONELADAS - KOCH',
    'TALHA MANUAL MECÂNICA DE ALAVANCA - 5m ELEVAÇÃO - 3 TONELADAS - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 1 TONELADA  - KOCH',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 1 TONELADA  - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 1 TONELADA  - TC1000 CSM',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 1 TONELADA  - TC1000 CSM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 2 TONELADAS - KOCH',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 3m ELEVAÇÃO - 2 TONELADAS - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 5m ELEVAÇÃO - 2 TONELADAS - KOCH',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 5m ELEVAÇÃO - 2 TONELADAS - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 5m ELEVAÇÃO - 3 TONELADAS - KOCH',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 5m ELEVAÇÃO - 3 TONELADAS - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TALHA MANUAL MECÂNICA DE CORRENTE - 8m ELEVAÇÃO - 2 TONELADAS - KOCH',
    'TALHA MANUAL MECÂNICA DE CORRENTE - 8m ELEVAÇÃO - 2 TONELADAS - KOCH',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.4'
  AND s.catalog_id = '5.4.7';


-- Família: EQUIPAMENTOS DE MOVIMENTAÇÃO E REMOÇÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ANEL COM 2 SUB-ELOS PARA AMARRAÇÃO DE CARGA',
    'ANEL COM 2 SUB-ELOS PARA AMARRAÇÃO DE CARGA / 4 TONELADAS / 3/8" X 9,5mm / COM 2 ELOS DE LIGAÇÃO 2 TONELADAS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARRINHO DE 4 RODAS AÇO CARBONO',
    'CARRINHO DE 4 RODAS AÇO CARBONO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARRINHO DE GÁS PARA CONJUNTO MAÇARICO',
    'CARRINHO DE GÁS PARA CONJUNTO MAÇARICO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARRO ALAVANCA - 3 TONELADAS',
    'CARRO ALAVANCA - 3 TONELADAS / dimensão da cunha     comprimento cabo     diâmetro rodízio',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARRO ARMAZÉM PLATAFORMA DE METAL 150 KG 2 RODAS',
    'CARRO ARMAZÉM PLATAFORMA DE METAL 150 KG 2 RODAS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARRO TROLLEY - 2 TONELADAS',
    'CARRO TROLLEY - 2 TONELADAS / T-2000 / VIGAS "I" 100-150mm / 233 x 240 x 238 mm / 14,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CATRACA MÓVEL COM CINTA PARA AMARRAÇÃO DE CARGA',
    'CATRACA MÓVEL COM CINTA PARA AMARRAÇÃO DE CARGA / 4 TONELADAS / COMPRIMENTO CINTA 9,5m / LARGURA 50mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CAVALETE MECÂNICO 12t',
    'CAVALETE MECÂNICO 12t / altura fechado 495 / altura aberto 745 / 12,1 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CINTA PARA ELEVAÇÃO DE CARGA 2 TONELADAS x 3 METROS',
    'CINTA PARA ELEVAÇÃO DE CARGA 2 TONELADAS x 3 METROS / LARGURA 50mm / VERDE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.9';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CINTA PARA ELEVAÇÃO DE CARGA 2 TONELADAS x 5 METROS',
    'CINTA PARA ELEVAÇÃO DE CARGA 2 TONELADAS x 5 METROS / LARGURA 50mm / VERDE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.10';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'EMPILHADEIRA HIDRÁULICA MANUAL - 1,5 TONELADAS',
    'EMPILHADEIRA HIDRÁULICA MANUAL - 1,5 TONELADAS / 550x1145mm / Altura Fechada 85mm / Altura Aberta 1610mm / 240 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.11';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESTICADOR HIDRÁULICO 6t',
    'ESTICADOR HIDRÁULICO 6t / comprimento fechado 270 - aberto 1255 / CURSO 120 / CUNHA 15 - 90 / 18 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.12';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GUINCHO DE ALAVANCA TIRFOR 3200 Kg',
    'GUINCHO DE ALAVANCA TIRFOR 3200 Kg / CABO 20m x Ø 5/8" / 680x330x95mm / ESFORÇO DE 50 Kg / CURSO ALAVANCA 35mm / 21 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.13';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PRENSA HIDRÁULICA MANUAL MPH-15 - 15 TON',
    'PRENSA HIDRÁULICA MANUAL MPH-15 - 15 TON / 555x350x1510mm / MESA 152x177mm / DISTÂNCIA MESA PISTÃO 133/736mm / CURSO PISTÃO 120mm / 60 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.14';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRANSPALETE HIDRÁULICO MANUAL RODA NYLON - 2 t',
    'TRANSPALETE HIDRÁULICO MANUAL RODA NYLON - 2 t / 680x1200 / AF 80 / AD 180 / 65 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '5'
  AND f.catalog_id = '5.5'
  AND s.catalog_id = '5.5.15';


-- ========== CATEGORIA: MÁQUINAS DE SOLDA E MONTAGEM ==========

-- Família: INVERSORES DE SOLDA TIG
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA BALMER MAXXI ARC 250 PRO',
    'INVERSOR DE SOLDA BALMER MAXXI ARC 250 PRO / TIG-LIFT E MMA  / CORRENTE 10-200A / 220V MONO /  1,6 a 4,00 mm / 200A - 60% - 160A - 100% / Hot-Start, Arc-Force, Anti-Stick, Lift-Arc / PESO 7,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA BAMBOZZI  250A - USINEIRA 251 ULTRA',
    'INVERSOR DE SOLDA BAMBOZZI  250A - USINEIRA 251 ULTRA / TIG e MMA  / CORRENTE 10-250A / 220V MONO /  1,6 a 5,00 mm / 200A @ 100% - 250A @ 60% / Arc-Force, Anti-Stick, / PESO 4,8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA S160.1 TIG 150A',
    'INVERSOR DE SOLDA S160.1 TIG 150A / CORRENTE 5-150A / 220V MONO / 20-26V / 1,6 a 3,25mm / 7,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA SUMIG FOX 165/ 165A',
    'INVERSOR DE SOLDA SUMIG FOX 165/ 165A / CORRENTE 5-160 A / 50/60Hz / MONO / ELETRODO 1,6 a 2,5mm / 5,0 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA TIG',
    'INVERSOR DE SOLDA TIG / TIG200S / 200A / 5,5 KVA / CORRENTE 5-200A / FT 60% / 220V MONO /  9,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'INVERSOR DE SOLDA TIGER 162 - TIG 150A',
    'INVERSOR DE SOLDA TIGER 162 - TIG 150A / CORRENTE 5-150A / 220V MONO / 20-26V / 1,6 a 3,25mm / 7,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.1'
  AND s.catalog_id = '6.1.6';


-- Família: MÁQUINAS DE CORTE PLASMA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MÁQUINA DE CORTE PLASMA MECURY 40',
    'MÁQUINA DE CORTE PLASMA MECURY 40 / CORRENTE 10-40A / 220V MONOFÁSICO / ESP CORTE 8mm / 8 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.2'
  AND s.catalog_id = '6.2.1';


-- Família: MÁQUINAS DE SOLDA MIG/MAG
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALIMENTADOR DE ARAME EXTERNO ORIGOFEED 304 P3',
    'ALIMENTADOR DE ARAME EXTERNO ORIGOFEED 304 P3 / 4 ROLDANAS / 0,8 a 1,6mm / VELOC 1,5-25 m/min / 17,3 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.3'
  AND s.catalog_id = '6.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FONTE DE ENERGIA MIG/MAG SMASHWELD 408 TOPFLEX',
    'FONTE DE ENERGIA MIG/MAG SMASHWELD 408 TOPFLEX / 400A / TRIFÁSICA 380V / 5-420A / FT 100% 300A / 152 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.3'
  AND s.catalog_id = '6.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MÁQUINA DE SOLDA MIG HAWK 208 - 35-200A - 220V MONOFÁSICA - Ø ARAME 0,6 a 0,8 mm - ROLOS DE 5 a 15 Kg - 53 Kg C/ TOCHA MIG SU 220 3,5m EURO CONECTOR',
    'MÁQUINA DE SOLDA MIG HAWK 208 - 35-200A - 220V MONOFÁSICA - Ø ARAME 0,6 a 0,8 mm - ROLOS DE 5 a 15 Kg - 53 Kg C/ TOCHA MIG SU 220 3,5m EURO CONECTOR',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.3'
  AND s.catalog_id = '6.3.3';


-- Família: TRANSFORMADORES DE SOLDA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRANSFORMADOR DE SOLDA ORIGO ARC 328 AC/DC ',
    'TRANSFORMADOR DE SOLDA ORIGO ARC 328 AC/DC  / CORRENTE 60-325A (AC) / 45-250A (DC) MONOFÁSICO 220/380/440V / FT 100% 180A - 35% 325A (AC) / 154 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.4'
  AND s.catalog_id = '6.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRANSFORMADOR DE SOLDA SUPER BANTAM 256 PLUS',
    'TRANSFORMADOR DE SOLDA SUPER BANTAM 256 PLUS / MONOFÁSICO 220V / 50-250A  FT 60% 140A / 250x282x755mm / 41,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.4'
  AND s.catalog_id = '6.4.2';


-- Família: RETIFICADORES DE SOLDA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADOR DE SOLDA ORIGO 406 ',
    'RETIFICADOR DE SOLDA ORIGO 406  / CORRENTE 70-400A / 220/380/440V / 112 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.5'
  AND s.catalog_id = '6.5.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADOR DE SOLDA ORIGO 426 ',
    'RETIFICADOR DE SOLDA ORIGO 426  / CORRENTE 60-425A / TRIFÁSICO 220/380/440V / FT 100% 200A - 30% 425A / 120 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.5'
  AND s.catalog_id = '6.5.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADOR DE SOLDA PÍCCOLA 405 DC',
    'RETIFICADOR DE SOLDA PÍCCOLA 405 DC / CORRENTE 60-400A / 220/380/440V / 130 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.5'
  AND s.catalog_id = '6.5.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RETIFICADOR DE SOLDA S-BANTAM 402 DC',
    'RETIFICADOR DE SOLDA S-BANTAM 402 DC / CORRENTE 60-400A / 220/380/440V / 134 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.5'
  AND s.catalog_id = '6.5.4';


-- Família: TOCHAS MÁQUINAS DE SOLDA/CORTE
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TOCHA MIG SU 220 2001 4,50 EURO CONECTOR',
    'TOCHA MIG SU 220 2001 4,50 EURO CONECTOR',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.6'
  AND s.catalog_id = '6.6.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TOCHA SECA TIG WP-26G ER',
    'TOCHA SECA TIG WP-26G ER / MANGUEIRA 3,5m / C/ GATILHO S/ VÁLVULA / CONECTOR ER 9mm / PORCA GÁS WS / CAPA LONADA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.6'
  AND s.catalog_id = '6.6.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TOCHA SECA TIG WP-26V US',
    'TOCHA SECA TIG WP-26V US / MANGUEIRA 3,5m / C/ VÁLVULA / CONECTOR OLHAL US / MINI EXTENSÃO 1,5m C/ CONECTOR ER 9mm E MANGUEIRA PU10 / CAPA DE RASPA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.6'
  AND s.catalog_id = '6.6.3';


-- Família: REGULADORES DE GAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'REGULADOR DE ARGÔNIO - MANÔMETRO 2.1/2"',
    'REGULADOR DE ARGÔNIO - MANÔMETRO 2.1/2" / PRESSÃO 0-235 KGF/CM² / 1,35 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.7'
  AND s.catalog_id = '6.7.1';


-- Família: CONJUNTOS OXI-ACETILÊNICOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CONJUNTO OXI-ACETILÊNICO, CANETA DE MAÇARICO COM MANGUEIRA DUPLA, VÁLVULAS CORTA FOGO, E REGULADORES DE ACETILENO E OXIGÊNIO',
    'CONJUNTO OXI-ACETILÊNICO, CANETA DE MAÇARICO COM MANGUEIRA DUPLA, VÁLVULAS CORTA FOGO, E REGULADORES DE ACETILENO E OXIGÊNIO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.8'
  AND s.catalog_id = '6.8.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CONJUNTO PPU SOLDA/CORTE, CANETA DE MAÇARICO COM MANGUEIRA DUPLA, VÁLVULAS CORTA FOGO, E REGULADORES DE ACETILENO E OXIGÊNIO',
    'CONJUNTO PPU SOLDA/CORTE, CANETA DE MAÇARICO COM MANGUEIRA DUPLA, VÁLVULAS CORTA FOGO, E REGULADORES DE ACETILENO E OXIGÊNIO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.8'
  AND s.catalog_id = '6.8.2';


-- Família: ALICATES HIDRÁULICOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALICATE HIDRÁULICO MERAX HHY-300D',
    'ALICATE HIDRÁULICO MERAX HHY-300D / ØCABO 50-300mm² / 12 TONELADAS / molde hexagonal / percurso 16mm / 9 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.9'
  AND s.catalog_id = '6.9.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALICATE HIDRÁULICO MERAX YQK-300C',
    'ALICATE HIDRÁULICO MERAX YQK-300C / ØCABO 16-300mm² / 12 TONELADAS / molde C forjado / percurso 30mm / 11 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.9'
  AND s.catalog_id = '6.9.2';


-- Família: ALICATES REBITADORES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALICATE REBITADOR TIPO SANFONA',
    'ALICATE REBITADOR TIPO SANFONA / USO INDUSTRIAL COM 5 BICOS / REBITES 3,2mm (1/8") / 4,0mm (5/32") / 4,8mm (3/16") / 6,0mm (15/64") / 6,4mm (1/4")',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.10'
  AND s.catalog_id = '6.10.1';


-- Família: MARRETAS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MARRETA 5 KG 24"',
    'MARRETA 5 KG 24"',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.11'
  AND s.catalog_id = '6.11.1';


-- Família: SOPRADORES TÉRMICOS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SOPRADOR TÉRMICO D26411 B2',
    'SOPRADOR TÉRMICO D26411 B2 / POTÊNCIA 2000 W / TENSÃO 220V MONO / REGULAGEM DE TEMPERATURA 50 - 600º / FLUXO DE AR 250-500 l/min / BOCAL de 22 mm C/ 2 BICOS / COM SUPORTE APOIO 15º / 2 VELOCIDADES DE ACIONAMENTO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.12'
  AND s.catalog_id = '6.12.1';


-- Família: CHAVES DE TUBULAÇÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE CORRENTE 48" GEDORE',
    'CHAVE CORRENTE 48" GEDORE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.13'
  AND s.catalog_id = '6.13.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE GRIFO 18" GEDORE',
    'CHAVE GRIFO 18" GEDORE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.13'
  AND s.catalog_id = '6.13.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE GRIFO 24" GEDORE',
    'CHAVE GRIFO 24" GEDORE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.13'
  AND s.catalog_id = '6.13.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE GRIFO 36" GEDORE',
    'CHAVE GRIFO 36" GEDORE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.13'
  AND s.catalog_id = '6.13.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE GRIFO 48" GEDORE',
    'CHAVE GRIFO 48" GEDORE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.13'
  AND s.catalog_id = '6.13.5';


-- Família: JOGOS DE SOQUETE
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'JOGO DE SOQUETES SEXTAVADOS 19TMZ',
    'JOGO DE SOQUETES SEXTAVADOS 19TMZ / ENCAIXE 1/2" GEDORE / 23 PEÇAS / 18 SOQUETES 12, 13, 14, 15, 16, 17, 18, 19, 20 21, 22, 23, 24, 26, 27, 28, 30, 32 mm / EXTENSÕES 5" e 10" / CATRACA REVERSÍVEL 1/2" / CABO T 10" / JUNTA UNIVERSAL',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.14'
  AND s.catalog_id = '6.14.1';


-- Família: TORQUÍMETROS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TORQUÍMETRO DE ESTALO MTX-14629',
    'TORQUÍMETRO DE ESTALO MTX-14629 /  ENCAIXE 1/2" / FAIXA TORQUE 70-350 Nm / ESCALA 1 Nm / CABO DE 600mm / CATRACA REVERSÍVEL COM BOTÃO LIBERADOR DE SOQUETE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.15'
  AND s.catalog_id = '6.15.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TORQUÍMETRO DE ESTALO TORKFORT TEC-5012',
    'TORQUÍMETRO DE ESTALO TORKFORT TEC-5012 / ENCAIXE 1/2" / FAIXA TORQUE 5-50 Nm / ESCALA 1 Nm / CABO DE 300mm / UNIDIRECIONAL SEM CATRACA - SENTIDO HORÁRIO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.15'
  AND s.catalog_id = '6.15.2';


-- Família: EXTENSÕES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'EXTENSÃO MONOFÁSICA 30m COM CABO ISOLADO 2 x 6mm²',
    'EXTENSÃO MONOFÁSICA 30m COM CABO ISOLADO 2 x 6mm² / RÉGUA 3 TOMADAS E PLUG MONOFÁSICO 10A',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.16'
  AND s.catalog_id = '6.16.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'EXTENSÃO MONOFÁSICA 60m COM CABO ISOLADO 2 x 6mm²',
    'EXTENSÃO MONOFÁSICA 60m COM CABO ISOLADO 2 x 6mm² / RÉGUA 3 TOMADAS E PLUG MONOFÁSICO 10A',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.16'
  AND s.catalog_id = '6.16.2';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BICOS DE CORTE 1502 ACETILENO',
    'BICOS DE CORTE 1502 ACETILENO / OXIGÊNIO - ( numerações 2, 3, 4, 6 e 8)',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.17'
  AND s.catalog_id = '6.17.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CONSUMO DE GÁS ACETILENO POR KG',
    'CONSUMO DE GÁS ACETILENO POR KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.17'
  AND s.catalog_id = '6.17.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CONSUMO DE GÁS OXIGÊNIO POR KG',
    'CONSUMO DE GÁS OXIGÊNIO POR KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '6'
  AND f.catalog_id = '6.17'
  AND s.catalog_id = '6.17.3';


-- ========== CATEGORIA: CONSERVAÇÃO E LIMPEZA ==========

-- Família: LAVADORAS DE ALTA PRESSÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'HIDROLAVADORA ALTA PRESSÃO À GASOLINA - BUFFALO BFG 4000',
    'HIDROLAVADORA ALTA PRESSÃO À GASOLINA - BUFFALO BFG 4000 / MOTOR 4T - POTÊNCIA 15 HP / PRESSÃO 276 BAR - 4000 psi / VAZÃO 13,6 l/min / PARTIDA MANUAL RETRÁTIL / 60 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.1'
  AND s.catalog_id = '7.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'HIDROLAVADORA ELÉTRICA KARCHER HD585',
    'HIDROLAVADORA ELÉTRICA KARCHER HD585 / 2200W / 220V MONOFÁSICA / 1600psi / 2 HP / 500 l/h / DIMENSÕES 570x320x330 / 17 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.1'
  AND s.catalog_id = '7.1.2';


-- Família: ENCERADEIRAS DE PISO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ENCERADEIRA ALLCLEAN 35',
    'ENCERADEIRA ALLCLEAN 35 / ESCOVA 35cm / 220V MONOFÁSICO / 1/2 HP / 175 rpm / RENDIMENTO 1000 m²/h / 25 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.2'
  AND s.catalog_id = '7.2.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ENCERADEIRA ALLCLEAN 51',
    'ENCERADEIRA ALLCLEAN 51 / ESCOVA 51cm / 220V MONOFÁSICO / 1 HP / 175 rpm / RENDIMENTO 1500 m²/h / 36 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.2'
  AND s.catalog_id = '7.2.2';


-- Família: ASPIRADORES DE PÓ
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ASPIRADOR DE PÓ E LÍQUIDO INDUSTRIAL BOSCH GAS 12-25 PL',
    'ASPIRADOR DE PÓ E LÍQUIDO INDUSTRIAL BOSCH GAS 12-25 PL / RESERVATÓRIO 25 L / TENSÃO 220V MONOFÁSICO / POTÊNCIA 1250W / 200 Mbar PRESSÃO DE VÁCUO / VAZÃO DE AR 65 l/s',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.3'
  AND s.catalog_id = '7.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ASPIRADOR DE PÓ E LÍQUIDO KARCHER NT20/1',
    'ASPIRADOR DE PÓ E LÍQUIDO KARCHER NT20/1 / 1400W / 220V MONOFÁSCIO / RESERVATÓRIO 20l / VÁCUO 170 mbar / VAZÃO 65 l/min',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.3'
  AND s.catalog_id = '7.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ASPIRADOR DE PÓ SH7000 MONSTRÃO STONE HAMMER',
    'ASPIRADOR DE PÓ SH7000 MONSTRÃO STONE HAMMER / 220V MONOFÁSCIO / 750W / 1500 prm C/ 5 NÍVEIS DE VELOCIDADE / PRESSÃO AR 5,5 Kpa / C/ SACO COLETOR DE 70 LITROS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.3'
  AND s.catalog_id = '7.3.3';


-- Família: NEBULIZADORES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'NEBULIZADOR',
    'NEBULIZADOR / ATOMIZADOR - GUARANY - NAF 0445 / POTÊNCIA 1200W / TENSÃO 220V MONO / ROTAÇÃO 17.200 - 21.100 rpm / VOLUME TANQUE 4 litros / ALCANCE MÁX HORIZONTAL 11m - VERTICAL 8m / VAZÃO MÁX 400 ml/min - MÍNIMA 15 ml/min / TAMANHO MÍNIMO GOTAS DMV (micra): 29 µm / PESO 5,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.4'
  AND s.catalog_id = '7.4.1';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BUCHA LIMPEZA PESADA ( BRANCA ) - Ø51cm',
    'BUCHA LIMPEZA PESADA ( BRANCA ) - Ø51cm / VENDA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BUCHA LIMPEZA PESADA ( PRETA ) - Ø35cm',
    'BUCHA LIMPEZA PESADA ( PRETA ) - Ø35cm / VENDA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BUCHA LIMPEZA PESADA ( PRETA ) - Ø51cm',
    'BUCHA LIMPEZA PESADA ( PRETA ) - Ø51cm / VENDA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'DESINFETANTE HOSPITALAR - MIRAX OXY - RENKO',
    'DESINFETANTE HOSPITALAR - MIRAX OXY - RENKO / COMBATE COVID-19 / PROPORÇÃO DILUIÇÃO 1:100 / 40 ml PARA CADA 4 litros / UTILIZAR NEBULIZADOR GUARANY NAF 0445 - PET DE 200 ml',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCOVA DE NYLON 35cm COM FLANGE',
    'ESCOVA DE NYLON 35cm COM FLANGE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCOVA DE NYLON 51cm COM FLANGE',
    'ESCOVA DE NYLON 51cm COM FLANGE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCOVA MISTA DE AÇO',
    'ESCOVA MISTA DE AÇO / NYLON - Ø 51 cm / LIMPEZA PESADA - LOCAÇÃO POR MILÍMETRO / VENDA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FILTRO DE CARTUCHO PARA ASPIRADOR DE PÓ BOSCH GAS 12-25 PL ',
    'FILTRO DE CARTUCHO PARA ASPIRADOR DE PÓ BOSCH GAS 12-25 PL  /  PREÇO POR UNIDADE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FILTRO DE PANO LAVÁVEL ASPIRADOR DE PÓ BOSCH GAS 12-25 PL ',
    'FILTRO DE PANO LAVÁVEL ASPIRADOR DE PÓ BOSCH GAS 12-25 PL  /  PREÇO POR UNIDADE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.9';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FILTRO DE PAPEL PARA ASPIRADOR DE PÓ 20L ',
    'FILTRO DE PAPEL PARA ASPIRADOR DE PÓ 20L  /  PREÇO POR UNIDADE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '7'
  AND f.catalog_id = '7.5'
  AND s.catalog_id = '7.5.10';


-- ========== CATEGORIA: EQUIPAMENTOS DE ACESSO A ALTURA ==========

-- Família: ANDAIMES TUBULARES
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ANDAIME TUBULAR 1,0M - ATP1 1,0 x 1,0M S/ ESCADA - AC SAE 1020 - NBR6494',
    'ANDAIME TUBULAR 1,0M - ATP1 1,0 x 1,0M S/ ESCADA - AC SAE 1020 - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ANDAIME TUBULAR 1,5M - ATP2 1,0 x 1,50M S/ ESCADA - AC SAE 1020 - NBR6494',
    'ANDAIME TUBULAR 1,5M - ATP2 1,0 x 1,50M S/ ESCADA - AC SAE 1020 - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA ACESSO ANDAIME - ALTURA H=1m - 4 DEGRAUS - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    'ESCADA ACESSO ANDAIME - ALTURA H=1m - 4 DEGRAUS - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA ACESSO ANDAIME - ALTURA H=2m - 8 DEGRAUS - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    'ESCADA ACESSO ANDAIME - ALTURA H=2m - 8 DEGRAUS - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GUARDA CORPO/RODAPÉ 1,0M - ATP1 CONJUNTO C/ 4 PEÇAS - AÇO CARBONO SAE 1020 - NBR6494 / NR18',
    'GUARDA CORPO/RODAPÉ 1,0M - ATP1 CONJUNTO C/ 4 PEÇAS - AÇO CARBONO SAE 1020 - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'GUARDA CORPO/RODAPÉ 1,5M - ATP2 CONJUNTO C/ 4 PEÇAS - AÇO CARBONO SAE 1020 - NBR6494 / NR18',
    'GUARDA CORPO/RODAPÉ 1,5M - ATP2 CONJUNTO C/ 4 PEÇAS - AÇO CARBONO SAE 1020 - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.6';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PISO DE PLATAFORMA 1,0M - ATP1 33cm  - AÇO CARBONO SAE 1020 PINTADO - NBR6494',
    'PISO DE PLATAFORMA 1,0M - ATP1 33cm  - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.7';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PISO DE PLATAFORMA 1,5M - ATP2 37cm  - AÇO CARBONO SAE 1020 PINTADO - NBR6494',
    'PISO DE PLATAFORMA 1,5M - ATP2 37cm  - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.8';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'RODÍZIO BORRACHA C/ ROLAMENTO E FREIO - GME-62BFL 6x2 NR18',
    'RODÍZIO BORRACHA C/ ROLAMENTO E FREIO - GME-62BFL 6x2 NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.9';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SAPATA AJUSTÁVEL - AÇO CARBONO SAE 1020 PINTADO - NBR6494',
    'SAPATA AJUSTÁVEL - AÇO CARBONO SAE 1020 PINTADO - NBR6494 / NR18 C/ TRAVA E PORCA DE AJUSTE',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.10';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SAPATA FIXA - AÇO CARBONO SAE 1020 PINTADO S/ TRAVA',
    'SAPATA FIXA - AÇO CARBONO SAE 1020 PINTADO S/ TRAVA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.11';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRAVA DIAGONAL ATP1 1,0m - AC SAE 1020 PINTADO - NBR6494',
    'TRAVA DIAGONAL ATP1 1,0m - AC SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.12';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRAVA DIAGONAL ATP2 1,5m - AC SAE 1020 PINTADO - NBR6494',
    'TRAVA DIAGONAL ATP2 1,5m - AC SAE 1020 PINTADO - NBR6494 / NR18',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.1'
  AND s.catalog_id = '8.1.13';


-- Família: ESCADAS EXTENSÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EAFRD -39',
    'ESCADA EXTENSÍVEL EAFRD -39 / REBITADA FIBRA DE VIDRO / 7,20 X 12,00M / 39 DEGRAUS / 39,6 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EAFV -33',
    'ESCADA EXTENSÍVEL EAFV -33 / VAZADA FIBRA DE VIDRO /  5,70 x 10,20m / 33 DEGRAUS / 30 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EF-15',
    'ESCADA EXTENSÍVEL EF-15 / FIBRA DE VIDRO 3,00 x 4,80m / 15 DEGRAUS / 17,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EF-21',
    'ESCADA EXTENSÍVEL EF-21 / FIBRA DE VIDRO 3,90 x 6,60m / 21 DEGRAUS / 21,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.4';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EF-26',
    'ESCADA EXTENSÍVEL EF-26 / FIBRA DE VIDRO 4,80 x 8,10m / 26 DEGRAUS / 26,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.5';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA EXTENSÍVEL EF-33',
    'ESCADA EXTENSÍVEL EF-33 / FIBRA DE VIDRO 6,00 x 10,20m / 33 DEGRAUS / 32 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.2'
  AND s.catalog_id = '8.2.6';


-- Família: ESCADAS TESOURA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA MULTIUSO FMS 8/16',
    'ESCADA MULTIUSO FMS 8/16 / FIBRA DE VIDRO 2,40 x 5,00m / 8/16 DEGRUAS / 16,5 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.3'
  AND s.catalog_id = '8.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA MULTIUSO TESOURA FT-08',
    'ESCADA MULTIUSO TESOURA FT-08 / FIBRA DE VIDRO 2,60m / 8 DEGRAUS / 18 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.3'
  AND s.catalog_id = '8.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA TESOURA FT-13',
    'ESCADA TESOURA FT-13 / FIBRA DE VIDRO 4,10m / 14 DEGRAUS / 28,6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.3'
  AND s.catalog_id = '8.3.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ESCADA TESOURA TAF-11',
    'ESCADA TESOURA TAF-11 / REBITADA FIBRA DE VIDRO / 3,04M / 11 DEGRAUS / 16,6 KG',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.3'
  AND s.catalog_id = '8.3.4';


-- Família: ACESSÓRIOS DE SEGURANÇA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CINTO DE SEGURANÇA PARAQUEDISTA C/ 02 TALABARTES',
    'CINTO DE SEGURANÇA PARAQUEDISTA C/ 02 TALABARTES',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.4'
  AND s.catalog_id = '8.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'TRAVA QUEDAS',
    'TRAVA QUEDAS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '8'
  AND f.catalog_id = '8.4'
  AND s.catalog_id = '8.4.2';


-- ========== CATEGORIA: EQUIPAMENTOS AGRÍCOLAS ==========

-- Família: MOTOSSERRAS GASOLINA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'MOTOSSERRA TCS53 TOYAMA',
    'MOTOSSERRA TCS53 TOYAMA / SABRE 18" / POTÊNCIA 49,2 CC / CORRENTE 64 ELOS 32 DENTES C/ PASSO 3/8" CALIBRE 0,58" / MOTOR GASOLINA 2 TEMPOS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.1'
  AND s.catalog_id = '9.1.1';


-- Família: ROÇADEIRAS LATERAIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ROÇADEIRA LATERAL TBC43X -  42,7 CC TOYAMA - GASOLINA 2 TEMPOS - 1,7 HP - 42 CM CORTE - 6,7 Kg',
    'ROÇADEIRA LATERAL TBC43X -  42,7 CC TOYAMA - GASOLINA 2 TEMPOS - 1,7 HP - 42 CM CORTE - 6,7 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.2'
  AND s.catalog_id = '9.2.1';


-- Família: PERFURADORES DE SOLO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALONGADOR P/ PERFURADOR BFG 520 - 100 cm',
    'ALONGADOR P/ PERFURADOR BFG 520 - 100 cm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.3'
  AND s.catalog_id = '9.3.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'ALONGADOR P/ PERFURADOR BFG 520 - 60 cm',
    'ALONGADOR P/ PERFURADOR BFG 520 - 60 cm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.3'
  AND s.catalog_id = '9.3.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PERFURADOR DE SOLO BUFFALO BFG 520 SB',
    'PERFURADOR DE SOLO BUFFALO BFG 520 SB / GASOLINA 2 TEMPOS / 2 HP - 52 CC / Ø BROCA 25cm / EXTENSORES DE 60 e 100cm / PROFUNDIDADE MÁXIMA 2,5m / 13 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.3'
  AND s.catalog_id = '9.3.3';


-- Família: FURADEIRAS DE MOURÃO
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FURADEIRA DE MOURÃO TPD23 TOYAMA',
    'FURADEIRA DE MOURÃO TPD23 TOYAMA / MANDRIL DE APERTO 1/2" / POTÊNCIA 23 CC - 1 HP / C/ REVERSÃO / MOTOR GASOLINA  2 TEMPOS',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.4'
  AND s.catalog_id = '9.4.1';


-- Família: CORTADORES DE GRAMA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORTADOR DE GRAMA TLM560SMB-65XP GASOLINA 4 TEMPOS - LÂMINA 56 CM',
    'CORTADOR DE GRAMA TLM560SMB-65XP GASOLINA 4 TEMPOS - LÂMINA 56 CM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.5'
  AND s.catalog_id = '9.5.1';


-- Família: SOPRADORES DE FOLHA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'SOPRADOR DE FOLHAS TB57B - GASOLINA 2 TEMPOS - 3,3 HP 56,5 CC - 12000 rpm - 0,3 m³/s - 12Kg',
    'SOPRADOR DE FOLHAS TB57B - GASOLINA 2 TEMPOS - 3,3 HP 56,5 CC - 12000 rpm - 0,3 m³/s - 12Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.6'
  AND s.catalog_id = '9.6.1';


-- Família: PODADORES DE CERCA VIVA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PODADOR DE CERCA VIVA TOYAMA THT 26X - GASOLINA 2 TEMPOS - POTÊNCIA 1 HP - 25,4CC / 6500 rpm / COMPRIMENTO LÂMINA 600mm / LARGURA DE CORTE 35mm / PESO 6 Kg',
    'PODADOR DE CERCA VIVA TOYAMA THT 26X - GASOLINA 2 TEMPOS - POTÊNCIA 1 HP - 25,4CC / 6500 rpm / COMPRIMENTO LÂMINA 600mm / LARGURA DE CORTE 35mm / PESO 6 Kg',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.7'
  AND s.catalog_id = '9.7.1';


-- Família: CONSUMÍVEIS
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CORRENTE P/ MOTOSSERRA',
    'CORRENTE P/ MOTOSSERRA',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.8'
  AND s.catalog_id = '9.8.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'FIO DE NYLON Ø3mm  ',
    'FIO DE NYLON Ø3mm   /   VENDA POR METRO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.8'
  AND s.catalog_id = '9.8.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'LÂMINA DE AÇO 2 PONTAS',
    'LÂMINA DE AÇO 2 PONTAS / 350x25,4x1,7mm',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '9'
  AND f.catalog_id = '9.8'
  AND s.catalog_id = '9.8.3';


-- ========== CATEGORIA: FERRAMENTAS À BATERIA ==========

-- Família: PARAFUSADEIRAS À BATERIA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PARAFUSADEIRA À BATERIA DCF622B',
    'PARAFUSADEIRA À BATERIA DCF622B / MANDRIL HEXAGONAL 1/4" 6,35mm C/ CONTROLE DE TORQUE 0-26 Nm / 20V MAX LI-ION / BRUSHLESS /  0-2000 rpm / LUZ LED / 2,2 Kg / ACOMPANHA 1 BATERIA + 1 CARREGADOR',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.1'
  AND s.catalog_id = '10.1.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'PARAFUSADEIRA Á BATERIA GSR 120 - LI',
    'PARAFUSADEIRA Á BATERIA GSR 120 - LI / CONTROLE DE TORQUE / MANDRIL DE APERTO / 12V LITIO / 14-30 NM',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.1'
  AND s.catalog_id = '10.1.2';


-- Família: NÍVEIS LASER À BATERIA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'NIVEL A LASER DCLE 34030 GB',
    'NIVEL A LASER DCLE 34030 GB / LINHA VERDE / RAIO DE AÇÃO ATÉ 70 M / ACOMPANHA 2 BATERIAS + 1 CARREGADOR',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.3'
  AND s.catalog_id = '10.3.1';


-- Família: BATERIAS LI-ION
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BATERIA LI-ION BOSCH',
    'BATERIA LI-ION BOSCH / 12V MAX / 1.5 Ah',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.4'
  AND s.catalog_id = '10.4.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BATERIA LI-ION BOSCH',
    'BATERIA LI-ION BOSCH / 12V MAX / 2 Ah',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.4'
  AND s.catalog_id = '10.4.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BATERIA LI-ION DEWALT DCB203-B3',
    'BATERIA LI-ION DEWALT DCB203-B3 / 20V MAX / 2 Ah /',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.4'
  AND s.catalog_id = '10.4.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'BATERIA LI-ION DEWALT DCB204-B3',
    'BATERIA LI-ION DEWALT DCB204-B3 / 20V MAX / 4 Ah /',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.4'
  AND s.catalog_id = '10.4.4';


-- Família: CARREGADORES DE BATERIA LI-ION
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARREGADOR DE BATERIA LI-ION BOSCH GAL 12V-20',
    'CARREGADOR DE BATERIA LI-ION BOSCH GAL 12V-20 / 3,6A - 12V',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.5'
  AND s.catalog_id = '10.5.1';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB1104-BR',
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB1104-BR / 20V MAX',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.5'
  AND s.catalog_id = '10.5.2';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB115-BR',
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB115-BR / 20V MAX / RÁPIDO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.5'
  AND s.catalog_id = '10.5.3';

INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB118-BR',
    'CARREGADOR DE BATERIA LI-ION DEWALT DCB118-BR / 20V MAX / RÁPIDO',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.5'
  AND s.catalog_id = '10.5.4';


-- Família: CHAVES DE IMPACTO À BATERIA
INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    'CHAVE DE IMPACTO 1/2" À BATERIA DCF922',
    'CHAVE DE IMPACTO 1/2" À BATERIA DCF922 / ENCAIXE QUADRADO 1/2" (13mm) C/ CONTROLE DE TORQUE 0-406 Nm / BATERIA 20V MAX LI-ION - ATOMIC / BRUSHLESS /  0-2500 rpm / 4 VELOCIDADES / LUZ LED / 2,2 Kg / ACOMPANHA 1 BATERIA + 1 CARREGADOR',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '10'
  AND f.catalog_id = '10.6'
  AND s.catalog_id = '10.6.1';


-- =====================================================
-- FIM DO SCRIPT
-- Total de produtos a serem criados: 272
-- =====================================================
