export interface Product {
    id: string;
    order?: string; // e.g. "1.1.2001"
    name: string;
    description?: string;
    isConsumable: boolean;
    categoryOrder: number | string;
    category: string;
    categorySlug?: string;
    familyOrder: string;
    family: string;
    familySlug?: string;
    image_url?: string;
    brand?: string; // Added from usage in FeaturedEquipmentCarousel
    slug?: string;
}

export interface Family {
    order: string;
    name: string;
    slug: string;
    products: Product[];
}

export interface Category {
    order: number;
    name: string;
    slug: string;
    families: Family[];
}
