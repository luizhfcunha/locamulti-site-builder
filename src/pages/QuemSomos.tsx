import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { WHATSAPP } from "@/config/whatsapp";
import { Shield, Zap, Wrench, Truck, CheckCircle2, Clock, Users, Award, Factory, Building2, HardHat, Package, Quote } from "lucide-react";
const QuemSomos = () => {
  const diferenciais = [{
    icon: CheckCircle2,
    title: "Equipamentos Revisados",
    description: "Toda nossa frota passa por manutenção preventiva e testes rigorosos antes de cada locação."
  }, {
    icon: Zap,
    title: "Troca Imediata",
    description: "Caso ocorra qualquer problema técnico, realizamos a substituição do equipamento em até 24 horas."
  }, {
    icon: Truck,
    title: "Logística Integrada",
    description: "Entrega e retirada programada conforme sua necessidade, com frota própria em toda região metropolitana."
  }, {
    icon: Wrench,
    title: "Suporte Técnico",
    description: "Equipe especializada disponível para orientação de uso e solução de dúvidas técnicas."
  }, {
    icon: Clock,
    title: "Atendimento Ágil",
    description: "Resposta rápida via WhatsApp e orçamentos elaborados em até 2 horas úteis."
  }, {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Certificados de conformidade, EPIs inclusos e orientação sobre normas de segurança do trabalho."
  }];
  const segmentos = [{
    icon: HardHat,
    name: "Construtoras e Engenharia"
  }, {
    icon: Factory,
    name: "Indústrias e Metalúrgicas"
  }, {
    icon: Building2,
    name: "Manutenção Predial"
  }, {
    icon: Package,
    name: "Logística e Armazenagem"
  }, {
    icon: Users,
    name: "Órgãos Públicos"
  }, {
    icon: Award,
    name: "Serralherias e Caldeirarias"
  }];
  const depoimentos = [{
    name: "Carlos Alberto",
    company: "Construtora Horizonte",
    text: "Sou cliente há 8 anos. Todas as vezes tive ótimas soluções da parte da empresa. Todos os tipos de equipamentos p obra. Pronta reposição de equipamentos (o q é raro), muito flexíveis e excelente atendimento. Sem dúvidas a melhor q conheci. Parabéns aos envolvidos!"
  }, {
    name: "Mariana Santos",
    company: "Metalúrgica Industrial SP",
    text: "Atendimento excelente e suporte técnico de qualidade. Recomendo para qualquer tipo de obra ou manutenção."
  }, {
    name: "Roberto Lima",
    company: "Engenharia RJ",
    text: "Profissionalismo e agilidade definem a LocaMulti. Quando precisamos, eles sempre entregam no prazo."
  }];
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-primary">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
                Quem Somos
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Especialistas em locação de equipamentos profissionais para obra, 
                indústria e manutenção técnica desde 2010.
              </p>
            </div>
          </div>
        </section>

        {/* História */}
        <section className="py-16 md:py-20 bg-primary rounded-none">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center bg-primary">
                <div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                    Nossa História
                  </h2>
                  <div className="space-y-4 text-white/90 leading-relaxed">
                    <p>
                      Fundada em 2010, a <strong>Locamulti</strong> nasceu da necessidade do mercado 
                      por um fornecedor confiável de equipamentos industriais e para construção civil.
                    </p>
                    <p>
                      Com mais de uma década de experiência, construímos nossa reputação através 
                      da qualidade dos equipamentos, pontualidade nas entregas e atendimento 
                      técnico especializado.
                    </p>
                    <p>
                      Hoje, atendemos construtoras, indústrias, órgãos públicos e profissionais 
                      autônomos em toda região metropolitana, com uma frota moderna e constantemente 
                      renovada.
                    </p>
                  </div>
                </div>
                <div className="relative h-80 rounded-card overflow-hidden bg-lm-ink/20">
                  <img alt="LocaMulti - Equipamentos Industriais" src="/lovable-uploads/60169cc1-e31d-464b-9789-fb9ebd1f389b.webp" className="w-full h-full object-cover opacity-80 border-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* O que fazemos */}
        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6 text-center">
                O Que Fazemos
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                Oferecemos soluções completas em locação de equipamentos profissionais 
                para diversos segmentos do mercado.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    Locação de Equipamentos
                  </h3>
                  <p className="text-muted-foreground">
                    Mais de 500 equipamentos disponíveis para construção, soldagem, 
                    energia, movimentação e acabamento.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wrench className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    Manutenção Preventiva
                  </h3>
                  <p className="text-muted-foreground">
                    Toda frota passa por revisão técnica completa e testes de segurança 
                    antes de cada locação.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    Entrega e Logística
                  </h3>
                  <p className="text-muted-foreground">
                    Entrega programada na sua obra ou empresa com frota própria 
                    e profissionais capacitados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="bg-lm-muted py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Nossos Diferenciais
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                O que nos torna referência no mercado de locação de equipamentos profissionais.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {diferenciais.map((diferencial, index) => <div key={index} className="bg-background p-6 rounded-card shadow-card hover:shadow-medium transition-all duration-base">
                    <diferencial.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                      {diferencial.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {diferencial.description}
                    </p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Segmentos Atendidos */}
        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                Segmentos que Atendemos
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                Soluções especializadas para diferentes setores da indústria e construção.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {segmentos.map((segmento, index) => <div key={index} className="flex flex-col items-center text-center p-6 bg-lm-muted rounded-card hover:shadow-card transition-all duration-base group">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <segmento.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground">
                      {segmento.name}
                    </h3>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                O Que Dizem Nossos Clientes
              </h2>
              <p className="text-lg text-white/80 text-center mb-12 max-w-3xl mx-auto">
                Depoimentos de quem confia na LocaMulti para suas operações.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {depoimentos.map((depoimento, index) => <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-card border border-white/20">
                    <Quote className="h-8 w-8 text-primary mb-4" />
                    <p className="text-white/90 italic mb-6 leading-relaxed">
                      "{depoimento.text}"
                    </p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="font-heading font-bold text-white">
                        {depoimento.name}
                      </p>
                      <p className="text-sm text-white/70">
                        {depoimento.company}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-20 bg-stone-950">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 bg-neutral-950">Pronto para Trabalhar com a LOCAMULTI?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Entre em contato agora e descubra como podemos ajudar seu projeto 
                com equipamentos de qualidade e atendimento profissional.
              </p>
              <WhatsappCTA text="Falar com a Equipe" href={WHATSAPP.quemSomos} variant="outline" size="lg" className="bg-white text-lm-ink hover:bg-white/90 border-0 text-lg px-8" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default QuemSomos;