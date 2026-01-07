import { Category, Family, Product } from '@/types/catalog';
import catalogJson from '../../scripts/catalogo_locamulti_2026.json';
import { findImageForProduct } from '@/utils/imageMatcher';

// Transform JSON structure to typed catalog
// New structure: catalog[] → families[] → subfamilies[] (products)
const transformCatalog = (): Category[] => {
    const rawCatalog = (catalogJson as any).catalog || [];

    return rawCatalog.map((cat: any) => {
        const families: Family[] = (cat.families || []).map((fam: any) => {
            const products: Product[] = (fam.subfamilies || []).map((item: any) => {
                // In new JSON, "description" contains the product name + specs
                // Extract product name from description (before the first " - " or " / ")
                const fullDesc = item.description || '';
                const nameParts = fullDesc.split(' - ');
                const productName = nameParts[0].trim();
                const specs = nameParts.length > 1 ? nameParts.slice(1).join(' - ').trim() : '';

                const matchedImage = findImageForProduct(productName);

                return {
                    id: item.id,
                    order: item.id, // Use id as order (e.g., "1.1.1", "1.1.2")
                    name: productName,
                    description: item.is_consumable ? undefined : (specs || fullDesc),
                    isConsumable: item.is_consumable || false,
                    categoryOrder: parseInt(cat.id),
                    category: cat.name,
                    categorySlug: cat.slug,
                    familyOrder: fam.id,
                    family: fam.name,
                    familySlug: fam.slug,
                    image_url: matchedImage || undefined,
                } as Product;
            });

            return {
                order: fam.id,
                name: fam.name,
                slug: fam.slug,
                products,
            } as Family;
        });

        return {
            order: parseInt(cat.id),
            name: cat.name,
            slug: cat.slug,
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

    // Strict sorting by 'order' field (e.g., "1.1.1", "1.1.2", "2.1.1")
    return products.sort((a, b) => {
        const orderA = a.order || "";
        const orderB = b.order || "";
        return orderA.localeCompare(orderB, undefined, { numeric: true, sensitivity: 'base' });
    });
};

export const getEquipmentById = (id: string): Product | undefined => {
    const allProducts = getAllProducts();
    return allProducts.find(p => p.id === id);
};
