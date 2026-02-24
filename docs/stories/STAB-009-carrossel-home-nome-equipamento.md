# Story: STAB-009 - Corrigir conteudo do carrossel de equipamentos na home

## Status
Done

## Objetivo
No carrossel da home, exibir nome do equipamento (nao especificacoes tecnicas).

## Acceptance Criteria
1. Cards do carrossel exibem nome correto do equipamento
2. Nao exibe descricao/especificacao no campo de titulo
3. Sem regressao visual no componente

## Checklist
- [x] Revisar mapeamento de campos no carrossel
- [x] Corrigir render de titulo
- [x] Validar fallback quando nome estiver vazio
- [x] Revisao visual desktop e mobile

## File List
- src/components/FeaturedEquipmentCarousel.tsx
- docs/stories/STAB-009-carrossel-home-nome-equipamento.md
