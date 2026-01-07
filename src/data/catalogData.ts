import { Category, Family, Product } from '@/types/catalog';
import catalogJson from './locamulti_catalog_completo.json';
import { findImageForProduct } from '@/utils/imageMatcher';

// Cast the JSON import to the correct type
const catalogData: Category[] = catalogJson as unknown as Category[];

export default catalogData;

export const getAllCategories = (): Category[] => {
    return catalogData;
};

export const getAllProducts = (): Product[] => {
    const products: Product[] = [];

    catalogData.forEach(category => {
        category.families.forEach(family => {
            family.products.forEach(product => {
                // Try to find a matching image
                const matchedImage = findImageForProduct(product.name);

                products.push({
                    ...product,
                    image_url: matchedImage || product.image_url, // Use matched image or keep existing/placeholder
                    categorySlug: category.slug, // Ensure these are set if not in JSON
                    familySlug: family.slug
                });
            });
        });
    });

    // Strict sorting by 'order' field (e.g., "1.1.2001", "1.1.2002")
    // Using localeCompare with numeric option handles "1.1.2" vs "1.1.10" correctly
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
