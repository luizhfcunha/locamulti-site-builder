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

  // Construct select string based on filters to ensure correct joins
  let selectString = '*, categories(name), subcategories(name)';

  // If filtering by category/subcategory name, we need !inner join to filter on the joined table
  if (filters?.category && filters?.subcategory) {
    selectString = '*, categories!inner(name), subcategories!inner(name)';
  } else if (filters?.category) {
    selectString = '*, categories!inner(name), subcategories(name)';
  } else if (filters?.subcategory) {
    selectString = '*, categories(name), subcategories!inner(name)';
  }

  let query = supabase
    .from('products')
    .select(selectString, { count: 'exact' })
    .eq('active', true)
    .range(from, to);

  // Apply filters
  if (filters?.category) {
    query = query.eq('categories.name', filters.category);
  }

  if (filters?.subcategory) {
    query = query.eq('subcategories.name', filters.subcategory);
  }

  if (filters?.brand) {
    query = query.eq('brand', filters.brand);
  }

  if (filters?.search) {
    // Search in product name, description, brand, or supplier code
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
  }

  // Default sort by name
  query = query.order('name', { ascending: true });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }

  // Map the result to flatten category and subcategory names
  const mappedData = data.map((item: any) => ({
    ...item,
    category: item.categories?.name || null,
    subcategory: item.subcategories?.name || null,
  }));

  return { data: mappedData, count };
}

export async function getCatalogCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('name')
    .order('display_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data.map(cat => ({ id: cat.name, label: cat.name }));
}

export async function getCatalogSubcategories(categoryName?: string) {
  let query = supabase
    .from('subcategories')
    .select('name, categories!inner(name)')
    .order('display_order');

  if (categoryName) {
    query = query.eq('categories.name', categoryName);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return data.map((sub: any) => ({ id: sub.name, label: sub.name }));
}

export async function getCatalogBrands() {
  const { data, error } = await supabase
    .from('products')
    .select('brand')
    .eq('active', true)
    .not('brand', 'is', null)
    .order('brand');

  if (error) {
    console.error('Error fetching brands:', error);
    return [];
  }

  const uniqueBrands = [...new Set(data.map(item => item.brand))];
  return uniqueBrands.map(brand => ({ id: brand, label: brand }));
}

export async function getCategoriesWithSubcategories() {
  // Fetch categories and their subcategories directly from the source tables
  const { data, error } = await supabase
    .from('categories')
    .select('name, subcategories(name)')
    .order('display_order');

  if (error) {
    console.error('Error fetching categories with subcategories:', error);
    return [];
  }

  return data.map((cat: any) => ({
    category: cat.name,
    subcategories: cat.subcategories?.map((sub: any) => sub.name).sort() || [],
  }));
}
