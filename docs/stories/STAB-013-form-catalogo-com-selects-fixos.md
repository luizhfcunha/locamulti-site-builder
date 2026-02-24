# Story: STAB-013 - Formulario de catalogo com categoria/familia fixas

## Status
In Review

## Objetivo
No formulario da aba `Catalogo`, permitir selecionar apenas categorias e familias ja criadas na aba `Categorias`.

## Acceptance Criteria
1. Campo categoria usa `Select` com dados mestres
2. Campo familia depende da categoria selecionada
3. Nao ha entrada manual livre para categoria/familia
4. Nao e possivel salvar item sem categoria/familia validas

## Checklist
- [x] Substituir inputs livres por selects no `CatalogItemForm`
- [x] Carregar categorias/familias da base mestre
- [x] Implementar dependencia categoria -> familia
- [x] Validar estados de formulario (required/empty/loading)
- [ ] Testar criacao e edicao de item

## Notas de implementacao
- Campos de categoria e familia no `CatalogItemForm` migrados para `Select`.
- Familia agora depende da categoria selecionada (lista filtrada por `category_slug`).
- Submit bloqueado quando categoria/familia validas nao forem selecionadas.
- Leitura prioriza tabelas mestre (`catalog_categories`/`catalog_families`) com fallback para `catalog_items` em ambientes de transicao.

## File List
- src/components/admin/CatalogItemForm.tsx
- docs/stories/STAB-013-form-catalogo-com-selects-fixos.md
