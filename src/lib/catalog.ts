import { supabase } from "@/integrations/supabase/client";

export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getCatalog(filters?: CatalogFilters) {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('catalog')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  if (filters?.subcategory) {
    query = query.eq('subcategory', filters.subcategory);
  }

  if (filters?.brand) {
    query = query.eq('brand', filters.brand);
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }

  return { data, count };
}

export async function getCatalogCategories() {
  const { data, error } = await supabase
    .from('catalog')
    .select('category')
    .not('category', 'is', null)
    .order('category');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  const uniqueCategories = [...new Set(data.map(item => item.category))];
  return uniqueCategories.map(cat => ({ id: cat, label: cat }));
}

export async function getCatalogSubcategories(category?: string) {
  let query = supabase
    .from('catalog')
    .select('subcategory')
    .not('subcategory', 'is', null);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('subcategory');

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  const uniqueSubcategories = [...new Set(data.map(item => item.subcategory))];
  return uniqueSubcategories.map(sub => ({ id: sub, label: sub }));
}

export async function getCatalogBrands() {
  const { data, error } = await supabase
    .from('catalog')
    .select('brand')
    .not('brand', 'is', null)
    .order('brand');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  const uniqueBrands = [...new Set(data.map(item => item.brand))];
  return uniqueBrands.map(brand => ({ id: brand, label: brand }));
}
