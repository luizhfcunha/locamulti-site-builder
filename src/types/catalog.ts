export interface Product {
    id: string;
    order: string;
    name: string;
    description: string;
    isConsumable: boolean;
    categoryOrder: number | string;
    category: string;
    categorySlug?: string;
    familyOrder: number | string;
    family: string;
    familySlug?: string;
    image_url?: string; // Optional as it might be added later or matched by ID
    brand?: string;
    active?: boolean;
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
