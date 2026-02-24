# Story: STAB-007 - Corrigir rolagem ao alternar familias/categorias

## Status
Done

## Objetivo
Ao alternar familia/categoria, a tela deve sempre voltar ao inicio da listagem relevante.

## Acceptance Criteria
1. Troca de familia reposiciona viewport no topo da listagem
2. Troca de categoria reposiciona viewport no topo da listagem
3. Nao ocorre permanencia indevida na posicao anterior

## Checklist
- [x] Identificar gatilhos de rota e estado
- [x] Ajustar comportamento de scroll
- [x] Validar navegacao via sidebar e busca
- [x] Revisao mobile

## File List
- src/components/ScrollToTop.tsx
- src/pages/CatalogHome.tsx
- src/pages/CatalogCategory.tsx
- src/pages/CatalogFamily.tsx
- docs/stories/STAB-007-rolagem-catalogo.md
