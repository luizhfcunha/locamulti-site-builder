import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { WhatsappCTA } from "@/components/WhatsappCTA";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { WHATSAPP } from "@/config/whatsapp";
const Contato = () => {
  const contactInfo = [{
    icon: MapPin,
    title: "Endereço",
    content: "Av. Juscelino Kubitscheck, 2058 - JK Nova Capital, Anápolis - GO, 75114-225"
  }, {
    icon: Phone,
    title: "Telefone Fixo",
    content: "(62) 3324-4024",
    link: "tel:+556233244024"
  }, {
    icon: Phone,
    title: "Celular / WhatsApp",
    content: "(62) 9 8419-4024",
    link: "tel:+5562984194024"
  }, {
    icon: Mail,
    title: "E-mail",
    content: "atendimento@locamulti.com.br",
    link: "mailto:atendimento@locamulti.com.br"
  }, {
    icon: Clock,
    title: "Horário de Atendimento",
    content: "Segunda a Quinta: 7:30h as 17:30h\nSexta-feira: 7:30h as 17:00h\nSabado: 8:00h as 11:30h"
  }];
  return <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      {/* Hero Section */}
      <section className="text-white py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Entre em Contato</h1>
            <p className="text-lg md:text-xl text-white/90">
              Nossa Equipe Técnica está pronta para atender sua necessidade, e te auxiliar a definir a solução com melhor custo benefício para sua obra.
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
              const content = info.link ? <a href={info.link} className="text-lm-orange hover:text-lm-terracota transition-colors">
                {info.content}
              </a> : <p className="text-lm-ink whitespace-pre-line">{info.content}</p>;
              return <Card key={index} className="p-6 bg-white border-none shadow-button hover:shadow-lg transition-all duration-base">
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-lm-orange/10 rounded-button">
                    <Icon className="h-6 w-6 text-lm-orange" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lm-plum mb-2">{info.title}</h3>
                    {content}
                  </div>
                </div>
              </Card>;
            })}
          </div>

          {/* WhatsApp CTA */}
          <div className="flex justify-center">
            <WhatsappCTA text="Falar pelo WhatsApp" href={WHATSAPP.contato} size="lg" className="gap-3 text-lg px-8 py-6 h-auto" />
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
                <h2 className="text-3xl font-display font-bold text-lm-plum mb-4">Envie sua Mensagem</h2>
                <p className="text-lm-ink/70">
                  Preencha o formulário abaixo, que nossa equipe retornará em breve com as informações técnicas e comerciais solicitadas.
                </p>
              </div>
              <ContactForm />
            </div>

            {/* Google Maps */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold text-lm-plum mb-4">Nossa Localização</h2>
                <p className="text-lm-ink/70">
                  A LOCAMULTI está localizada em uma das principais avenidas comerciais de Anápolis, de fácil acesso, próximo ao trevo da BR 060 com BR 153, com estacionamento próprio e facilidade para carregamento e descarregamento de equipamentos.
                </p>
              </div>
              <Card className="overflow-hidden border-none shadow-button h-[400px] lg:h-[500px]">
                <iframe src="https://www.google.com/maps?q=Av.+Juscelino+Kubitscheck,+2058,+Anápolis+GO+75114-225&output=embed" width="100%" height="100%" style={{
                  border: 0
                }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Localização LOCAMULTI" />
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-16 bg-zinc-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Precisa de Equipamentos com Urgência?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para atender você agora mesmo pelo WhatsApp. Orçamentos rápidos e entrega
            programada.
          </p>
          <WhatsappCTA text="Solicitar Orçamento Agora" href={WHATSAPP.contato} size="lg" variant="outline" className="bg-white text-lm-orange hover:bg-white/90 border-white gap-3 text-lg px-8 py-6 h-auto" />
        </div>
      </section>
    </main>
    <Footer />
  </div>;
};
export default Contato;
