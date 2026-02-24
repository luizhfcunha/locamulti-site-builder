# Story: STAB-005 - Busca sem acento no catalogo

## Status
Done

## Objetivo
Permitir pesquisa equivalente com e sem acento (ex.: "cafe" encontra "cafe", "cafe", "cafE" etc).

## Acceptance Criteria
1. Busca retorna resultados equivalentes com/sem acento
2. Comportamento consistente em barra principal e busca de catalogo
3. Performance de busca mantida em nivel aceitavel

## Checklist
- [x] Definir estrategia de normalizacao (frontend e/ou banco)
- [x] Implementar normalizacao na busca
- [x] Cobrir casos com acentos comuns PT-BR
- [x] Testar consultas com termos curtos e longos

## File List
- src/lib/catalogNew.ts
- src/pages/CatalogHome.tsx
- src/components/catalog/CatalogSearch.tsx
- src/components/HeaderDesktop.tsx
- src/components/HeaderMobile.tsx
- docs/stories/STAB-005-busca-sem-acento.md
