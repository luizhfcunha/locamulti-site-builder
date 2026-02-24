# Story: STAB-008 - Reintroduzir "Ver mais" nas especificacoes

## Status
Done

## Objetivo
Exibir inicialmente 2 linhas de especificacoes e permitir expandir/recolher com "Ver mais"/"Ver menos".

## Acceptance Criteria
1. Especificacoes iniciam minimizadas em 2 linhas
2. Usuario pode expandir e recolher texto
3. UX melhora no mobile sem quebrar desktop

## Checklist
- [x] Implementar clamp de 2 linhas
- [x] Implementar toggle por card
- [x] Ajustar acessibilidade do controle
- [x] Testar com textos curtos e longos

## File List
- src/components/catalog/ProductCard.tsx
- src/components/catalog/ProductList.tsx (se necessario)
- docs/stories/STAB-008-ver-mais-especificacoes.md
