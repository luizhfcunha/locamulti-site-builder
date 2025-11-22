/**
 * LocaMulti Brand Assets Constants
 * 
 * Logo Storage Location:
 * - Bucket: brand-assets (public)
 * - Path: /brand/locamulti/logo-locamulti-header-horizontal.png
 * - Full Storage URL: https://hdrqdfjxwohrnarbghed.supabase.co/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-header-horizontal.png
 */

import logoHeader from "@/assets/logo-locamulti-header-horizontal.png";

// Local logo (currently in use)
export const LOGO_HEADER_LOCAL = logoHeader;

// Supabase Storage logo URL (use this once file is uploaded to storage)
export const LOGO_HEADER_STORAGE = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/brand-assets/brand/locamulti/logo-locamulti-header-horizontal.png`;

// Active logo URL (switch between local and storage as needed)
export const logoHeaderUrl = LOGO_HEADER_LOCAL;

// Brand Colors (from visual identity manual)
export const BRAND_COLORS = {
  orange: '#DB5A34',
  terracota: '#B94935',
  plum: '#3E2229',
  ink: '#373435',
  white: '#FFFFFF',
  muted: '#F6F3F2',
} as const;
