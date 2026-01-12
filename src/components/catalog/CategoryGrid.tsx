import { Category } from "@/types/catalog";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryGridProps {
    categories: Category[];
    onSelectCategory: (slug: string) => void;
}

export const CategoryGrid = ({ categories, onSelectCategory }: CategoryGridProps) => {

    // Map slugs to local images (matching slugify() output with hyphens)
    const images: Record<string, string> = {
        'demolicao-e-perfuracao': '/images/carrossel-desktop/demolicao-perfuracao.jpg',
        'concretagem-e-acabamento': '/images/carrossel-desktop/concretagem-acabamento.jpg',
        'ferramentas-de-cortar-lixar-e-parafusar': '/images/carrossel-desktop/ferramentas-cortar-lixar-parafusar.jpg',
        'bombas-geradores-e-compressores': '/images/carrossel-desktop/bombas-geradores-compressores.jpg',
        'elevacao-movimentacao-e-remocao': '/images/carrossel-desktop/elevacao-movimentacao-remocao.jpg',
        'maquinas-de-solda-e-montagem': '/images/carrossel-desktop/maquinas-solda-montagem.jpg',
        'conservacao-e-limpeza': '/images/carrossel-desktop/conservacao-limpeza.jpg',
        'equipamentos-de-acesso-a-altura': '/images/carrossel-desktop/equipamentos-acesso-altura.jpg',
        'equipamentos-agricolas': '/images/carrossel-desktop/equipamentos-agricolas.jpg',
        'ferramentas-a-bateria': '/images/carrossel-desktop/ferramentas-bateria.jpg',
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {categories.map((category) => (
                <Card
                    key={category.slug}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-none bg-muted/30 overflow-hidden"
                    onClick={() => onSelectCategory(category.slug)}
                >
                    <div className="aspect-[4/3] overflow-hidden bg-white relative">
                        <img
                            src={images[category.slug] || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <CardContent className="p-4 bg-card">
                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors uppercase leading-tight">
                            {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            {category.families.length} sub-categorias
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
