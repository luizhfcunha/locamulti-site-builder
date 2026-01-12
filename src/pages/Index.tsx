import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { CategoryCarousel } from "@/components/CategoryCarousel";
import { BrandCarousel } from "@/components/BrandCarousel";
import { FeaturedEquipmentCarousel } from "@/components/FeaturedEquipmentCarousel";
import { BenefitCard } from "@/components/BenefitCard";
import { SegmentCard } from "@/components/SegmentCard";
import { BRANDS_CAROUSEL } from "@/config/brands";
import { WHATSAPP } from "@/config/whatsapp";
import {
  Hammer,
  Zap,
  Wrench,
  Package,
  PaintBucket,
  Cog,
  Trees,
  Shield,
  Headphones,
  Truck,
  CheckCircle2,
  MessageCircle,
  Building2,
  HardHat,
  Factory,
  TruckIcon,
  Users,
  Sparkles,
} from "lucide-react";
const Index = () => {
  const categories = [
    {
      id: "DEMOLIÇÃO E PERFURAÇÃO",
      title: "Demolição e Perfuração",
      icon: Hammer,
      imageUrl: "/images/carrossel-desktop/demolicao-perfuracao.jpg",
    },
    {
      id: "CONCRETAGEM E ACABAMENTO",
      title: "Concretagem e Acabamento",
      icon: Cog,
      imageUrl: "/images/carrossel-desktop/concretagem-acabamento.jpg",
    },
    {
      id: "FERRAMENTAS DE CORTAR, LIXAR E PARAFUSAR",
      title: "Ferramentas de Cortar, Lixar e Parafusar",
      icon: Wrench,
      imageUrl: "/images/carrossel-desktop/ferramentas-cortar-lixar-parafusar.jpg",
    },
    {
      id: "BOMBAS, GERADORES E COMPRESSORES",
      title: "Bombas, Geradores e Compressores",
      icon: Zap,
      imageUrl: "/images/carrossel-desktop/bombas-geradores-compressores.jpg",
    },
    {
      id: "ELEVAÇÃO, MOVIMENTAÇÃO E REMOÇÃO",
      title: "Elevação, Movimentação e Remoção",
      icon: Package,
      imageUrl: "/images/carrossel-desktop/elevacao-movimentacao-remocao.jpg",
    },
    {
      id: "MÁQUINAS DE SOLDA E MONTAGEM",
      title: "Máquinas de Solda e Montagem",
      icon: Shield,
      imageUrl: "/images/carrossel-desktop/maquinas-solda-montagem.jpg",
    },
    {
      id: "CONSERVAÇÃO E LIMPEZA",
      title: "Conservação e Limpeza",
      icon: PaintBucket,
      imageUrl: "/images/carrossel-desktop/conservacao-limpeza.jpg",
    },
    {
      id: "EQUIPAMENTOS DE ACESSO A ALTURA",
      title: "Equipamentos de Acesso à Altura",
      icon: Package,
      imageUrl: "/images/carrossel-desktop/equipamentos-acesso-altura.jpg",
    },
    {
      id: "EQUIPAMENTOS AGRÍCOLAS",
      title: "Equipamentos Agrícolas",
      icon: Trees,
      imageUrl: "/images/carrossel-desktop/equipamentos-agricolas.jpg",
    },
    {
      id: "FERRAMENTAS À BATERIA",
      title: "Ferramentas à Bateria",
      icon: Zap,
      imageUrl: "/images/carrossel-desktop/ferramentas-bateria.jpg",
    },
  ];
  const benefits = [
    {
      icon: CheckCircle2,
      title: "Equipamentos Revisados e Testados",
      description:
        "Todos os equipamentos passam por rigorosa revisão e testes antes da locação, garantindo máxima confiabilidade.",
    },
    {
      icon: Sparkles,
      title: "Troca Imediata em Caso de Falha",
      description: "Se houver qualquer problema técnico, substituímos o equipamento imediatamente sem custo adicional.",
    },
    {
      icon: Truck,
      title: "Entrega e Retirada Programada",
      description: "Logística eficiente com horários flexíveis para entrega e retirada de equipamentos.",
    },
    {
      icon: Headphones,
      title: "Suporte Técnico Especializado",
      description: "Equipe técnica qualificada disponível para orientações sobre uso e manutenção dos equipamentos.",
    },
    {
      icon: MessageCircle,
      title: "Agilidade no WhatsApp",
      description: "Atendimento rápido e orçamento ágil pelo WhatsApp, facilitando sua comunicação conosco.",
    },
  ];
  const segments = [
    {
      title: "Construtoras",
      icon: Building2,
    },
    {
      title: "Engenheiros",
      icon: HardHat,
    },
    {
      title: "Indústrias",
      icon: Factory,
    },
    {
      title: "Logística",
      icon: TruckIcon,
    },
    {
      title: "Metalúrgicas",
      icon: Shield,
    },
    {
      title: "Agricultores",
      icon: Trees,
    },
    {
      title: "Serralherias",
      icon: Wrench,
    },
    {
      title: "Órgãos Públicos",
      icon: Users,
    },
  ];
  const handleCategoryClick = (categoryId: string) => {
    window.location.href = `/catalogo?categoria=${encodeURIComponent(categoryId)}`;
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
          <div
            className="absolute inset-0 bg-cover bg-[position:70%_center] md:bg-center"
            style={{
              backgroundImage: "url('/images/hero-banner-locamulti.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-16 lg:py-20">
            <div className="max-w-2xl lg:max-w-3xl">
              <h1 className="mb-4 md:mb-6 leading-tight text-lm-plum drop-shadow-sm text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
                Locação de Equipamentos e Ferramentas Especiais
              </h1>
              <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 leading-relaxed max-w-xl lg:max-w-2xl text-lm-ink/80">
                Aluguel de Máquinas para Montagem de Infraestruturas,
                <br />
                Obras Industriais e Construção Civil.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <WhatsappCTA
                  text="Orçamento Rápido"
                  href={WHATSAPP.homeHero}
                  size="lg"
                  className="text-base md:text-lg font-semibold"
                />
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => (window.location.href = "/catalogo")}
                  className="text-base md:text-lg font-semibold border-0 bg-primary text-secondary"
                >
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
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-medium">
                A mais completa linha de Equipamentos e Ferramentas para Construção Civil e Montagens Industriais
                Eletromecânicas de nossa Região!
              </p>
            </div>
            <CategoryCarousel categories={categories} onCategoryClick={handleCategoryClick} />
          </div>
        </section>

        {/* Brand Carousel Section */}
        <section className="py-16 bg-background border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Marcas de Confiança</h2>
              <div className="max-w-3xl mx-auto space-y-3">
                <p className="text-muted-foreground">
                  Trabalhamos com marcas líderes e reconhecidas no mercado, garantindo equipamentos confiáveis, seguros
                  e de alto desempenho.
                </p>
                <p className="text-muted-foreground">
                  A escolha dos nossos parceiros reflete nosso compromisso com qualidade, eficiência e melhores
                  resultados para cada cliente.
                </p>
                <p className="text-muted-foreground font-medium">
                  Conheça os parceiros que acreditam em nosso trabalho e nos apoiam em nossa jornada:
                </p>
              </div>
            </div>
            <BrandCarousel brands={BRANDS_CAROUSEL} />
          </div>
        </section>

        {/* Featured Equipment Section */}
        <FeaturedEquipmentCarousel />

        {/* Benefits Section - Por que escolher a LocaMulti? */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">
                Por Que Escolher a <span className="font-bold text-primary">LOCAMULTI</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confiança, qualidade e suporte técnico em cada locação
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {benefits.map((benefit) => (
                <BenefitCard
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                  icon={benefit.icon}
                />
              ))}
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
              {segments.map((segment) => (
                <SegmentCard key={segment.title} title={segment.title} icon={segment.icon} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Orçamento Rápido */}
        <section className="py-20 bg-gradient-to-br from-lm-plum to-lm-plum/90 relative overflow-hidden bg-primary-foreground">
          <div className="absolute inset-0 bg-[url('/images/cta-background.jpg')] bg-cover bg-center bg-fixed opacity-20" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white mb-6">Precisa de um Orçamento Imediato?</h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Fale agora com nossa equipe de atendentes técnicos, que eles te auxiliarão a definir a melhor solução
                para sua necessidade!
              </p>
              <WhatsappCTA
                text="Falar pelo WhatsApp Agora"
                href={WHATSAPP.homeOrcamento}
                size="lg"
                variant="outline"
                className="text-lg font-semibold bg-white hover:bg-lm-muted text-lm-ink border-0 shadow-button"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
export default Index;
