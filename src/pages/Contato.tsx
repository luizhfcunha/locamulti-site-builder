import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WHATSAPP } from "@/config/whatsapp";

const Contato = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "JK Parque Industrial - Av. Juscelino Kubitscheck, 2058 - JK Nova Capital, Anápolis - GO, 75114-225",
    },
    {
      icon: Phone,
      title: "Telefone",
      content: "(11) 4002-8922",
      link: "tel:+551140028922",
    },
    {
      icon: Mail,
      title: "E-mail",
      content: "contato@locamulti.com.br",
      link: "mailto:contato@locamulti.com.br",
    },
    {
      icon: Clock,
      title: "Horário de Atendimento",
      content: "Segunda a Sexta: 7h às 18h\nSábado: 7h às 12h",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-lm-plum text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Entre em Contato
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                Estamos prontos para atender sua necessidade de equipamentos profissionais.
                Fale com nossa equipe técnica especializada.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 md:py-16 bg-lm-muted">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const content = info.link ? (
                  <a
                    href={info.link}
                    className="text-lm-orange hover:text-lm-terracota transition-colors"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-lm-ink whitespace-pre-line">{info.content}</p>
                );

                return (
                  <Card
                    key={index}
                    className="p-6 bg-white border-none shadow-button hover:shadow-lg transition-all duration-base"
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div className="p-3 bg-lm-orange/10 rounded-button">
                        <Icon className="h-6 w-6 text-lm-orange" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lm-plum mb-2">
                          {info.title}
                        </h3>
                        {content}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="flex justify-center">
              <WhatsappCTA 
                text="Falar pelo WhatsApp"
                href={WHATSAPP.contato}
                size="lg"
                className="gap-3 text-lg px-8 py-6 h-auto"
              />
            </div>
          </div>
        </section>

        {/* Form and Map Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold text-lm-plum mb-4">
                    Envie sua Mensagem
                  </h2>
                  <p className="text-lm-ink/70">
                    Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
                  </p>
                </div>
                <ContactForm />
              </div>

              {/* Google Maps */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl font-display font-bold text-lm-plum mb-4">
                    Nossa Localização
                  </h2>
                  <p className="text-lm-ink/70">
                    Visite nossa loja física e conheça nossos equipamentos pessoalmente.
                  </p>
                </div>
                <Card className="overflow-hidden border-none shadow-button h-[400px] lg:h-[500px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976283525754!2d-46.63341208502203!3d-23.561684684682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sSão%20Paulo%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890123!5m2!1spt-BR!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização LocaMulti"
                  />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-lm-orange py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Precisa de Equipamentos com Urgência?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Nossa equipe está pronta para atender você agora mesmo pelo WhatsApp.
              Orçamentos rápidos e entrega programada.
            </p>
            <WhatsappCTA 
              text="Solicitar Orçamento Agora"
              href={WHATSAPP.contato}
              size="lg"
              variant="outline"
              className="bg-white text-lm-orange hover:bg-white/90 border-white gap-3 text-lg px-8 py-6 h-auto"
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
