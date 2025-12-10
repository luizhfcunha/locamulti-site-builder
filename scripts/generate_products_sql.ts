/**
 * Generate SQL Script for Product Recreation
 * Creates a SQL file that can be executed in Supabase Dashboard
 * Run with: npx tsx scripts/generate_products_sql.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface Subfamily {
    id: string;
    description: string;
    is_consumable: boolean;
}

interface Family {
    id: string;
    name: string;
    slug: string;
    subfamilies: Subfamily[];
}

interface Category {
    id: string;
    name: string;
    slug: string;
    families: Family[];
}

interface CatalogData {
    catalog: Category[];
}

function escapeSQL(str: string): string {
    return str.replace(/'/g, "''");
}

function generateSQL() {
    console.log('Gerando SQL para recriação de produtos...\n');

    // Load catalog JSON
    const catalogPath = path.join(process.cwd(), 'catalogo_locamulti_2026_pdf_ids_com_consumiveis.json');

    if (!fs.existsSync(catalogPath)) {
        console.error('Erro: Arquivo de catálogo não encontrado:', catalogPath);
        process.exit(1);
    }

    const catalogData: CatalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

    let sql = `-- =====================================================
-- SQL para Recriação de Produtos - LocaMulti
-- Gerado em: ${new Date().toISOString()}
-- Execute este script no Supabase Dashboard > SQL Editor
-- =====================================================

-- PASSO 1: Excluir todos os produtos existentes
DELETE FROM products;

-- PASSO 2: Criar produtos a partir das subfamílias do catálogo
-- Cada subfamília se torna um produto vinculado corretamente

`;

    let productCount = 0;

    for (const category of catalogData.catalog) {
        sql += `\n-- ========== CATEGORIA: ${category.name} ==========\n`;

        for (const family of category.families) {
            sql += `\n-- Família: ${family.name}\n`;

            for (const subfamily of family.subfamilies) {
                // Extract product name (first part of description)
                let productName = subfamily.description;
                const dashIndex = productName.indexOf(' / ');
                if (dashIndex > 0 && dashIndex < 80) {
                    productName = productName.substring(0, dashIndex);
                }

                const escapedName = escapeSQL(productName);
                const escapedDescription = escapeSQL(subfamily.description);

                sql += `INSERT INTO products (name, description, category_id, family_id, subcategory_id, active)
SELECT 
    '${escapedName}',
    '${escapedDescription}',
    c.id,
    f.id,
    s.id,
    true
FROM categories c
JOIN families f ON f.category_id = c.id
JOIN subfamilies s ON s.family_id = f.id
WHERE c.catalog_id = '${category.id}'
  AND f.catalog_id = '${family.id}'
  AND s.catalog_id = '${subfamily.id}';

`;
                productCount++;
            }
        }
    }

    sql += `
-- =====================================================
-- FIM DO SCRIPT
-- Total de produtos a serem criados: ${productCount}
-- =====================================================
`;

    // Write SQL file
    const outputPath = path.join(process.cwd(), 'supabase', 'migrations', 'recreate_products.sql');
    fs.writeFileSync(outputPath, sql);

    console.log(`✅ SQL gerado com sucesso!`);
    console.log(`📄 Arquivo: ${outputPath}`);
    console.log(`📊 Total de produtos: ${productCount}`);
    console.log(`\nPróximos passos:`);
    console.log(`1. Abra o Supabase Dashboard`);
    console.log(`2. Vá em SQL Editor`);
    console.log(`3. Cole o conteúdo do arquivo ou execute-o`);
}

generateSQL();
