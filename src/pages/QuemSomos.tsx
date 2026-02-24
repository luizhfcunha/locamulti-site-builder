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
      question: "Nunca aluguei equipamentos na LOCAMULTI, qual o procedimento?",
      answer: `• Confirmar, em um dos canais de atendimento, se a locadora tem disponível o equipamento que você precisa.
• Realizar o cadastro na locadora como Pessoa Física ou Pessoa Jurídica, conforme procedimentos indicados abaixo. O cadastro é realizado apenas uma vez, mas deve ser atualizado a qualquer momento quando houver alteração de dados e informações.
• A Locamulti se responsabiliza pelos dados de todos os clientes conforme a Lei Geral de Proteção de Dados Pessoais (LGPD), Lei n° 13.709/2018.`
    },
    {
      question: "Quais são as documentações necessárias para cadastro na LOCAMULTI?",
      answer: `**Cadastro Pessoa Física:**
• É necessário realizar um Pré-Cadastro pelo WhatsApp pessoal do cliente, através do nosso contato (62) 9 8470-4024;
• Será solicitado o documento pessoal, CNH ou RG válidos, completos e legíveis, com foto;
• Será solicitado o Comprovante de Endereço Residencial (Água/Luz/Gás) no nome do cliente, legível e com vencimento dentro dos últimos 3 meses;
• Caso o comprovante não esteja no nome do cliente, deve-se apresentar um comprovante complementar no nome, vinculando-o ao mesmo endereço;
• Após a aprovação do pré-cadastro, o cliente deverá comparecer à LOCAMULTI presencialmente para finalizar o cadastro e assinar a Ficha de Cadastro pessoa física.

**Cadastro Pessoa Jurídica:**
• O Cadastro deve ser realizado por e-mail, que deve ser informado em um dos canais de atendimento da locadora;
• A Ficha de Cadastro PJ será enviada através do e-mail: financeiro@locamulti.com.br, com instruções de preenchimento;
• Após a análise do cadastro, serão repassadas as condições comerciais e prazos de faturamento aprovados.`
    },
    {
      question: "Como funcionam os períodos e valores de locação dos equipamentos?",
      answer: `• Trabalhamos com 5 Tabelas de Locação: Diária (24 horas), Semanal (7 dias), Quinzenal (15 dias), Mensal (30 dias) e Fim de Semana (1,5 dias - retirada às sextas após 14h, devolução na segunda às 9h);
• Cada tabela de locação tem um valor correspondente, que pode ser consultado junto ao atendimento técnico/comercial;
• Não fazemos pro rata dos valores dentro do período das tabelas, mas se o equipamento for devolvido antecipadamente ou prorrogado, os valores serão ajustados conforme cada tabela, sempre em benefício do cliente;
• Não trabalhamos com meia diária, a locação mínima é a Tabela Diária.`
    },
    {
      question: "A locação dos equipamentos é com operador? Já acompanha os consumíveis?",
      answer: `• Não. A LOCAMULTI aluga somente a máquina, bem como os acessórios necessários, mas sem operador.
• É importante que a retirada ou o recebimento dos equipamentos seja acompanhada de pessoa com conhecimento e habilidade para o manuseio e operação das máquinas;
• Os consumíveis são de responsabilidade do cliente. Em algumas exceções, os equipamentos são fornecidos juntamente com o consumível, e em outros casos disponibilizamos os consumíveis para venda conforme consumo.`
    },
    {
      question: "Após as definições técnicas e comerciais do equipamento, como faço para concluir a locação?",
      answer: `• Confirmar com o Atendimento Técnico/Comercial a disponibilidade imediata do equipamento, realizando a reserva do mesmo;
• Informar o Endereço de Utilização, Nome da Obra, Pessoa responsável para retirar ou receber, bem como o período previsto de utilização;
• Os equipamentos somente serão entregues para o titular do cadastro ou para pessoas formalmente autorizadas;
• Para Entrega e/ou Coleta na obra, consultar antes sobre custos extras com deslocamento;
• Todos os equipamentos são testados junto com o cliente no ato da entrega/retirada, com todas as orientações sobre a operação e conservação das máquinas.`
    },
    {
      question: "Se for preciso utilizar o equipamento por mais tempo, preciso ir até a locadora para renovar o contrato?",
      answer: `• Não é necessário comparecer na locadora para estender o período de utilização, basta informar em um dos canais de atendimento e fazer a negociação comercial conforme necessidade;
• Os contratos são renovados automaticamente caso não ocorra devolução do equipamento;
• Os pagamentos poderão ser realizados tanto na sede da locadora, como através de boletos, pix, links de cartões ou depósitos em conta.`
    },
    {
      question: "O equipamento apresentou defeito durante o funcionamento, como devo proceder?",
      answer: `• Basta informar à locadora imediatamente, repassando as informações sobre as falhas identificadas, para que sejam tomadas as providências para reparo ou substituição por outro de mesmo modelo;
• Nossa equipe está treinada para esclarecer quaisquer dúvidas e fornecer orientações a qualquer momento, através de um dos nossos canais de atendimento;
• As substituições podem ser feitas na sede da locadora ou, mediante programação, na sede da obra do cliente;
• Todas as operações de Manutenção ou Substituição serão registradas e assinadas em comprovantes específicos.`
    },
    {
      question: "O equipamento danificou/estragou ou foi extraviado. Qual é o procedimento adotado?",
      answer: `**Em caso de furto ou roubo:**
• O cliente deve abrir um boletim no órgão competente do município e informar a locadora imediatamente;
• O cliente deve ressarcir a locadora mediante pagamento do Valor de Indenização do equipamento, conforme consta no Contrato de Locação.

**Em caso de avaria:**
• Após a devolução/coleta e análise, a locadora avaliará a extensão dos danos e os custos para reparos;
• Se as falhas forem provenientes de vícios ocultos ou desgaste normal, a locadora se responsabiliza integralmente;
• Se a avaria foi por má utilização ou aplicação além da capacidade do equipamento, os custos serão repassados ao cliente com relatório comprobatório.`
    },
    {
      question: "Meu contrato de locação foi na diária, mas me esqueci ou não pude devolver no horário. Como fica?",
      answer: `• Na locação Diária, são contabilizadas 24 horas, sendo a devolução prevista para o mesmo horário da retirada no dia anterior;
• Atraso de até 1 hora, dentro do mesmo dia: não será cobrada diária adicional;
• Atraso de até 4 horas, dentro do mesmo dia: será cobrado adicional de 50% da tabela diária;
• Se a devolução ultrapassar 4 horas do horário previsto, ou passar de um dia para o outro: será cobrada a diária adicional integralmente;
• Caso a utilização seja estendida a outros períodos (semanal, quinzenal ou mensal), os valores serão complementados de acordo com cada tabela.`
    },
    {
      question: "Quais os horários e as condições para a devolução dos equipamentos?",
      answer: `• Segunda a Quinta-feira: 7:30h às 17:30h
• Sexta-feira: até 17:00h
• Sábados: 8:00h às 11:30h
• Necessário consultar sobre datas especiais ou feriados nacionais/municipais;
• As programações de Coleta na obra devem ser feitas com antecedência, programadas pela manhã para as coletas à tarde, ou à tarde para as coletas no próximo dia útil.`
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

