import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { WHATSAPP } from "@/config/whatsapp";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Users, 
  Wrench, 
  CheckCircle2, 
  Factory, 
  Building2, 
  HardHat, 
  Quote,
  DollarSign,
  PiggyBank,
  Package,
  Settings,
  RefreshCw,
  TrendingDown,
  Briefcase,
  Store,
  Hammer
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
};

const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true, margin: "-50px" }
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
};

const QuemSomos = () => {
  const vantagensLocacao = [
    {
      icon: DollarSign,
      title: "Investimento de Baixo Custo",
      description: "Pague apenas pelo período de utilização do equipamento."
    },
    {
      icon: PiggyBank,
      title: "Preservação do Capital de Giro",
      description: "Não há necessidade de investir na compra de equipamentos."
    },
    {
      icon: Package,
      title: "Elimina Despesas de Patrimônio",
      description: "Sem custos de controle de patrimônio e armazenagem."
    },
    {
      icon: Settings,
      title: "Sem Custos de Manutenção",
      description: "Eliminação de custos de manutenção e conservação."
    },
    {
      icon: RefreshCw,
      title: "Agilidade na Substituição",
      description: "Troca rápida de equipamentos que apresentarem falha, por máquinas revisadas e prontas."
    },
    {
      icon: TrendingDown,
      title: "Sem Depreciação",
      description: "Não há imobilização ou depreciação do bem."
    }
  ];

  const diferenciais = [
    {
      icon: MapPin,
      title: "Excelente Localização",
      description: "Facilidade para carregamento e descarregamento de equipamentos."
    },
    {
      icon: Users,
      title: "Atendimento Técnico Personalizado",
      description: "Definimos a necessidade específica de cada cliente."
    },
    {
      icon: CheckCircle2,
      title: "Entrega Técnica",
      description: "Realização de testes funcionais e instruções operacionais."
    },
    {
      icon: RefreshCw,
      title: "Substituição Imediata",
      description: "Troca de equipamentos com falha por outros revisados e testados."
    },
    {
      icon: Wrench,
      title: "Assistência Técnica nas Obras",
      description: "Plano de manutenção preventiva de todos os equipamentos conforme tempo de uso."
    }
  ];

  const segmentos = [
    {
      icon: HardHat,
      name: "Construtoras e Engenharia"
    },
    {
      icon: Factory,
      name: "Indústrias e Metalúrgicas"
    },
    {
      icon: Building2,
      name: "Manutenção Predial"
    },
    {
      icon: Briefcase,
      name: "Prestadores de Serviço e Montagens Industriais"
    },
    {
      icon: Hammer,
      name: "Serralherias e Caldeirarias"
    },
    {
      icon: Store,
      name: "Comércio e Pessoas Físicas"
    }
  ];

  const depoimentos = [
    {
      name: "Matheus Monteiro",
      text: "Sou cliente há 8 anos. Todas as vezes tive ótimas soluções da parte da empresa. Todos os tipos de equipamentos p obra. Pronta reposição de equipamentos (o q é raro), muito flexíveis e excelente atendimento. Sem dúvidas a melhor q conheci. Parabéns aos envolvidos!"
    },
    {
      name: "Walmir Junior",
      text: "Atendimento muito bom e grande diversidade em ferramentas e máquinas para locação."
    },
    {
      name: "Vinicius Gonçalves Araujo",
      text: "Loja muito completa, máquinas excelentes. Recomendo demais."
    }
  ];

  const faqItems = [
    {
      question: "Quais os documentos necessários para cadastro?",
      answer: `**PESSOA JURÍDICA:**
• Contrato Social (cópia)
• CNPJ (cópia)
• Inscrição Estadual (cópia)
• Email / Endereço Completo / Endereço de Cobrança
• Telefones de Contato / Responsáveis por cada departamento
• Informações Comerciais (2 contatos)
• Endereço completo da obra onde o equipamento será utilizado
• Nome do encarregado ou responsável pela empresa

**PESSOA FÍSICA:**
• RG, CNH (cópia)
• Comprovante de Endereço Residencial atual
• Referências Comerciais (2 contatos)
• Referências Pessoais (2 contatos)`
    },
    {
      question: "Quais são os tipos de locações oferecidos?",
      answer: "Diária, Semanal, Quinzenal e Mensal, que deverá ser decidido pelo locatário na hora da emissão do contrato. A tabela de preço varia conforme o tipo de locação."
    },
    {
      question: "Como funciona a Locação Diária?",
      answer: "Corresponde a 24 horas. Se o equipamento foi locado para uma diária às 8h30min de segunda-feira, a diária terminará às 8h30min de terça-feira. Caso o equipamento não seja entregue, será cobrado o valor da diária por cada dia até a data da devolução."
    },
    {
      question: "Como funciona a Locação Semanal?",
      answer: "O período corresponde a 7 dias. Exemplo: equipamento locado dia 10 às 8:30 horas, deverá ser entregue dia 17 às 8:30 horas."
    },
    {
      question: "Como funciona a Locação Quinzenal?",
      answer: "O período corresponde a 15 dias. Exemplo: equipamento locado dia 01 às 8:30 horas, deverá ser entregue dia 16 às 8:30 horas."
    },
    {
      question: "Como funciona a Locação Mensal?",
      answer: "O período corresponde a 30 dias."
    },
    {
      question: "Posso mudar o tipo de locação com o contrato em andamento?",
      answer: "Não. Se o Locatário decidir mudar o tipo de locação (ex: de diária para mensal), só poderá fazê-lo após o término do contrato em andamento, mediante solicitação por escrito ou email formal. O equipamento não precisa ser devolvido; após o vencimento do contrato em vigência, será emitido o novo contrato."
    },
    {
      question: "Preciso ir até a locadora para renovar o contrato?",
      answer: "Não é necessário. Os contratos são renovados automaticamente, e os pagamentos poderão ser feitos na sede da locadora, por boleto bancário ou depósito em conta."
    },
    {
      question: "Como funciona a tabela de preços?",
      answer: "O valor da locação varia conforme o tipo de locação escolhido (diário, semanal, quinzenal ou mensal). Cabe ao locatário escolher dentro do tempo estimado da sua obra ou reforma."
    },
    {
      question: "Qual o horário de expediente?",
      answer: "De segunda à sexta-feira de 8:00h às 18:00h e sábados de 8:00h às 12:00h."
    },
    {
      question: "Posso fazer retirada ou locação por terceiros?",
      answer: "Se não for a própria pessoa titular do cadastro, somente será locado ou retirado equipamento com a devida autorização do responsável, seja por email, fax, ordem de serviço, ordem de compra ou autorização em papel timbrado da empresa locatária, devidamente assinado."
    },
    {
      question: "E se o equipamento locado não funcionar?",
      answer: "Todos os equipamentos são testados na presença do locatário. Caso apresente algum problema durante o período locado, a Empresa locadora deverá ser notificada de imediato para que sejam tomadas as devidas providências."
    },
    {
      question: "Serão cobrados sábados, domingos e feriados?",
      answer: "Sim, o período de locação é corrido dentro do intervalo solicitado."
    },
    {
      question: "A empresa entrega e busca equipamento nas obras?",
      answer: "Não dispomos de serviço de frete próprio da empresa. Indicamos uma empresa terceirizada, ficando a critério do locatário aceitar ou não a sugestão."
    },
    {
      question: "A locação de equipamento é com operador?",
      answer: "Não. Locamos somente a máquina, sem operador. É importante que na retirada do equipamento venha pessoa com habilidades para o manuseio da máquina. Esta pessoa receberá instruções operacionais para o melhor aproveitamento do equipamento locado."
    },
    {
      question: "E se o equipamento que loquei for roubado?",
      answer: "O responsável pelo equipamento é a pessoa Física ou Jurídica que fez o cadastro, ficando totalmente responsável pelo equipamento locado, conforme cláusulas do contrato de locação."
    },
    {
      question: "Qual o horário para devolução dos equipamentos?",
      answer: "A locação dos equipamentos será sempre feita de segunda a sábado, entre 8:00h e 12:00h, sendo que a devolução deve ser realizada até o mesmo horário em que foi coletado."
    },
    {
      question: "E se eu não devolver o equipamento dentro do prazo?",
      answer: "O contrato será automaticamente renovado, pelo mesmo período, com as mesmas condições."
    },
    {
      question: "Já tenho um equipamento locado, posso locar mais equipamentos?",
      answer: "Sim. Cada vez que ocorre uma nova locação, é feito um novo contrato. Cada contrato pode conter vários equipamentos."
    },
    {
      question: "Posso devolver o equipamento antes do término do contrato de locação?",
      answer: "Sim. A cobrança será proporcional ao período de utilização. A única exceção é na primeira locação, que é cobrado o período completo, independente da devolução antecipada do equipamento."
    },
    {
      question: "Quais as formas de pagamento possíveis?",
      answer: "Boleto bancário, cheque, dinheiro ou cartões de crédito e débito Visa, MasterCard e Dinner's Club."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-primary">
        {/* Nossa História */}
        <section className="py-16 md:py-20 bg-primary rounded-none">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center bg-primary">
                <motion.div {...fadeInLeft}>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">Nossa História</h2>
                  <div className="space-y-4 text-white/90 leading-relaxed">
                    <p>
                      A <strong className="font-bold text-primary-foreground">LOCAMULTI</strong> chegou à Anápolis para suprir uma demanda do mercado de locação de máquinas, nos segmentos de Construção Civil, Montagem Eletromecânica Industrial, Manutenção e Mecânica pesada, ofertando uma ampla variedade de equipamentos.
                    </p>
                    <p>
                      Disponibilizamos também ferramentas para trabalhos residenciais, prediais e comerciais, para as mais diversas aplicações, como também equipamentos específicos para instalações de infraestruturas mecânicas, elétricas e civis.
                    </p>
                    <p>
                      A <strong className="font-bold text-primary-foreground">LOCAMULTI</strong> busca criar um ambiente colaborativo, de aprendizado contínuo entre sua equipe, fornecedores e clientes, que aumenta a qualidade do nosso atendimento e a competitividade de nossos equipamentos, conquistando parcerias de sucesso.
                    </p>
                    <p>
                      Pretendendo alcançar o reconhecimento e a confiança de nossos clientes, trabalhamos com honestidade e objetividade, com uma equipe técnica preparada e treinada para atender com excelência e competência quaisquer necessidades e dúvidas de nossos parceiros.
                    </p>
                  </div>
                </motion.div>
                <motion.div 
                  className="relative h-80 rounded-card overflow-hidden bg-lm-ink/20"
                  {...fadeInRight}
                >
                  <img 
                    alt="LOCAMULTI - Fachada da Loja em Anápolis" 
                    src="/images/loja-locamulti.jpg" 
                    className="w-full h-full object-cover opacity-90" 
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Vantagens da Locação */}
        <section className="bg-lm-plum py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 text-center">
                  Vantagens da Locação
                </h2>
                <p className="text-lg text-white/80 text-center mb-12 max-w-3xl mx-auto">
                  O aluguel de equipamentos é a melhor opção para o empreendedor que deseja diminuir custos operacionais usufruindo dos benefícios e segurança da locação.
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                {...staggerContainer}
              >
                {vantagensLocacao.map((vantagem, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-card border border-white/20 hover:bg-white/15 transition-all duration-base"
                    variants={staggerItem}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                  >
                    <vantagem.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-heading text-lg font-bold text-white mb-2">{vantagem.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{vantagem.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Nunca loquei um equipamento */}
              <motion.div 
                className="mt-12 bg-white/5 border border-white/20 rounded-card p-8"
                {...fadeInUp}
              >
                <h3 className="font-heading text-xl font-bold text-white mb-4">
                  Nunca Loquei um Equipamento, Qual o Procedimento?
                </h3>
                <p className="text-white/80 leading-relaxed">
                  Confirmar se o equipamento está disponível no momento. Caso não esteja, poderá ser solicitada reserva do mesmo. Assim que estiver disponível, entramos em contato e confirmaremos se ainda há interesse na locação do equipamento.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Nossos Diferenciais */}
        <section className="bg-lm-muted py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                  Nossos Diferenciais
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                  O que nos torna referência no mercado de locação de equipamentos profissionais.
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                {...staggerContainer}
              >
                {diferenciais.map((diferencial, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-background p-6 rounded-card shadow-card hover:shadow-medium transition-all duration-base"
                    variants={staggerItem}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                  >
                    <diferencial.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">{diferencial.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{diferencial.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Segmentos Atendidos */}
        <section className="bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                  Segmentos que Atendemos
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                  Soluções especializadas para diferentes setores da indústria e construção.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-6"
                {...staggerContainer}
              >
                {segmentos.map((segmento, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-center text-center p-6 bg-lm-muted rounded-card hover:shadow-card transition-all duration-base group"
                    variants={staggerItem}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <segmento.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-heading font-bold text-foreground">{segmento.name}</h3>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section className="py-16 md:py-20 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                  O Que Dizem Nossos Clientes
                </h2>
                <p className="text-lg text-white/80 text-center mb-12 max-w-3xl mx-auto">
                  Depoimentos de quem confia na <span className="font-bold">LOCAMULTI</span> para suas operações.
                </p>
              </motion.div>

              <motion.div 
                className="grid md:grid-cols-3 gap-8"
                {...staggerContainer}
              >
                {depoimentos.map((depoimento, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/10 backdrop-blur-sm p-6 rounded-card border border-white/20"
                    variants={staggerItem}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true }}
                  >
                    <Quote className="h-8 w-8 text-primary mb-4" />
                    <p className="text-white/90 italic mb-6 leading-relaxed">"{depoimento.text}"</p>
                    <div className="border-t border-white/20 pt-4">
                      <p className="font-heading font-bold text-white">{depoimento.name}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <motion.section 
          className="py-16 md:py-20 bg-stone-950"
          {...scaleIn}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Agora que você conhece um pouco sobre a LOCAMULTI, fique à vontade para entrar em contato quando precisar, que um de nossos técnicos poderá atendê-lo!
              </p>
              <WhatsappCTA 
                text="Falar com a Equipe" 
                href={WHATSAPP.quemSomos} 
                variant="outline" 
                size="lg" 
                className="bg-white text-lm-ink hover:bg-white/90 border-0 text-lg px-8" 
              />
            </div>
          </div>
        </motion.section>

        {/* FAQ - Dúvidas Sobre Locação */}
        <section className="py-16 md:py-20 bg-lm-muted">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div {...fadeInUp}>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
                  Dúvidas Sobre Locação
                </h2>
                <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
                  Encontre respostas para as perguntas mais frequentes sobre nossos serviços de locação.
                </p>
              </motion.div>

              <motion.div {...fadeInUp}>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqItems.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`item-${index}`}
                      className="bg-background rounded-card border border-border/50 px-6 shadow-card"
                    >
                      <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5 whitespace-pre-line leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default QuemSomos;
