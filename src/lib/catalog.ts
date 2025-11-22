import { supabase } from "@/integrations/supabase/client";

export interface CatalogFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  search?: string;
}

export async function getCatalog(filters?: CatalogFilters) {
  let query = supabase
    .from('catalog')
    .select('*')
    .order('name', { ascending: true });

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

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching catalog:', error);
    throw error;
  }

  return data;
}
