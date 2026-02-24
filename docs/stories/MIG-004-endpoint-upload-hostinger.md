# Story: MIG-004 - Migrar endpoint de upload admin para Hostinger

## Status
Draft

## Objetivo
Substituir `supabase/functions/upload-images` por `POST /admin/upload-images` com validacao de JWT e role admin.

## Acceptance Criteria
1. JWT Supabase validado no backend
2. Role admin verificada em `user_roles`
3. Upload para bucket `product-images` com limite de 10MB e tipos permitidos
4. Relatorio por arquivo (sucesso/falha) retornado

## Tasks
- [ ] Implementar auth middleware
- [ ] Implementar RBAC admin
- [ ] Implementar multipart upload
- [ ] Integrar storage Supabase via service role

## File List
- backend/src/routes/admin-upload.ts (a criar)
- docs/stories/MIG-004-endpoint-upload-hostinger.md
