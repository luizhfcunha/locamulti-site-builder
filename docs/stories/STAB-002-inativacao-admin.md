# Story: STAB-002 - Corrigir erro de inativacao de equipamento no admin

## Status
Done

## Objetivo
Corrigir falhas ao alternar produto para inativo no painel administrativo.

## Acceptance Criteria
1. Admin consegue marcar item como inativo sem erro
2. Estado inativo persiste no banco e reflete na listagem
3. Operacao nao quebra listagem ou edicao subsequente

## Checklist
- [x] Reproduzir erro atual
- [x] Corrigir fluxo de update no frontend/admin
- [x] Validar permissao/policy relacionada
- [x] Testar ativa -> inativa -> ativa

## Notas de implementacao
- Causa raiz: `catalog_items` tinha policy publica de SELECT restrita a `active = true`, mas nao tinha policy de SELECT para admin.
- Correcao aplicada via migration: policy `Allow admins read all catalog_items`.

## File List
- supabase/migrations/20260219120000_fix_catalog_items_admin_select_policy.sql
- docs/stories/STAB-002-inativacao-admin.md
