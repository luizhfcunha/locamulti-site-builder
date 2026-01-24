import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CatalogItem, EquipmentImage } from "@/lib/catalogNew";

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
      // JOIN com equipment_images para pegar primary_image
      const { data: items, error } = await supabase
        .from("catalog_items")
        .select(
          `
          *,
          primary_image:equipment_images!inner(
            id,
            public_url,
            alt_text
          )
        `
        )
        .eq("family_slug", familySlug)
        .eq("active", true)
        .eq("equipment_images.is_primary", true)
        .order("item_order", { ascending: true });

      if (error) throw error;

      // Transformar para formato esperado
      return (items || []).map((item) => ({
        ...item,
        primary_image: item.primary_image?.[0] || null,
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
      const { data, error } = await supabase
        .from("equipment_images")
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
      // Single query com JOIN
      const { data, error } = await supabase
        .from("catalog_items")
        .select(
          `
          *,
          images:equipment_images(
            id,
            equipment_id,
            public_url,
            alt_text,
            sort_order,
            is_primary,
            width,
            height
          )
        `
        )
        .eq("code", code)
        .eq("active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Ordenar imagens por sort_order
      const images = (data.images || []).sort(
        (a, b) => a.sort_order - b.sort_order
      ) as EquipmentImage[];

      return {
        ...data,
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
      const { data, error } = await supabase
        .from("equipment_images")
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
    },
  });
}

// ===== HOOK 5: Remover imagem (Admin) =====
export function useDeleteEquipmentImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { imageId: string; equipmentId: string }) => {
      const { error } = await supabase
        .from("equipment_images")
        .delete()
        .eq("id", params.imageId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.images(variables.equipmentId),
      });
    },
  });
}
