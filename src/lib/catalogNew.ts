import { supabase } from "@/integrations/supabase/client";

// Types
export interface CatalogItem {
  id: string;
  category_order: number;
  category_no: number;
  category_name: string;
  category_slug: string;
  family_order: number;
  family_no: string;
  family_name: string;
  family_slug: string;
  item_order: number;
  code: string;
  item_type: 'equipamento' | 'consumivel';
  name: string;
  description: string;
  image_url: string | null;
  active: boolean;
}

export interface CatalogCategory {
  category_no: number;
  category_name: string;
  category_slug: string;
  category_order: number;
  item_count: number;
}

export interface CatalogFamily {
  family_no: string;
  family_name: string;
  family_slug: string;
  family_order: number;
  category_no: number;
  category_name: string;
  category_slug: string;
  equipment_count: number;
  consumable_count: number;
}

export interface SearchResult {
  item: CatalogItem;
  matchType: 'code' | 'description';
}

/**
 * Generate URL-friendly slug from a name
 */
export function generateSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get unique categories ordered by category_order
 */
export async function getCatalogCategories(): Promise<CatalogCategory[]> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('category_no, category_name, category_slug, category_order')
    .eq('active', true)
    .order('category_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  // Get unique categories and count items
  const categoryMap = new Map<number, CatalogCategory>();
  
  data?.forEach(item => {
    const existing = categoryMap.get(item.category_no);
    if (existing) {
      existing.item_count++;
    } else {
      categoryMap.set(item.category_no, {
        category_no: item.category_no,
        category_name: item.category_name,
        category_slug: item.category_slug,
        category_order: item.category_order,
        item_count: 1
      });
    }
  });

  // Convert to array and sort by category_order
  return Array.from(categoryMap.values())
    .sort((a, b) => a.category_order - b.category_order);
}

/**
 * Get families for a specific category, ordered by family_order
 */
export async function getCatalogFamilies(categorySlug: string): Promise<CatalogFamily[]> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('category_slug', categorySlug)
    .eq('active', true)
    .order('family_order', { ascending: true });

  if (error) {
    console.error('Error fetching families:', error);
    return [];
  }

  // Get unique families with counts
  const familyMap = new Map<string, CatalogFamily>();

  data?.forEach(item => {
    const existing = familyMap.get(item.family_no);
    if (existing) {
      if (item.item_type === 'equipamento') {
        existing.equipment_count++;
      } else {
        existing.consumable_count++;
      }
    } else {
      familyMap.set(item.family_no, {
        family_no: item.family_no,
        family_name: item.family_name,
        family_slug: item.family_slug,
        family_order: item.family_order,
        category_no: item.category_no,
        category_name: item.category_name,
        category_slug: item.category_slug,
        equipment_count: item.item_type === 'equipamento' ? 1 : 0,
        consumable_count: item.item_type === 'consumivel' ? 1 : 0
      });
    }
  });

  // Convert to array and sort by family_order
  return Array.from(familyMap.values())
    .sort((a, b) => a.family_order - b.family_order);
}

/**
 * Get all items for a specific family, ordered by item_order
 */
export async function getCatalogFamilyItems(familySlug: string): Promise<{
  items: CatalogItem[];
  equipamentos: CatalogItem[];
  consumiveis: CatalogItem[];
  category: { name: string; slug: string } | null;
  family: { name: string; slug: string } | null;
}> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('family_slug', familySlug)
    .eq('active', true)
    .order('item_order', { ascending: true });

  if (error) {
    console.error('Error fetching family items:', error);
    return { items: [], equipamentos: [], consumiveis: [], category: null, family: null };
  }

  const items = (data || []) as CatalogItem[];
  const equipamentos = items.filter(i => i.item_type === 'equipamento');
  const consumiveis = items.filter(i => i.item_type === 'consumivel');

  const category = items.length > 0 
    ? { name: items[0].category_name, slug: items[0].category_slug }
    : null;
  
  const family = items.length > 0
    ? { name: items[0].family_name, slug: items[0].family_slug }
    : null;

  return { items, equipamentos, consumiveis, category, family };
}

/**
 * Get a single item by code
 */
export async function getCatalogItemByCode(code: string): Promise<CatalogItem | null> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching item by code:', error);
    return null;
  }

  return data as CatalogItem | null;
}

/**
 * Get category info by slug
 */
export async function getCategoryBySlug(categorySlug: string): Promise<{ name: string; slug: string } | null> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('category_name, category_slug')
    .eq('category_slug', categorySlug)
    .eq('active', true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }

  return data ? { name: data.category_name, slug: data.category_slug } : null;
}

/**
 * Search catalog by code or description
 */
export async function searchCatalog(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('active', true)
    .or(`code.ilike.${searchTerm},description.ilike.${searchTerm}`)
    .order('category_order', { ascending: true })
    .order('family_order', { ascending: true })
    .order('item_order', { ascending: true })
    .limit(50);

  if (error) {
    console.error('Error searching catalog:', error);
    return [];
  }

  return (data || []).map(item => ({
    item: item as CatalogItem,
    matchType: item.code.toLowerCase().includes(query.toLowerCase()) ? 'code' : 'description'
  }));
}

/**
 * Sidebar hierarchy data structure
 */
export interface SidebarFamilyData {
  name: string;
  slug: string;
  equipmentCount: number;
  consumableCount: number;
}

export interface SidebarCategoryData {
  name: string;
  slug: string;
  families: SidebarFamilyData[];
}

/**
 * Get full hierarchy for sidebar (all categories with all families)
 */
export async function getCatalogHierarchy(): Promise<SidebarCategoryData[]> {
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .eq('active', true)
    .order('category_order', { ascending: true })
    .order('family_order', { ascending: true });

  if (error) {
    console.error('Error fetching catalog hierarchy:', error);
    return [];
  }

  // Build hierarchy
  const categoryMap = new Map<string, SidebarCategoryData>();

  data?.forEach(item => {
    // Get or create category
    let category = categoryMap.get(item.category_slug);
    if (!category) {
      category = {
        name: item.category_name,
        slug: item.category_slug,
        families: []
      };
      categoryMap.set(item.category_slug, category);
    }

    // Get or create family
    let family = category.families.find(f => f.slug === item.family_slug);
    if (!family) {
      family = {
        name: item.family_name,
        slug: item.family_slug,
        equipmentCount: 0,
        consumableCount: 0
      };
      category.families.push(family);
    }

    // Count items
    if (item.item_type === 'equipamento') {
      family.equipmentCount++;
    } else {
      family.consumableCount++;
    }
  });

  return Array.from(categoryMap.values());
}
