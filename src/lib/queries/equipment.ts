import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogItem, EquipmentImage } from "@/lib/catalogNew";
import { getCatalogFamilyItems } from "@/lib/catalogNew";

// ===== QUERY KEYS (Centralizado para invalidação) =====
export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters: { familySlug?: string; categorySlug?: string }) =>
    [...equipmentKeys.lists(), filters] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (code: string) => [...equipmentKeys.details(), code] as const,
  images: (equipmentId: string) =>
    [...equipmentKeys.all, "images", equipmentId] as const,
  catalogFamily: (familySlug: string) =>
    [...equipmentKeys.lists(), "family", familySlug] as const,
  catalogItems: () => [...equipmentKeys.all, "catalog-items"] as const,
};

// ===== HOOK 1: Lista de equipamentos (com primary image) =====
/**
 * Busca lista de equipamentos de uma família
 * Retorna apenas a imagem primária (otimizado para cards)
 */
export function useEquipmentList(familySlug: string) {
  return useQuery({
    queryKey: equipmentKeys.list({ familySlug }),
    queryFn: async () => {
      // Buscar itens do catálogo
      const { data: items, error } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("family_slug", familySlug)
        .eq("active", true)
        .order("item_order", { ascending: true });

      if (error) throw error;

      // Buscar imagens primárias separadamente
      const itemIds = (items || []).map(item => item.id);
      
      if (itemIds.length === 0) {
        return [] as (CatalogItem & { primary_image: EquipmentImage | null })[];
      }

      const { data: primaryImages } = await (supabase
        .from("equipment_images") as any)
        .select("*")
        .in("equipment_id", itemIds)
        .eq("is_primary", true);

      // Mapear imagens aos itens
      const imageMap = new Map<string, EquipmentImage>();
      (primaryImages || []).forEach((img: EquipmentImage) => {
        imageMap.set(img.equipment_id, img);
      });

      return (items || []).map((item) => ({
        ...item,
        primary_image: imageMap.get(item.id) || null,
      })) as (CatalogItem & { primary_image: EquipmentImage | null })[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos (catálogo muda pouco)
    gcTime: 10 * 60 * 1000, // 10 minutos no cache
  });
}

// ===== HOOK 2: Imagens de um equipamento (para lightbox) =====
/**
 * Busca TODAS as imagens de um equipamento específico
 * Ordenadas por sort_order (0 = primeira)
 */
export function useEquipmentImages(equipmentId: string) {
  return useQuery({
    queryKey: equipmentKeys.images(equipmentId),
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("equipment_images") as any)
        .select("*")
        .eq("equipment_id", equipmentId)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data || []) as EquipmentImage[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos (imagens mudam muito pouco)
    enabled: !!equipmentId, // Só executa se tiver ID
  });
}

// ===== HOOK 3: Detalhe completo do equipamento =====
/**
 * Busca equipamento por código + TODAS as imagens
 * Usado em modal ou página de detalhes (futuro)
 */
export function useEquipmentDetail(code: string) {
  return useQuery({
    queryKey: equipmentKeys.detail(code),
    queryFn: async () => {
      // Buscar o item do catálogo
      const { data: item, error: itemError } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();

      if (itemError) throw itemError;
      if (!item) return null;

      // Buscar imagens separadamente
      const { data: imagesData, error: imagesError } = await (supabase
        .from("equipment_images") as any)
        .select("*")
        .eq("equipment_id", item.id)
        .order("sort_order", { ascending: true });

      if (imagesError) throw imagesError;

      const images = (imagesData || []) as EquipmentImage[];

      return {
        ...item,
        images,
        primary_image:
          images.find((img) => img.is_primary) || images[0] || null,
      } as CatalogItem & {
        images: EquipmentImage[];
        primary_image: EquipmentImage | null;
      };
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!code,
  });
}

// ===== HOOK 4: Adicionar imagem (Admin) =====
export function useAddEquipmentImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      equipmentId: string;
      storagePath: string;
      publicUrl: string;
      altText?: string;
      isPrimary?: boolean;
      sortOrder?: number;
    }) => {
      const { data, error } = await (supabase
        .from("equipment_images") as any)
        .insert({
          equipment_id: params.equipmentId,
          storage_path: params.storagePath,
          public_url: params.publicUrl,
          alt_text: params.altText || null,
          is_primary: params.isPrimary || false,
          sort_order: params.sortOrder || 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data as EquipmentImage;
    },
    onSuccess: (_, variables) => {
      // Invalidar cache de imagens desse equipamento
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.images(variables.equipmentId),
      });

      // Invalidar cache de listagem do catálogo para refletir nova imagem
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.lists(),
      });

      // Invalidar cache de todos os itens do catálogo (admin + público)
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.catalogItems(),
      });
    },
  });
}

// ===== HOOK 5: Remover imagem (Admin) =====
export function useDeleteEquipmentImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { imageId: string; equipmentId: string }) => {
      const { error } = await (supabase
        .from("equipment_images") as any)
        .delete()
        .eq("id", params.imageId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.images(variables.equipmentId),
      });

      // Invalidar cache de listagem do catálogo após deletar imagem
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.lists(),
      });

      // Invalidar cache de todos os itens do catálogo (admin + público)
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.catalogItems(),
      });
    },
  });
}

// ===== HOOK 6: Buscar itens de uma família para o catálogo =====
/**
 * Hook React Query para buscar itens de uma família
 * Usado nas páginas do catálogo público
 */
export function useCatalogFamilyItems(familySlug: string) {
  return useQuery({
    queryKey: equipmentKeys.catalogFamily(familySlug),
    queryFn: () => getCatalogFamilyItems(familySlug),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    enabled: !!familySlug,
  });
}

// ===== HOOK 7: Buscar todos os itens do catálogo (Admin) =====
/**
 * Hook React Query para buscar todos os itens do catálogo
 * Usado na listagem admin
 */
export function useAllCatalogItems() {
  return useQuery({
    queryKey: equipmentKeys.catalogItems(),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .order("category_order", { ascending: true })
        .order("family_order", { ascending: true })
        .order("item_order", { ascending: true });

      if (error) throw error;
      return (data || []) as CatalogItem[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
}
