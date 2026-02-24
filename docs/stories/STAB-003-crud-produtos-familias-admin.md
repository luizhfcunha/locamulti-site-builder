# Story: STAB-003 - Garantir CRUD de produtos/familias no painel admin

## Status
In Review

## Objetivo
Permitir alteracoes, inclusoes e exclusoes de produtos e familias pelo painel admin.

## Acceptance Criteria
1. Admin cria, edita e exclui produtos
2. Admin cria, edita e exclui familias
3. Alteracoes refletem corretamente no site publico
4. Operacoes respeitam controle de acesso admin

## Checklist
- [x] Definir modelo de exclusao (soft/hard)
- [x] Implementar UI de criar/excluir
- [x] Implementar servicos de persistencia
- [x] Garantir reindexacao automatica de ordens apos mutacoes
- [ ] Validar impactos no catalogo publico

## Notas de implementacao
- Modelo adotado: exclusao hard para itens e familias (`DELETE` em `catalog_items`).
- Admin de produtos recebeu acao de criar item (`Novo item`) e excluir item por linha.
- Formulario admin agora suporta criacao (`id = "__new__"`) e edicao no mesmo fluxo.
- Ao criar item, ordens de categoria/familia/item sao inferidas do catalogo existente para manter consistencia.
- Admin de categorias recebeu exclusao de familia (remove a familia e seus itens).
- Migration adicionada para reindexacao automatica no banco apos `INSERT/UPDATE/DELETE` em `catalog_items`, mantendo sequencia continua de `category_order`, `family_order` e `item_order`.
- Validacao final de impacto no catalogo publico foi adiada para apos implementacao das STAB-011 em diante (novo modelo mestre de categorias/familias).

## File List
- src/components/admin/CatalogItemList.tsx
- src/components/admin/CatalogItemForm.tsx
- src/pages/admin/AdminCategories.tsx
- src/lib/catalogNew.ts
- supabase/migrations/20260219184000_reindex_catalog_orders_after_mutations.sql
- docs/stories/STAB-003-crud-produtos-familias-admin.md
