import { Category, Family, Product } from '@/types/catalog';
import catalogJson from '../../locamulti_produtos.json';
import { findImageForProduct } from '@/utils/imageMatcher';

// Helper to generate slug from name
const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
};

// Transform JSON structure to typed catalog
// Structure: categorias[] → familias[] → equipamentos[]
const transformCatalog = (): Category[] => {
    const rawCategories = (catalogJson as any).categorias || [];

    return rawCategories.map((cat: any) => {
        const categorySlug = slugify(cat.nome);

        const families: Family[] = (cat.familias || []).map((fam: any) => {
            const familySlug = slugify(fam.nome);

            const products: Product[] = (fam.equipamentos || []).map((eq: any) => {
                // Check if it's a consumable based on description OR tipo field
                const isConsumable = eq.descricao?.toUpperCase() === 'CONSUMÍVEL' || eq.tipo === 'consumivel';
                const matchedImage = findImageForProduct(eq.nome, eq.descricao);

                return {
                    id: eq.ordem || `${categorySlug}-${familySlug}-${slugify(eq.nome)}`,
                    order: eq.ordem ? String(eq.ordem) : undefined,
                    name: eq.nome,
                    description: isConsumable ? undefined : eq.descricao,
                    isConsumable,
                    categoryOrder: cat.ordem,
                    category: cat.nome,
                    categorySlug,
                    familyOrder: String(fam.ordem),
                    family: fam.nome,
                    familySlug,
                    image_url: matchedImage || undefined,
                } as Product;
            });

            return {
                order: String(fam.ordem),
                name: fam.nome,
                slug: familySlug,
                products,
            } as Family;
        });

        return {
            order: cat.ordem,
            name: cat.nome,
            slug: categorySlug,
            families,
        } as Category;
    });
};

const catalogData: Category[] = transformCatalog();

export default catalogData;

export const getAllCategories = (): Category[] => {
    return catalogData;
};

export const getAllProducts = (): Product[] => {
    const products: Product[] = [];

    catalogData.forEach(category => {
        category.families.forEach(family => {
            family.products.forEach(product => {
                products.push(product);
            });
        });
    });

    // Sort: equipments first, consumables last, both by order
    return products.sort((a, b) => {
        // First sort by consumable status
        if (a.isConsumable !== b.isConsumable) {
            return a.isConsumable ? 1 : -1;
        }
        // Then sort by order field
        const orderA = a.order || "";
        const orderB = b.order || "";
        return orderA.localeCompare(orderB, undefined, { numeric: true, sensitivity: 'base' });
    });
};

export const getEquipmentById = (id: string): Product | undefined => {
    const allProducts = getAllProducts();
    return allProducts.find(p => p.id === id);
};
