# Story: STAB-015 - Visualizacao e organizacao de categorias/familias/itens

## Status
In Review

## Objetivo
Melhorar manutencao da ordem com visualizacao por estrutura e ferramenta de organizacao.

## Acceptance Criteria
1. Admin consegue filtrar catalogo por categoria e familia
2. Existe visao para organizar ordem de itens
3. Reordenacao persiste em banco e reflete no publico
4. Ordem final fica previsivel e sem lacunas

## Checklist
- [x] Melhorar filtros da lista de catalogo (categoria/familia)
- [x] Criar aba/tela de organizacao por estrutura
- [x] Implementar reordenacao (drag-and-drop ou controles de mover)
- [x] Persistir nova ordem com reindexacao consistente
- [ ] Validar renderizacao no catalogo publico

## Notas de implementacao
- A lista de catalogo no admin foi consolidada como visao de organizacao por estrutura (categoria/familia + itens).
- Reordenacao implementada por controles de mover para cima/baixo em cada item da familia.
- Persistencia via update de `item_order` em `catalog_items`; trigger de reindexacao garante sequencia continua.
- Filtros por categoria e familia seguem ativos para recorte operacional da organizacao.

## File List
- src/components/admin/CatalogItemList.tsx
- docs/stories/STAB-015-visualizacao-e-organizacao-catalogo.md
