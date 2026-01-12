import { Category } from "@/types/catalog";
import { Card, CardContent } from "@/components/ui/card";

interface CategoryGridProps {
    categories: Category[];
    onSelectCategory: (slug: string) => void;
}

export const CategoryGrid = ({ categories, onSelectCategory }: CategoryGridProps) => {

    // Map slugs to local images (matching catalogo_locamulti_2026.json slugs)
    const images: Record<string, string> = {
        'demolicaoeperfuracao': '/images/Carrossel Desktop/demolicao-perfuracao.jpg',
        'concretagemeacabamento': '/images/Carrossel Desktop/concretagem-acabamento.jpg',
        'ferramentasdecortarlixareparafusar': '/images/Carrossel Desktop/ferramentas-cortar-lixar-parafusar.jpg',
        'bombasgeradoresecompressores': '/images/Carrossel Desktop/bombas-geradores-compressores.jpg',
        'elevacaomovimentacaoeremocao': '/images/Carrossel Desktop/elevacao-movimentacao-remocao.jpg',
        'maquinasdesoldaemontagem': '/images/Carrossel Desktop/maquinas-solda-montagem.jpg',
        'conservacaoelimpeza': '/images/Carrossel Desktop/conservacao-limpeza.jpg',
        'equipamentosdeacessoaaltura': '/images/Carrossel Desktop/equipamentos-acesso-altura.jpg',
        'equipamentosagricolas': '/images/Carrossel Desktop/equipamentos-agricolas.jpg',
        'ferramentasabateria': '/images/Carrossel Desktop/ferramentas-bateria.jpg',
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
