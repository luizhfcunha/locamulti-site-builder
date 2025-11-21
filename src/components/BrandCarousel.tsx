import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
}

interface BrandCarouselProps {
  brands: Brand[];
}

export const BrandCarousel = ({ brands }: BrandCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="-ml-8">
        {brands.map((brand) => (
          <CarouselItem key={brand.id} className="pl-8 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6">
            <div className="flex items-center justify-center h-20 p-4 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-base">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="font-heading font-bold text-lm-ink text-lg">
                  {brand.name}
                </span>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
