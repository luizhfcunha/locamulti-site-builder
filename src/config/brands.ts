/**
 * LocaMulti Brand Partners Configuration
 * 
 * Storage Location (future use):
 * - Bucket: brand-assets (public)
 * - Path: /brand/locamulti/partners/logo-[slug].png
 * - Full Storage URL: https://hdrqdfjxwohrnarbghed.supabase.co/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-[slug].png
 */

import logoBosch from "@/assets/brands/logo-bosch.png";
import logoBovenau from "@/assets/brands/logo-bovenau.png";
import logoDewalt from "@/assets/brands/logo-dewalt.png";
import logoEsab from "@/assets/brands/logo-esab.png";
import logoKarcher from "@/assets/brands/logo-karcher.png";
import logoMakita from "@/assets/brands/logo-makita.png";
import logoMerax from "@/assets/brands/logo-merax.png";
import logoPersico from "@/assets/brands/logo-persico.png";
import logoSumig from "@/assets/brands/logo-sumig.png";
import logoToyama from "@/assets/brands/logo-toyama.png";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
}

export const BRANDS_CAROUSEL: Brand[] = [
  {
    id: "dewalt",
    name: "DeWalt",
    slug: "dewalt",
    logoUrl: logoDewalt,
  },
  {
    id: "bosch",
    name: "Bosch",
    slug: "bosch",
    logoUrl: logoBosch,
  },
  {
    id: "makita",
    name: "Makita",
    slug: "makita",
    logoUrl: logoMakita,
  },
  {
    id: "esab",
    name: "Esab",
    slug: "esab",
    logoUrl: logoEsab,
  },
  {
    id: "sumig",
    name: "Sumig",
    slug: "sumig",
    logoUrl: logoSumig,
  },
  {
    id: "toyama",
    name: "Toyama",
    slug: "toyama",
    logoUrl: logoToyama,
  },
  {
    id: "karcher",
    name: "Kärcher",
    slug: "karcher",
    logoUrl: logoKarcher,
  },
  {
    id: "bovenau",
    name: "Bovenau",
    slug: "bovenau",
    logoUrl: logoBovenau,
  },
  {
    id: "merax",
    name: "Merax",
    slug: "merax",
    logoUrl: logoMerax,
  },
  {
    id: "persico",
    name: "Persico",
    slug: "persico",
    logoUrl: logoPersico,
  },
];

// Supabase Storage URLs (for future use when uploaded to storage)
export const BRANDS_STORAGE_URLS = {
  dewalt: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-dewalt.png`,
  bosch: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-bosch.png`,
  makita: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-makita.png`,
  esab: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-esab.png`,
  sumig: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-sumig.png`,
  toyama: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-toyama.png`,
  karcher: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-karcher.png`,
  bovenau: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-bovenau.png`,
  merax: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-merax.png`,
  persico: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/partners/logo-persico.png`,
} as const;
