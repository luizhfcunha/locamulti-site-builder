# Story: STAB-010 - Painel admin para gerenciar carrossel da home

## Status
In Review

## Objetivo
Adicionar funcionalidade no admin para selecionar equipamentos em destaque e definir ordem do carrossel da home.

## Acceptance Criteria
1. Admin escolhe itens em destaque
2. Admin define e salva ordem de exibicao
3. Home reflete configuracao salva
4. Fluxo protegido por permissao admin

## Checklist
- [x] Definir modelo de dados da vitrine/carrossel
- [x] Criar tela admin de gerenciamento
- [x] Implementar persistencia e leitura na home
- [x] Validar fallback quando sem configuracao

## Notas de validacao
- Story mantida em `In Review` por decisao de rollout: validacao final sera concluida apos aplicacao das STAB-011 em diante.

## File List
- src/pages/admin/AdminFeaturedCarousel.tsx
- src/components/admin/AdminLayout.tsx
- src/App.tsx
- src/components/FeaturedEquipmentCarousel.tsx
- src/integrations/supabase/types.ts
- supabase/migrations/20260219133000_create_featured_carousel_items.sql
- docs/stories/STAB-010-admin-carrossel-home.md
