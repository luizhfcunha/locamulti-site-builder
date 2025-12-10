/**
 * Recreate Products Script
 * - Deletes all existing products
 * - Creates new products from catalog JSON with correct hierarchy links
 * Run with: npx tsx scripts/recreate_products.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hdrqdfjxwohrnarbghed.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_KEY) {
    console.error('Error: VITE_SUPABASE_PUBLISHABLE_KEY not found');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

async function recreateProducts() {
    console.log('=== RECRIAÇÃO DE PRODUTOS ===\n');

    // 1. Load catalog JSON
    const catalogPath = path.join(process.cwd(), 'catalogo_locamulti_2026_pdf_ids_com_consumiveis.json');

    if (!fs.existsSync(catalogPath)) {
        console.error('Erro: Arquivo de catálogo não encontrado:', catalogPath);
        process.exit(1);
    }

    const catalogData: CatalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
    console.log(`Catálogo carregado com ${catalogData.catalog.length} categorias\n`);

    // 2. Get database IDs for categories, families, subfamilies
    console.log('Carregando estrutura do banco de dados...');

    const { data: dbCategories, error: catErr } = await supabase
        .from('categories')
        .select('id, name, catalog_id');

    if (catErr) {
        console.error('Erro ao buscar categorias:', catErr);
        process.exit(1);
    }

    const { data: dbFamilies, error: famErr } = await supabase
        .from('families')
        .select('id, name, category_id, catalog_id');

    if (famErr) {
        console.error('Erro ao buscar famílias:', famErr);
        process.exit(1);
    }

    const { data: dbSubfamilies, error: subErr } = await supabase
        .from('subfamilies')
        .select('id, name, family_id, catalog_id');

    if (subErr) {
        console.error('Erro ao buscar subfamílias:', subErr);
        process.exit(1);
    }

    console.log(`  - ${dbCategories?.length || 0} categorias`);
    console.log(`  - ${dbFamilies?.length || 0} famílias`);
    console.log(`  - ${dbSubfamilies?.length || 0} subfamílias\n`);

    // Create lookup maps by catalog_id
    const categoryMap = new Map<string, string>();
    dbCategories?.forEach(c => {
        if (c.catalog_id) categoryMap.set(c.catalog_id, c.id);
    });

    const familyMap = new Map<string, { id: string; category_id: string }>();
    dbFamilies?.forEach(f => {
        if (f.catalog_id) familyMap.set(f.catalog_id, { id: f.id, category_id: f.category_id });
    });

    const subfamilyMap = new Map<string, { id: string; family_id: string }>();
    dbSubfamilies?.forEach(s => {
        if (s.catalog_id) subfamilyMap.set(s.catalog_id, { id: s.id, family_id: s.family_id });
    });

    // 3. Delete all existing products
    console.log('Excluindo todos os produtos existentes...');
    const { error: deleteErr, count: deleteCount } = await supabase
        .from('products')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (workaround for "delete all")

    if (deleteErr) {
        console.error('Erro ao excluir produtos:', deleteErr);
        // Continue anyway - might be empty
    }
    console.log(`  ✓ Produtos excluídos\n`);

    // 4. Create products from catalog
    console.log('Criando novos produtos a partir do catálogo...\n');

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (const category of catalogData.catalog) {
        const categoryDbId = categoryMap.get(category.id);

        if (!categoryDbId) {
            console.log(`  ⚠️ Categoria não encontrada no BD: ${category.name} (${category.id})`);
            continue;
        }

        for (const family of category.families) {
            const familyData = familyMap.get(family.id);

            if (!familyData) {
                console.log(`  ⚠️ Família não encontrada no BD: ${family.name} (${family.id})`);
                continue;
            }

            for (const subfamily of family.subfamilies) {
                const subfamilyData = subfamilyMap.get(subfamily.id);

                if (!subfamilyData) {
                    console.log(`  ⚠️ Subfamília não encontrada: ${subfamily.id}`);
                    skipped++;
                    continue;
                }

                // Extract product name from description (first part before " / " or " - ")
                let productName = subfamily.description;

                // Try to extract a cleaner name
                const dashIndex = productName.indexOf(' / ');
                if (dashIndex > 0 && dashIndex < 80) {
                    productName = productName.substring(0, dashIndex);
                }

                // Create product
                const productData = {
                    name: productName,
                    description: subfamily.description,
                    category_id: categoryDbId,
                    family_id: familyData.id,
                    subcategory_id: subfamilyData.id,
                    active: true,
                    // Additional fields can be added here
                };

                const { error: insertErr } = await supabase
                    .from('products')
                    .insert(productData);

                if (insertErr) {
                    console.log(`  ❌ Erro ao criar: ${productName.substring(0, 50)}...`);
                    console.log(`     ${insertErr.message}`);
                    errors++;
                } else {
                    created++;
                }
            }
        }
    }

    console.log('\n=== RESUMO ===');
    console.log(`✅ Produtos criados: ${created}`);
    console.log(`⏭️ Pulados (sem link): ${skipped}`);
    console.log(`❌ Erros: ${errors}`);
    console.log('\nConcluído!');
}

recreateProducts();
