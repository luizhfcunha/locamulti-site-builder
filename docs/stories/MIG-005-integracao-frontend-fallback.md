# Story: MIG-005 - Integracao Frontend com API Hostinger + fallback

## Status
Draft

## Objetivo
Trocar chamadas de functions para API Hostinger com feature flag de rollback rapido.

## Acceptance Criteria
1. `ContactForm` usa `VITE_API_BASE_URL` quando flag ativa
2. `BulkImageUpload` usa `VITE_API_BASE_URL` quando flag ativa
3. Fallback para `supabase.functions.invoke` quando flag desativada
4. Sem regressao de UX em erros e loading

## Tasks
- [ ] Criar env vars de controle
- [ ] Adaptar `src/components/ContactForm.tsx`
- [ ] Adaptar `src/components/admin/BulkImageUpload.tsx`
- [ ] Testar fallback

## File List
- src/components/ContactForm.tsx
- src/components/admin/BulkImageUpload.tsx
- docs/stories/MIG-005-integracao-frontend-fallback.md
