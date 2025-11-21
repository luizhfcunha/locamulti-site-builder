import { CategoryCard } from "@/components/CategoryCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { LucideIcon } from "lucide-react";

interface Category {
  id: string;
  title: string;
  icon: LucideIcon;
  imageUrl?: string;
}

interface CategoryCarouselProps {
  categories: Category[];
  onCategoryClick?: (categoryId: string) => void;
}

export const CategoryCarousel = ({ categories, onCategoryClick }: CategoryCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {categories.map((category) => (
          <CarouselItem key={category.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <CategoryCard
              title={category.title}
              icon={category.icon}
              imageUrl={category.imageUrl}
              onClick={() => onCategoryClick?.(category.id)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-12" />
      <CarouselNext className="hidden md:flex -right-12" />
    </Carousel>
  );
};
