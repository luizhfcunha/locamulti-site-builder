import { InfiniteSlider } from "@/components/ui/infinite-slider";

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
    <InfiniteSlider 
      gap={48} 
      duration={30}
      durationOnHover={60}
      className="py-4"
    >
      {brands.map((brand) => (
        <div
          key={brand.id}
          className="flex items-center justify-center h-16 w-32 px-4"
        >
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="max-w-full max-h-full object-contain transition-transform duration-300 hover:scale-110"
            />
          ) : (
            <span className="font-heading font-bold text-foreground text-lg">
              {brand.name}
            </span>
          )}
        </div>
      ))}
    </InfiniteSlider>
  );
};
