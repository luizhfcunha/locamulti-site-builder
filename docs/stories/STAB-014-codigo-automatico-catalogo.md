# Story: STAB-014 - Geracao automatica de codigo no catalogo

## Status
In Review

## Objetivo
Gerar automaticamente o `code` do item com base em categoria, familia e sequencia de item, evitando erro manual.

## Acceptance Criteria
1. Codigo e gerado automaticamente no backend
2. Codigo e unico e sem colisao em concorrencia
3. Campo codigo no admin fica somente leitura
4. Sequencia de codigo respeita estrutura definida

## Checklist
- [x] Definir formato oficial do codigo (ex.: `CC.FF.III`)
- [x] Criar funcao SQL transacional para gerar proximo codigo
- [x] Integrar criacao de item com geracao automatica
- [x] Tornar campo codigo read-only no formulario
- [ ] Testar criacao simultanea sem duplicidade

## Notas de implementacao
- Migration criada com trigger `BEFORE INSERT` em `catalog_items` para gerar `code` automatico quando vazio.
- Formato aplicado: `CC.FF.III` a partir de `category_no`, `family_no` e `item_order`.
- Estrategia de concorrencia: `pg_advisory_xact_lock` por `category_slug:family_slug` + checagem de colisao.
- Formulario admin agora exibe `code` como somente leitura.

## File List
- supabase/migrations/20260219194000_auto_generate_catalog_item_code.sql
- src/components/admin/CatalogItemForm.tsx
- docs/stories/STAB-014-codigo-automatico-catalogo.md
