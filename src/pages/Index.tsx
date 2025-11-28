import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BrandCarousel } from "@/components/BrandCarousel";
import { BenefitCard } from "@/components/BenefitCard";
import { SegmentCard } from "@/components/SegmentCard";
import { BRANDS_CAROUSEL } from "@/config/brands";
import { WHATSAPP } from "@/config/whatsapp";
import { Hammer, Zap, Wrench, Package, PaintBucket, Cog, Trees, Shield, Headphones, Truck, CheckCircle2, MessageCircle, Building2, HardHat, Factory, TruckIcon, Users, Sparkles } from "lucide-react";

const Index = () => {
  const categories = [{
    id: "construcao",
    title: "Construção e Demolição",
    icon: Hammer,
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "concretagem",
    title: "Concretagem e Vibração",
    icon: Cog,
    imageUrl: "/images/concretagem-vibracao.jpg"
  }, {
    id: "energia",
    title: "Energia e Geração",
    icon: Zap,
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "soldagem",
    title: "Soldagem Profissional",
    icon: Shield,
    imageUrl: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "movimentacao",
    title: "Movimentação de Cargas",
    icon: Package,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "pintura",
    title: "Pintura e Acabamento",
    icon: PaintBucket,
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "hidraulicas",
    title: "Ferramentas Hidráulicas",
    icon: Wrench,
    imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop"
  }, {
    id: "jardinagem",
    title: "Jardinagem e Limpeza Técnica",
    icon: Trees,
    imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?q=80&w=800&auto=format&fit=crop"
  }];

  const benefits = [{
    icon: CheckCircle2,
    title: "Equipamentos Revisados e Testados",
    description: "Todos os equipamentos passam por rigorosa revisão e testes antes da locação, garantindo máxima confiabilidade."
  }, {
    icon: Sparkles,
    title: "Troca Imediata em Caso de Falha",
    description: "Se houver qualquer problema técnico, substituímos o equipamento imediatamente sem custo adicional."
  }, {
    icon: Truck,
    title: "Entrega e Retirada Programada",
    description: "Logística eficiente com horários flexíveis para entrega e retirada de equipamentos."
  }, {
    icon: Headphones,
    title: "Suporte Técnico Especializado",
    description: "Equipe técnica qualificada disponível para orientações sobre uso e manutenção dos equipamentos."
  }, {
    icon: MessageCircle,
    title: "Agilidade no WhatsApp",
    description: "Atendimento rápido e orçamento ágil pelo WhatsApp, facilitando sua comunicação conosco."
  }];

  const segments = [{
    title: "Construtoras",
    icon: Building2
  }, {
    title: "Engenheiros",
    icon: HardHat
  }, {
    title: "Indústrias",
    icon: Factory
  }, {
    title: "Logística",
    icon: TruckIcon
  }, {
    title: "Metalúrgicas",
    icon: Shield
  }, {
    title: "Agricultores",
    icon: Trees
  }, {
    title: "Serralherias",
    icon: Wrench
  }, {
    title: "Órgãos Públicos",
    icon: Users
  }];

  const handleCategoryClick = (categoryId: string) => {
    window.location.href = `/catalogo?categoria=${categoryId}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-lm-plum via-lm-plum/95 to-lm-ink min-h-[600px] flex items-center bg-primary">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070')] bg-cover bg-center opacity-15" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
            <div className="max-w-3xl">
              <h1 className="text-white mb-6 leading-tight">Locação de Equipamentos e Ferramentas Especiais</h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">Locação profissional para obras, indústrias e manutenção</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <WhatsappCTA text="Orçamento Rápido" href={WHATSAPP.homeHero} size="lg" className="text-lg font-semibold" />
                <Button size="lg" variant="outline" className="text-lg font-semibold bg-white hover:bg-lm-muted text-lm-ink border-0" onClick={() => window.location.href = "/catalogo"}>
                  Ver Catálogo Completo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Carrossel */}
        <section id="categorias" className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">Principais Categorias</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Equipamentos profissionais para todas as necessidades técnicas e industriais
              </p>
            </div>
            <CategoryCarousel categories={categories} onCategoryClick={handleCategoryClick} />
          </div>
        </section>

        {/* Brand Carousel Section */}
        <section className="py-16 bg-background border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Marcas de Confiança</h2>
              <p className="text-muted-foreground">Trabalhamos com as melhores marcas do mercado</p>
            </div>
            <BrandCarousel brands={BRANDS_CAROUSEL} />
          </div>
        </section>

        {/* Benefits Section - Por que escolher a LocaMulti? */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">Por Que Escolher a LocaMulti?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confiança, qualidade e suporte técnico em cada locação
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {benefits.map(benefit => <BenefitCard key={benefit.title} title={benefit.title} description={benefit.description} icon={benefit.icon} />)}
            </div>
          </div>
        </section>

        {/* Segments Section - Segmentos Atendidos */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">Segmentos que Atendemos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Soluções profissionais para diversos setores da indústria e construção
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {segments.map(segment => <SegmentCard key={segment.title} title={segment.title} icon={segment.icon} />)}
            </div>
          </div>
        </section>

        {/* CTA Section - Orçamento Rápido */}
        <section className="py-20 bg-gradient-to-br from-lm-plum to-lm-plum/90 relative overflow-hidden bg-primary-foreground">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094271901-8022df4466f9?q=80')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white mb-6">Precisa de um Orçamento Imediato?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Fale agora com a equipe da LocaMulti pelo WhatsApp e receba seu orçamento em minutos.
              </p>
              <WhatsappCTA text="Falar pelo WhatsApp Agora" href={WHATSAPP.homeOrcamento} size="lg" variant="outline" className="text-lg font-semibold bg-white hover:bg-lm-muted text-lm-ink border-0 shadow-button" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;