import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EquipmentImage } from "@/lib/catalogNew";

interface LightboxCarouselProps {
  images: EquipmentImage[];
  initialIndex: number;
  equipmentName: string;
}

export function LightboxCarousel({
  images,
  initialIndex,
  equipmentName,
}: LightboxCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex: initialIndex,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Atualizar estados de navegação
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Navegação por teclado
  useEffect(() => {
    if (!emblaApi) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
      if (e.key === "ArrowRight") emblaApi.scrollNext();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative flex-1 flex items-center justify-center">
      {/* Embla Carousel */}
      <div className="overflow-hidden w-full h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-4"
            >
              <img
                src={image.public_url}
                alt={
                  image.alt_text || `${equipmentName} - Imagem ${index + 1}`
                }
                loading={index === initialIndex ? "eager" : "lazy"}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
                style={{
                  backgroundColor: "transparent",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Setas de navegação (apenas se mais de 1 imagem) */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev && !emblaApi?.plugins()?.loop}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 z-10 backdrop-blur-sm"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext && !emblaApi?.plugins()?.loop}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 z-10 backdrop-blur-sm"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Contador de imagens (apenas se mais de 1 imagem) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
