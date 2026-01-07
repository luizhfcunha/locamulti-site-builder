import { Category } from "@/types/catalog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryGridProps {
    categories: Category[];
    onSelectCategory: (categorySlug: string) => void;
}

// Map slugs to image filenames (placeholders for now)
const getCategoryImage = (slug: string) => {
    // In a real scenario, this would map to actual images in /public/images/categorias/
    // For now we use High Quality Placeholders or local paths if available
    const images: Record<string, string> = {
        'demolicao-e-perfuracao': '/images/categorias/demolicao-perfuracao.jpg',
        'concretagem-e-acabamento': '/images/categorias/concretagem-acabamento.jpg',
        'ferramentas-de-cortar-lixar-e-parafusar': '/images/categorias/ferramentas-cortar-lixar.jpg',
        'bombas-geradores-e-compressores': '/images/categorias/bombas-geradores.jpg',
        'elevacao-movimentacao-e-remocao': '/images/categorias/elevacao-movimentacao.jpg',
        'maquinas-de-solda-e-montagem': '/images/categorias/maquinas-solda.jpg',
        'conservacao-e-limpeza': '/images/categorias/conservacao-limpeza.jpg',
        'equipamentos-de-acesso-a-altura': '/images/categorias/acesso-altura.jpg',
        'equipamentos-de-jardinagem-e-agricolas': '/images/categorias/equipamentos-agricolas.jpg',
        'ferramentas-a-bateria': '/images/categorias/ferramentas-bateria.jpg',
    };

    // Fallback to a nice placeholder if image not found
    return images[slug] || `https://placehold.co/400x300/f3f4f6/1f2937?text=${slug.split('-')[0].toUpperCase()}`;
};

export const CategoryGrid = ({ categories, onSelectCategory }: CategoryGridProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {categories.map((category) => (
                <Card
                    key={category.slug}
                    className="group cursor-pointer overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => onSelectCategory(category.slug)}
                >
                    <CardContent className="p-0 relative aspect-[4/3]">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                        <img
                            src={getCategoryImage(category.slug)}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://placehold.co/400x300/f3f4f6/1f2937?text=${category.name.substring(0, 10)}...`;
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
                            <h3 className="text-white font-bold text-xl md:text-2xl text-center drop-shadow-md uppercase tracking-wide">
                                {category.name}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
