# Story: STAB-011 - Modelo mestre de categorias e familias

## Status
In Review

## Objetivo
Criar estrutura mestre para categorias e familias, removendo dependencia de campos livres em `catalog_items`.

## Acceptance Criteria
1. Existem tabelas dedicadas para categorias e familias com ordenacao
2. `catalog_items` referencia categoria/familia validas
3. RLS garante leitura publica e escrita apenas admin
4. Backfill inicial preserva dados existentes

## Checklist
- [x] Criar migration com `catalog_categories`
- [x] Criar migration com `catalog_families`
- [x] Definir FKs e constraints de unicidade
- [x] Aplicar backfill a partir de `catalog_items`
- [ ] Validar compatibilidade com dados existentes

## Notas de implementacao
- Migration criada com tabelas mestre `catalog_categories` e `catalog_families`.
- Backfill inicial usa dados atuais de `catalog_items` com `INSERT ... ON CONFLICT`.
- `catalog_items` agora tem FKs para `category_slug` e `(category_slug, family_slug)`, garantindo referencia valida.
- RLS aplicado nas tabelas mestre: leitura publica apenas de ativos e CRUD restrito a admin.

## File List
- supabase/migrations/20260219190000_create_catalog_master_tables.sql
- src/integrations/supabase/types.ts
- docs/stories/STAB-011-modelo-mestre-categorias-familias.md
