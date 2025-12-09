import { supabase } from "@/integrations/supabase/client";

export interface CatalogFilters {
  category?: string;
  family?: string;
  subfamily?: string;
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

  // Build select string with proper joins
  let selectString = '*, categories(name), families(name), subfamilies(name)';

  // If filtering by name, we need !inner join to filter on the joined table
  if (filters?.category && filters?.family && filters?.subfamily) {
    selectString = '*, categories!inner(name), families!inner(name), subfamilies!inner(name)';
  } else if (filters?.category && filters?.family) {
    selectString = '*, categories!inner(name), families!inner(name), subfamilies(name)';
  } else if (filters?.category) {
    selectString = '*, categories!inner(name), families(name), subfamilies(name)';
  } else if (filters?.family) {
    selectString = '*, categories(name), families!inner(name), subfamilies(name)';
  } else if (filters?.subfamily) {
    selectString = '*, categories(name), families(name), subfamilies!inner(name)';
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

  if (filters?.family) {
    query = query.eq('families.name', filters.family);
  }

  if (filters?.subfamily) {
    query = query.eq('subfamilies.name', filters.subfamily);
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

  // Map the result to flatten names
  const mappedData = data.map((item: any) => ({
    ...item,
    category: item.categories?.name || null,
    family: item.families?.name || null,
    subfamily: item.subfamilies?.name || null,
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

export async function getCatalogFamilies(categoryName?: string) {
  let query = supabase
    .from('families')
    .select('name, categories!inner(name)')
    .order('display_order');

  if (categoryName) {
    query = query.eq('categories.name', categoryName);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching families:', error);
    return [];
  }

  return data.map((fam: any) => ({ id: fam.name, label: fam.name }));
}

export async function getCatalogSubfamilies(familyName?: string) {
  let query = supabase
    .from('subfamilies')
    .select('name, families!inner(name)')
    .order('display_order');

  if (familyName) {
    query = query.eq('families.name', familyName);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching subfamilies:', error);
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

export async function getCategoriesWithFamiliesAndSubfamilies() {
  // Fetch complete hierarchy: categories -> families -> subfamilies
  const { data, error } = await supabase
    .from('categories')
    .select('name, families(name, subfamilies(name))')
    .order('display_order');

  if (error) {
    console.error('Error fetching categories with hierarchy:', error);
    return [];
  }

  return data.map((cat: any) => ({
    category: cat.name,
    families: cat.families?.map((fam: any) => ({
      name: fam.name,
      subfamilies: fam.subfamilies?.map((sub: any) => sub.name).sort() || [],
    })).sort((a: any, b: any) => a.name.localeCompare(b.name)) || [],
  }));
}
