# Story: STAB-006 - Corrigir "Ver todos" das categorias

## Status
Done

## Objetivo
Garantir que o clique em "Ver todos" funcione sempre e abra listagem da categoria no topo.

## Acceptance Criteria
1. "Ver todos" funciona em todas as categorias
2. Navegacao abre a categoria correta sem estado inconsistente
3. Lista abre no inicio da listagem da categoria

## Checklist
- [x] Reproduzir cenarios de falha
- [x] Corrigir navegacao/query params/route params
- [x] Garantir scroll para topo ao trocar categoria
- [x] Validar desktop e mobile

## File List
- src/components/catalog/CatalogSidebar.tsx
- src/pages/CatalogHome.tsx
- src/components/ScrollToTop.tsx
- docs/stories/STAB-006-ver-todos-categorias.md
