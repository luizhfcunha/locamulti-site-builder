/**
 * Analyze Products Script
 * Checks product links to categories, families, and subfamilies
 * Run with: npx tsx scripts/analyze_products.ts
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Using environment variables from .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hdrqdfjxwohrnarbghed.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_KEY) {
    console.error('Error: VITE_SUPABASE_PUBLISHABLE_KEY not found in environment');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function analyzeProducts() {
    console.log('=== ANÁLISE DE PRODUTOS ===\n');

    // 1. Get all products
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, category_id, family_id, subcategory_id, active')
        .order('name');

    if (prodError) {
        console.error('Erro ao buscar produtos:', prodError);
        return;
    }

    console.log(`Total de produtos: ${products.length}\n`);

    // 2. Get all categories, families, subfamilies
    const { data: categories } = await supabase.from('categories').select('id, name');
    const { data: families } = await supabase.from('families').select('id, name, category_id');
    const { data: subfamilies } = await supabase.from('subfamilies').select('id, name, family_id');

    console.log(`Categorias: ${categories?.length || 0}`);
    console.log(`Famílias: ${families?.length || 0}`);
    console.log(`Subfamílias: ${subfamilies?.length || 0}\n`);

    // 3. Analyze product links
    let noCategory = 0;
    let noFamily = 0;
    let noSubfamily = 0;
    let invalidCategory = 0;
    let invalidFamily = 0;
    let invalidSubfamily = 0;
    let fullyLinked = 0;

    const problematicProducts: any[] = [];

    for (const product of products) {
        const issues: string[] = [];

        // Check category
        if (!product.category_id) {
            noCategory++;
            issues.push('SEM CATEGORIA');
        } else {
            const cat = categories?.find(c => c.id === product.category_id);
            if (!cat) {
                invalidCategory++;
                issues.push('CATEGORIA INVÁLIDA');
            }
        }

        // Check family
        if (!product.family_id) {
            noFamily++;
            issues.push('SEM FAMÍLIA');
        } else {
            const fam = families?.find(f => f.id === product.family_id);
            if (!fam) {
                invalidFamily++;
                issues.push('FAMÍLIA INVÁLIDA');
            } else if (product.category_id && fam.category_id !== product.category_id) {
                issues.push('FAMÍLIA NÃO PERTENCE À CATEGORIA');
            }
        }

        // Check subfamily (subcategory_id)
        if (!product.subcategory_id) {
            noSubfamily++;
            issues.push('SEM SUBFAMÍLIA');
        } else {
            const sub = subfamilies?.find(s => s.id === product.subcategory_id);
            if (!sub) {
                invalidSubfamily++;
                issues.push('SUBFAMÍLIA INVÁLIDA');
            } else if (product.family_id && sub.family_id !== product.family_id) {
                issues.push('SUBFAMÍLIA NÃO PERTENCE À FAMÍLIA');
            }
        }

        if (issues.length === 0) {
            fullyLinked++;
        } else {
            problematicProducts.push({
                id: product.id,
                name: product.name,
                issues: issues.join(', ')
            });
        }
    }

    console.log('=== RESUMO ===');
    console.log(`✅ Produtos totalmente vinculados: ${fullyLinked}`);
    console.log(`❌ Sem categoria: ${noCategory}`);
    console.log(`❌ Sem família: ${noFamily}`);
    console.log(`❌ Sem subfamília: ${noSubfamily}`);
    console.log(`⚠️ Categoria inválida: ${invalidCategory}`);
    console.log(`⚠️ Família inválida: ${invalidFamily}`);
    console.log(`⚠️ Subfamília inválida: ${invalidSubfamily}`);
    console.log(`\n📋 Produtos com problemas: ${problematicProducts.length}\n`);

    if (problematicProducts.length > 0) {
        console.log('=== LISTA DE PRODUTOS COM PROBLEMAS ===\n');
        problematicProducts.slice(0, 50).forEach((p, i) => {
            console.log(`${i + 1}. ${p.name}`);
            console.log(`   Problemas: ${p.issues}`);
            console.log(`   ID: ${p.id}\n`);
        });

        if (problematicProducts.length > 50) {
            console.log(`... e mais ${problematicProducts.length - 50} produtos com problemas.`);
        }
    }

    // 4. Export for fixing
    console.log('\n=== PARA CORREÇÃO ===');
    console.log('Os produtos precisam ser vinculados às subfamílias do catálogo.');
    console.log('Opções:');
    console.log('1. Vincular manualmente via admin/produtos');
    console.log('2. Criar script de mapeamento automático baseado em nome');
}

analyzeProducts();
