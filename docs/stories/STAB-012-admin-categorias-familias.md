# Story: STAB-012 - Admin de categorias e familias como fonte unica

## Status
In Review

## Objetivo
Transformar a aba `Categorias` no ponto unico de criacao/edicao/exclusao de categorias e familias.

## Acceptance Criteria
1. Admin cria, edita e exclui categorias
2. Admin cria, edita e exclui familias por categoria
3. Exclusao com itens vinculados exige regra segura (bloqueio ou realocacao)
4. Ordenacao de categorias e familias permanece consistente no publico

## Checklist
- [x] Implementar CRUD de categorias na tela admin
- [x] Implementar CRUD de familias por categoria
- [x] Definir regra para exclusao com itens vinculados
- [x] Aplicar validacoes e toasts de erro/sucesso
- [ ] Testar impactos no catalogo publico

## Notas de implementacao
- Tela `AdminCategories` migrada para usar tabelas mestre `catalog_categories` e `catalog_families`.
- Inclusao de categoria e familia com ordenacao automatica inicial e slug derivado de nome.
- Edicao de categoria/familia com ajuste de nome e ordem.
- Exclusao segura implementada: bloqueia exclusao se houver itens vinculados em `catalog_items`.
- Feedback de sucesso/erro padronizado com toast em todas as operacoes.

## File List
- src/pages/admin/AdminCategories.tsx
- docs/stories/STAB-012-admin-categorias-familias.md
