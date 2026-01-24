import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "product-images";
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

/**
 * Gera path organizado para imagem de equipamento
 *
 * @param equipmentCode - Código do equipamento (ex: "01.01.001")
 * @param isPrimary - Se é imagem primária (true) ou galeria (false)
 * @param fileExtension - Extensão do arquivo (ex: "jpg")
 * @returns Path completo (ex: "equipment/01.01.001/primary-abc123.jpg")
 */
export function generateImagePath(
  equipmentCode: string,
  isPrimary: boolean,
  fileExtension: string
): string {
  const prefix = isPrimary ? "primary" : "gallery";
  const randomId = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now();

  // Sanitizar código do equipamento (remover caracteres inválidos)
  const safeCode = equipmentCode.replace(/[^a-zA-Z0-9.-]/g, "_");

  return `equipment/${safeCode}/${prefix}-${timestamp}-${randomId}.${fileExtension}`;
}

/**
 * Upload de imagem com validação e otimização
 *
 * @param file - Arquivo de imagem
 * @param equipmentCode - Código do equipamento
 * @param isPrimary - Se é imagem primária (padrão: false)
 * @returns Promise com path, publicUrl e erro (se houver)
 */
export async function uploadEquipmentImage(
  file: File,
  equipmentCode: string,
  isPrimary: boolean = false
): Promise<{ path: string; publicUrl: string; error?: string }> {
  // Validação de tipo
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      path: "",
      publicUrl: "",
      error: "Tipo de arquivo inválido. Use PNG, JPEG ou WebP.",
    };
  }

  // Validação de tamanho
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return {
      path: "",
      publicUrl: "",
      error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE_MB}MB`,
    };
  }

  // Gerar path
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const storagePath = generateImagePath(equipmentCode, isPrimary, fileExt);

  // Upload
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: "31536000", // 1 ano
      upsert: false, // Não sobrescrever
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { path: "", publicUrl: "", error: uploadError.message };
  }

  // Obter URL pública
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return { path: storagePath, publicUrl, error: undefined };
}

/**
 * Deletar imagem do storage (apenas path, não o registro do DB)
 *
 * @param storagePath - Path da imagem no storage
 * @returns Promise<boolean> - true se deletado com sucesso
 */
export async function deleteEquipmentImage(
  storagePath: string
): Promise<boolean> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([storagePath]);

  if (error) {
    console.error("Delete error:", error);
    return false;
  }

  return true;
}

/**
 * Helper: Obter URL pública de um path
 *
 * @param storagePath - Path da imagem no storage
 * @returns URL pública completa
 */
export function getPublicUrl(storagePath: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return publicUrl;
}
