import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "@/data/catalogData";
import { WHATSAPP } from "@/config/whatsapp";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Product } from "@/types/catalog";

export const FeaturedEquipmentCarousel = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1
  }, [Autoplay({
    delay: 4000,
    stopOnInteraction: true
  })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  useEffect(() => {
    // Fetch products locally
    const loadProducts = () => {
      const allProducts = getAllProducts();

      // Specific list requested by the user
      const featuredNames = [
        "MARTELO DEMOLIDOR 30 Kg",
        "MARTELO ROMPEDOR 5 kg",
        "MARTELO PERFURADOR 5 kg",
        "FURADEIRA DE IMPACTO 1/2\"",
        "PERFURATRIZ DIAMANTADA DMS 240 HUSQVARNA",
        "ALISADORA DE PISO GASOLINA TPT900",
        "CORTADORA DE PISO GASOLINA TCC450",
        "VIBRADOR DE IMERSÃO PORTÁTIL GVC",
        "ANDAIME TUBULAR 1,5M",
        "ROÇADEIRA LATERAL TBC43X"
      ];

      // Filter and sort based on the specific list order
      const featured = featuredNames.map(name => {
        // Flexible matching: check if product name starts with or contains the requested name (case insensitive)
        return allProducts.find(p => p.name.toUpperCase().includes(name.toUpperCase()));
      }).filter((p): p is Product => p !== undefined);

      // Remove duplicates if any (though find returns first match)
      const uniqueFeatured = Array.from(new Set(featured.map(p => p.id)))
        .map(id => featured.find(p => p.id === id)!);

      setProducts(uniqueFeatured);
      setLoading(false);
    };

    // Simulate async to keep consistent UX
    setTimeout(loadProducts, 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  const getWhatsAppMessage = (productName: string) => {
    const message = `Olá! Gostaria de solicitar um orçamento para o equipamento: ${productName}`;
    return `https://wa.me/5562984194024?text=${encodeURIComponent(message)}`; // Fixed phone number from config if needed, or keeping explicit as in original
  };

  const getProductLink = (product: Product) => {
    // Link to catalog with search query for exact match or category filter
    if (product.categorySlug && product.familySlug) {
      return `/catalogo?categoria=${product.categorySlug}&familia=${product.familySlug}`;
    }
    return `/catalogo?q=${encodeURIComponent(product.name)}`;
  };
  if (loading) {
    return <section className="py-16 bg-lm-orange">
      <div className="container mx-auto px-4">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-white/20 rounded w-64 mb-8"></div>
          <div className="flex gap-6">
            {[1, 2, 3].map(i => <div key={i} className="w-72 h-96 bg-white/10 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    </section>;
  }
  if (products.length === 0) return null;
  return <section className="py-16 md:py-20 bg-lm-orange relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-64 h-64 bg-lm-orange/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
    <div className="absolute bottom-0 right-0 w-64 h-64 bg-lm-terrac/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-3">
          Equipamentos Disponíveis para Locação
        </h2>
        <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
          Confira alguns dos nossos equipamentos mais procurados
        </p>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button onClick={scrollPrev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 border border-white/20" aria-label="Anterior">
          <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </button>
        <button onClick={scrollNext} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full transition-all duration-300 border border-white/20" aria-label="Próximo">
          <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </button>

        {/* Embla Carousel */}
        <div className="overflow-hidden mx-6 md:mx-10" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {products.map(product => <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] pl-4 md:pl-6">
              <div className="bg-lm-muted rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                {/* Product Image */}
                <div className="relative aspect-square bg-white p-4">
                  <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-full object-contain" loading="lazy" />
                  {product.brand && <span className="absolute top-3 left-3 bg-lm-plum text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.brand}
                  </span>}
                </div>

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-lm-ink text-sm md:text-base uppercase line-clamp-2 mb-3">
                    {product.name}
                  </h3>

                  <Link to={getProductLink(product)} className="text-lm-orange hover:text-lm-terrac font-semibold text-sm flex items-center gap-1 mb-4 transition-colors">
                    + Detalhes do equipamento
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="mt-auto space-y-2">
                    <a href={getWhatsAppMessage(product.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold rounded-lg transition-all duration-200 text-sm">
                      <img src="/lovable-uploads/c5861fea-0072-4651-9ee0-c32e148f0e85.png" alt="WhatsApp" className="w-4 h-4" />
                      WhatsApp
                    </a>
                    <a href={WHATSAPP.homeHero} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-2.5 bg-lm-orange hover:bg-lm-terrac text-white font-semibold rounded-lg transition-all duration-200 text-sm">
                      Orçamento Rápido
                    </a>
                  </div>
                </div>
              </div>
            </div>)}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8">
          {scrollSnaps.map((_, index) => <button key={index} onClick={() => scrollTo(index)} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === selectedIndex ? "bg-lm-orange w-8" : "bg-white/40 hover:bg-white/60"}`} aria-label={`Ir para slide ${index + 1}`} />)}
        </div>
      </div>

      {/* Ver Todos Button */}
      <div className="text-center mt-10 md:mt-12">
        <Button asChild size="lg" className="bg-white text-lm-ink hover:bg-lm-orange hover:text-white font-semibold text-base px-8 transition-colors">
          <Link to="/catalogo">
            Ver Todos os Equipamentos
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  </section>;
};