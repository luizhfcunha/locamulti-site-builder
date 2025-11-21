import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const QuemSomos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="mb-8">Quem Somos</h1>
          <p className="text-lg text-muted-foreground">
            Página institucional em desenvolvimento...
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuemSomos;
