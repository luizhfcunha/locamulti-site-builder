/**
 * LocaMulti Brand Assets Constants
 * 
 * Logo Storage Locations:
 * 
 * Header Logo:
 * - Bucket: brand-assets (public)
 * - Path: /brand/locamulti/logo-locamulti-header-horizontal.png
 * - Full Storage URL: https://hdrqdfjxwohrnarbghed.supabase.co/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-header-horizontal.png
 * 
 * Footer Logo:
 * - Bucket: brand-assets (public)
 * - Path: /brand/locamulti/logo-locamulti-footer-white.png
 * - Full Storage URL: https://hdrqdfjxwohrnarbghed.supabase.co/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-footer-white.png
 */

import logoHeader from "@/assets/logo-locamulti-header-horizontal.png";
import logoFooter from "@/assets/logo-locamulti-footer-white.png";

// Local logos (currently in use)
export const LOGO_HEADER_LOCAL = logoHeader;
export const LOGO_FOOTER_LOCAL = logoFooter;

// Supabase Storage logo URLs (use these once files are uploaded to storage)
export const LOGO_HEADER_STORAGE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-header-horizontal.png`;
export const LOGO_FOOTER_STORAGE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-footer-white.png`;

// Active logo URLs (switch between local and storage as needed)
export const logoHeaderUrl = LOGO_HEADER_LOCAL;
export const logoFooterUrl = LOGO_FOOTER_LOCAL;

// Logo configuration objects
export const LOGO_FOOTER = {
  variant: "white" as const,
  url: logoFooterUrl,
};

// Brand Colors (from visual identity manual)
export const BRAND_COLORS = {
  orange: '#DB5A34',
  terracota: '#B94935',
  plum: '#3E2229',
  ink: '#373435',
  white: '#FFFFFF',
  muted: '#F6F3F2',
} as const;

// Contact Information
export const WHATSAPP_NUMBER = '5511999999999'; // Update with actual WhatsApp number
export const WHATSAPP_MESSAGE = 'Olá! Gostaria de solicitar um orçamento.';
