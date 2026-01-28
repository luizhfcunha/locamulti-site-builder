import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  useEquipmentImages,
  useAddEquipmentImage,
  useDeleteEquipmentImage,
  equipmentKeys
} from "@/lib/queries/equipment";
import { uploadEquipmentImage, deleteEquipmentImage as deleteFromStorage } from "@/lib/storage";
import {
  Upload,
  Trash2,
  Star,
  StarOff,
  Loader2,
  GripVertical,
  ImagePlus
} from "lucide-react";
import type { EquipmentImage } from "@/lib/catalogNew";

interface EquipmentImagesManagerProps {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
}

export function EquipmentImagesManager({
  equipmentId,
  equipmentCode,
  equipmentName
}: EquipmentImagesManagerProps) {
  const queryClient = useQueryClient();
  const { data: images = [], isLoading } = useEquipmentImages(equipmentId);
  const addImageMutation = useAddEquipmentImage();
  const deleteImageMutation = useDeleteEquipmentImage();

  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    // ✅ Verificar se JÁ existe imagem primária
    const hasPrimaryImage = images.some(img => img.is_primary);

    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        // ✅ Primeira imagem do upload será primária se não houver nenhuma
        const shouldBePrimary = !hasPrimaryImage && index === 0;

        // Upload to storage
        const { path, publicUrl, error } = await uploadEquipmentImage(
          file,
          equipmentCode,
          shouldBePrimary
        );

        if (error) {
          toast({
            title: "Erro no upload",
            description: error,
            variant: "destructive",
          });
          return null;
        }

        // Add to database
        await addImageMutation.mutateAsync({
          equipmentId,
          storagePath: path,
          publicUrl,
          altText: `${equipmentName} - ${file.name}`,
          isPrimary: shouldBePrimary,
          sortOrder: images.length + index,
        });

        // ✅ Fallback de sincronização se esta for a imagem primária
        if (shouldBePrimary) {
          try {
            await supabase
              .from('catalog_items')
              .update({
                image_url: publicUrl,
                updated_at: new Date().toISOString()
              })
              .eq('id', equipmentId);
          } catch (syncError) {
            console.error("Sync fallback error:", syncError);
            // Não falhar o upload por causa disso, trigger pode ter funcionado
          }
        }

        return publicUrl;
      } catch (err: any) {
        console.error("Upload error:", err);
        toast({
          title: "Erro no upload",
          description: err.message || "Falha ao enviar imagem",
          variant: "destructive",
        });
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successCount = results.filter(Boolean).length;

    if (successCount > 0) {
      toast({
        title: "Imagens enviadas",
        description: `${successCount} imagem(ns) carregada(s) com sucesso.`,
      });
    }

    setUploading(false);
  }, [equipmentId, equipmentCode, equipmentName, images, addImageMutation]);

  // Handle drag and drop file upload
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Handle image deletion
  const handleDelete = async (image: EquipmentImage) => {
    if (!confirm(`Deseja realmente excluir esta imagem?`)) return;

    try {
      // Delete from storage
      await deleteFromStorage(image.storage_path);

      // Delete from database
      await deleteImageMutation.mutateAsync({
        imageId: image.id,
        equipmentId,
      });

      toast({
        title: "Imagem excluída",
        description: "A imagem foi removida com sucesso.",
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir a imagem.",
        variant: "destructive",
      });
    }
  };

  // Handle set as primary
  const handleSetPrimary = async (image: EquipmentImage) => {
    if (image.is_primary) return;

    try {
      // Unset current primary
      const currentPrimary = images.find(img => img.is_primary);
      if (currentPrimary) {
        await (supabase
          .from("equipment_images") as any)
          .update({ is_primary: false })
          .eq("id", currentPrimary.id);
      }

      // Set new primary
      await (supabase
        .from("equipment_images") as any)
        .update({ is_primary: true })
        .eq("id", image.id);

      // Invalidate queries to refresh
      queryClient.invalidateQueries({ queryKey: equipmentKeys.images(equipmentId) });

      // Invalidar cache de listagem do catálogo
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });

      // Invalidar cache de todos os itens do catálogo (admin + público)
      queryClient.invalidateQueries({ queryKey: equipmentKeys.catalogItems() });

      toast({
        title: "Imagem principal atualizada",
        description: "A imagem foi definida como principal.",
      });
    } catch (error: any) {
      console.error("Set primary error:", error);
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Não foi possível definir como principal.",
        variant: "destructive",
      });
    }
  };

  // Handle drag start for reordering
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over for reordering
  const handleDragOverReorder = (index: number) => {
    setDragOverIndex(index);
  };

  // Handle drop for reordering
  const handleDropReorder = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    try {
      const reorderedImages = [...images];
      const [draggedImage] = reorderedImages.splice(draggedIndex, 1);
      reorderedImages.splice(dropIndex, 0, draggedImage);

      // Update sort_order for all images
      const updates = reorderedImages.map((img, idx) => ({
        id: img.id,
        sort_order: idx,
      }));

      // Batch update
      for (const update of updates) {
        await (supabase
          .from("equipment_images") as any)
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }

      // Invalidate queries to refresh
      queryClient.invalidateQueries({ queryKey: equipmentKeys.images(equipmentId) });

      // Invalidar cache de listagem do catálogo
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });

      // Invalidar cache de todos os itens do catálogo (admin + público)
      queryClient.invalidateQueries({ queryKey: equipmentKeys.catalogItems() });

      toast({
        title: "Ordem atualizada",
        description: "A ordem das imagens foi atualizada.",
      });
    } catch (error: any) {
      console.error("Reorder error:", error);
      toast({
        title: "Erro ao reordenar",
        description: error.message || "Não foi possível reordenar as imagens.",
        variant: "destructive",
      });
    } finally {
      setDraggedIndex(null);
      setDragOverIndex(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed rounded-lg p-6 bg-muted/50 hover:bg-muted/70 transition-colors"
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <ImagePlus className="w-12 h-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">
              Arraste imagens aqui ou clique para selecionar
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPEG ou WebP até 10MB
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('multi-image-upload')?.click()}
            className="gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Selecionar Arquivos
              </>
            )}
          </Button>
          <input
            id="multi-image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Nenhuma imagem adicionada ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card
              key={image.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOverReorder(index);
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDropReorder(index);
              }}
              className={`
                relative group cursor-move transition-all
                ${draggedIndex === index ? 'opacity-50' : ''}
                ${dragOverIndex === index ? 'ring-2 ring-primary' : ''}
              `}
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 rounded p-1 backdrop-blur-sm">
                  <GripVertical className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Primary Badge */}
              {image.is_primary && (
                <Badge className="absolute top-2 right-2 z-10 bg-yellow-500 hover:bg-yellow-600">
                  <Star className="w-3 h-3 mr-1" />
                  Principal
                </Badge>
              )}

              {/* Image */}
              <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
                <img
                  src={image.public_url}
                  alt={image.alt_text || `Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Actions */}
              <div className="p-2 space-y-1">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 text-xs"
                    onClick={() => handleSetPrimary(image)}
                    disabled={image.is_primary}
                  >
                    {image.is_primary ? (
                      <>
                        <Star className="w-3 h-3" />
                        Principal
                      </>
                    ) : (
                      <>
                        <StarOff className="w-3 h-3" />
                        Definir Principal
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(image)}
                    className="gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Ordem: {index + 1}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
