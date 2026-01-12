import {
  Hammer,
  Zap,
  Wrench,
  Package,
  PaintBucket,
  Cog,
  Trees,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface CategoryConfig {
  id: string;           // Nome original em MAIÚSCULAS (para matching com JSON)
  title: string;        // Nome formatado para exibição
  slug: string;         // Slug para URL
  icon: LucideIcon;     // Ícone Lucide para a Home
  imageUrl: string;     // Caminho da imagem
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  {
    id: "DEMOLIÇÃO E PERFURAÇÃO",
    title: "Demolição e Perfuração",
    slug: "demolicao-e-perfuracao",
    icon: Hammer,
    imageUrl: "/images/carrossel-desktop/demolicao-perfuracao.jpg",
  },
  {
    id: "CONCRETAGEM E ACABAMENTO",
    title: "Concretagem e Acabamento",
    slug: "concretagem-e-acabamento",
    icon: Cog,
    imageUrl: "/images/carrossel-desktop/concretagem-acabamento.jpg",
  },
  {
    id: "FERRAMENTAS DE CORTAR, LIXAR E PARAFUSAR",
    title: "Ferramentas de Cortar, Lixar e Parafusar",
    slug: "ferramentas-de-cortar-lixar-e-parafusar",
    icon: Wrench,
    imageUrl: "/images/carrossel-desktop/ferramentas-cortar-lixar-parafusar.jpg",
  },
  {
    id: "BOMBAS, GERADORES E COMPRESSORES",
    title: "Bombas, Geradores e Compressores",
    slug: "bombas-geradores-e-compressores",
    icon: Zap,
    imageUrl: "/images/carrossel-desktop/bombas-geradores-compressores.jpg",
  },
  {
    id: "ELEVAÇÃO, MOVIMENTAÇÃO E REMOÇÃO",
    title: "Elevação, Movimentação e Remoção",
    slug: "elevacao-movimentacao-e-remocao",
    icon: Package,
    imageUrl: "/images/carrossel-desktop/elevacao-movimentacao-remocao.jpg",
  },
  {
    id: "MÁQUINAS DE SOLDA E MONTAGEM",
    title: "Máquinas de Solda e Montagem",
    slug: "maquinas-de-solda-e-montagem",
    icon: Shield,
    imageUrl: "/images/carrossel-desktop/maquinas-solda-montagem.jpg",
  },
  {
    id: "CONSERVAÇÃO E LIMPEZA",
    title: "Conservação e Limpeza",
    slug: "conservacao-e-limpeza",
    icon: PaintBucket,
    imageUrl: "/images/carrossel-desktop/conservacao-limpeza.jpg",
  },
  {
    id: "EQUIPAMENTOS DE ACESSO A ALTURA",
    title: "Equipamentos de Acesso à Altura",
    slug: "equipamentos-de-acesso-a-altura",
    icon: Package,
    imageUrl: "/images/carrossel-desktop/equipamentos-acesso-altura.jpg",
  },
  {
    id: "EQUIPAMENTOS AGRÍCOLAS",
    title: "Equipamentos Agrícolas",
    slug: "equipamentos-agricolas",
    icon: Trees,
    imageUrl: "/images/carrossel-desktop/equipamentos-agricolas.jpg",
  },
  {
    id: "FERRAMENTAS À BATERIA",
    title: "Ferramentas à Bateria",
    slug: "ferramentas-a-bateria",
    icon: Zap,
    imageUrl: "/images/carrossel-desktop/ferramentas-bateria.jpg",
  },
];

// Helper para buscar imagem por slug
export const getCategoryImageBySlug = (slug: string): string => {
  const category = CATEGORIES_CONFIG.find((c) => c.slug === slug);
  return category?.imageUrl || "/placeholder.svg";
};

// Helper para buscar config completa por slug
export const getCategoryBySlug = (slug: string): CategoryConfig | undefined => {
  return CATEGORIES_CONFIG.find((c) => c.slug === slug);
};
