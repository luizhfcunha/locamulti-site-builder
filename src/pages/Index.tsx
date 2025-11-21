import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Hammer, 
  Zap, 
  Wrench, 
  Package, 
  PaintBucket, 
  Cog, 
  Trees, 
  Shield,
  Clock,
  Headphones,
  Truck,
  CheckCircle2,
  MessageCircle,
  Building2,
  HardHat,
  Factory,
  TruckIcon,
  Warehouse,
  Users
} from "lucide-react";

const Index = () => {
  const categories = [
    { name: "Construção e Demolição", icon: Hammer },
    { name: "Concretagem e Vibração", icon: Cog },
    { name: "Energia e Geração", icon: Zap },
    { name: "Soldagem Profissional", icon: Shield },
    { name: "Movimentação de Cargas", icon: Package },
    { name: "Pintura e Acabamento", icon: PaintBucket },
    { name: "Ferramentas Hidráulicas", icon: Wrench },
    { name: "Jardinagem e Limpeza", icon: Trees },
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Equipamentos Revisados",
      description: "Todos os equipamentos são testados e revisados antes da locação"
    },
    {
      icon: Clock,
      title: "Troca Imediata",
      description: "Garantimos substituição rápida em caso de falha técnica"
    },
    {
      icon: Truck,
      title: "Entrega Programada",
      description: "Entrega e retirada nos horários combinados"
    },
    {
      icon: Headphones,
      title: "Suporte Especializado",
      description: "Equipe técnica disponível para orientações"
    },
    {
      icon: MessageCircle,
      title: "Atendimento WhatsApp",
      description: "Resposta rápida e orçamento ágil pelo WhatsApp"
    }
  ];

  const segments = [
    { name: "Construtoras", icon: Building2 },
    { name: "Engenheiros", icon: HardHat },
    { name: "Indústrias", icon: Factory },
    { name: "Logística", icon: TruckIcon },
    { name: "Metalúrgicas", icon: Shield },
    { name: "Agricultores", icon: Trees },
    { name: "Serralherias", icon: Wrench },
    { name: "Órgãos Públicos", icon: Users }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-lm-plum via-lm-plum/95 to-lm-ink min-h-[600px] flex items-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80')] bg-cover bg-center opacity-20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-white mb-6 leading-tight">
                Equipamentos Profissionais para Obra, Indústria e Manutenção
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Locação rápida, equipamentos revisados e suporte técnico especializado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="text-lg"
                  onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Solicitar Orçamento
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg bg-white hover:bg-white/90 border-2"
                  onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Ver Catálogo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categorias" className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Principais Categorias</h2>
              <p className="text-lg text-muted-foreground">
                Equipamentos profissionais para todas as necessidades
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card 
                    key={category.name}
                    className="p-6 hover:shadow-medium transition-all duration-300 cursor-pointer group border-2 hover:border-primary"
                  >
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold">{category.name}</h3>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                        Ver Equipamentos →
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Por Que Escolher a LocaMulti?</h2>
              <p className="text-lg text-muted-foreground">
                Confiança, qualidade e suporte em cada locação
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <Card 
                    key={benefit.title}
                    className="p-6 text-center hover:shadow-medium transition-all duration-300"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-semibold mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Segments Section */}
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Segmentos Atendidos</h2>
              <p className="text-lg text-muted-foreground">
                Soluções profissionais para diversos setores
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {segments.map((segment) => {
                const Icon = segment.icon;
                return (
                  <div 
                    key={segment.name}
                    className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-background transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-center">{segment.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-white mb-4">
                Precisa de um Orçamento Imediato?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Fale agora com a equipe da LocaMulti pelo WhatsApp
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="text-lg bg-white hover:bg-white/90 text-lm-ink"
                onClick={() => window.open("https://wa.me/5511999999999", "_blank")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar pelo WhatsApp
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
