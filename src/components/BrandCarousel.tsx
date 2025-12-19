import { InfiniteSlider } from "@/components/ui/infinite-slider";

interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
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
      {brands.map((brand) => {
        const content = brand.logoUrl ? (
          <img
            src={brand.logoUrl}
            alt={brand.name}
            className="max-w-full max-h-full object-contain transition-transform hover:scale-105"
          />
        ) : (
          <span className="font-heading font-bold text-foreground text-lg">
            {brand.name}
          </span>
        );

        return (
          <div
            key={brand.id}
            className="flex items-center justify-center h-16 w-32 px-4"
          >
            {brand.websiteUrl ? (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full cursor-pointer"
                title={`Visite o site da ${brand.name}`}
              >
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        );
      })}
    </InfiniteSlider>
  );
};
