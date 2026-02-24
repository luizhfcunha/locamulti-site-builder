# Story: STAB-004 - Liberar especificacoes de consumiveis com edicao no admin

## Status
Done

## Objetivo
Exibir no site os textos de especificacoes tecnicas dos consumiveis e manter edicao via painel admin.

## Acceptance Criteria
1. Consumiveis exibem especificacoes no card/detalhe
2. Campo editado no admin aparece no site
3. Nao ha regressao visual em layout mobile

## Checklist
- [x] Remover bloqueio de exibicao para consumiveis
- [x] Validar leitura do campo description
- [x] Validar fluxo de edicao no admin
- [x] Revisao de UX responsiva

## File List
- src/components/catalog/ProductCard.tsx
- src/components/admin/CatalogItemForm.tsx
- docs/stories/STAB-004-especificacoes-consumiveis.md
