# Deploy STAB - Guia de Execução

## ✅ PRÉ-VALIDAÇÃO CONCLUÍDA

- [x] Query de validação executada: **0 duplicatas encontradas**
- [x] Análise de risco completa: **APROVADO**
- [x] Homologação técnica: **85% validado**

---

## ETAPA 1: COMMIT DO CÓDIGO (EXECUTAR AGORA)

```bash
# Stagear todas as mudanças
git add .

# Criar commit
git commit -m "feat: refatoração estrutura catálogo (STAB-011 a STAB-016)

Implementa modelo mestre de categorias/famílias com:
- Tabelas mestres catalog_categories e catalog_families
- Código automático formato CC.FF.III com proteção contra concorrência
- Sistema de reindexação automática via triggers
- CRUD completo de categorias/famílias no admin
- Validação de integridade referencial via FK constraints
- Migração sem downtime, backwards compatible

Stories:
- STAB-011: Modelo mestre de categorias e familias
- STAB-012: Admin de categorias e familias como fonte unica
- STAB-013: Formulario de catalogo com categoria/familia fixas
- STAB-014: Geracao automatica de codigo no catalogo
- STAB-015: Visualizacao e organizacao de categorias/familias/itens
- STAB-016: Hardening e validacao final do catalogo

Validações:
- Análise técnica: 85% validado (código + migrations)
- Query de validação: 0 duplicatas encontradas
- Homologação: APROVADO COM RESSALVAS (testes runtime pendentes)
- Risco de produção: MÉDIO (mitigável)

Migrations adicionadas:
- 20260219120000_fix_catalog_items_admin_select_policy.sql
- 20260219133000_create_featured_carousel_items.sql
- 20260219184000_reindex_catalog_orders_after_mutations.sql
- 20260219190000_create_catalog_master_tables.sql
- 20260219194000_auto_generate_catalog_item_code.sql

Documentação:
- docs/checklists/stab-016-relatorio-homologacao-tecnica.md
- docs/checklists/stab-016-homologacao-catalogo.md
- docs/checklists/analise-risco-producao-stab.md
- docs/stories/STAB-011 até STAB-016

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push para remoto
git push origin main
```

---

## ETAPA 2: APLICAR MIGRATIONS (JANELA DE MANUTENÇÃO)

### Horário Recomendado
- **Melhor:** Terça a Quinta, 22h-23h
- **Evitar:** Segunda, Sexta, fins de semana

### Via Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em: **SQL Editor**
4. Execute as migrations na ordem (ou use Migration Runner):

#### Migration 1: Fix RLS Policy (~1s)
```sql
-- Arquivo: 20260219120000_fix_catalog_items_admin_select_policy.sql
-- [Copiar e colar conteúdo da migration]
```

#### Migration 2: Featured Carousel (~2s)
```sql
-- Arquivo: 20260219133000_create_featured_carousel_items.sql
-- [Copiar e colar conteúdo da migration]
```

#### Migration 3: Reindexação (~5-10s) ⚠️
```sql
-- Arquivo: 20260219184000_reindex_catalog_orders_after_mutations.sql
-- ATENÇÃO: Esta migration executa normalização imediata
-- Pode causar lock leve por ~10 segundos
```

#### Migration 4: Tabelas Mestres (~10-15s) 🔒 CRÍTICO
```sql
-- Arquivo: 20260219190000_create_catalog_master_tables.sql
-- ATENÇÃO: Esta migration adiciona Foreign Keys
-- Causará lock em catalog_items por ~15 segundos
-- Durante lock: catálogo público FUNCIONA, admin NÃO pode editar
```

#### Migration 5: Código Automático (~1s)
```sql
-- Arquivo: 20260219194000_auto_generate_catalog_item_code.sql
-- Última migration, segura e rápida
```

### Tempo Total Estimado
- **20-30 segundos** (migrations)
- **Lock crítico:** 10-15 segundos (apenas admin afetado)

---

## ETAPA 3: DEPLOY DO FRONTEND

### Via Lovable.dev
1. Acesse: https://lovable.dev/projects/8ec7665a-01b2-40eb-a3fa-57f1fe27a700
2. O push no GitHub já deve ter disparado deploy automático
3. Aguarde conclusão (~2-5 minutos)

### OU via CI/CD Manual
```bash
# Se você usa outro método de deploy
npm run build
# [seu comando de deploy]
```

### ⚠️ IMPORTANTE
- Deploy de frontend deve ocorrer **IMEDIATAMENTE** após migrations
- Máximo 5 minutos entre migrations e frontend
- Frontend antigo NÃO funcionará corretamente com novo schema

---

## ETAPA 4: VALIDAÇÃO PÓS-DEPLOY

### Teste 1: Catálogo Público (2 minutos)
1. Acesse o catálogo público do site
2. Verifique se categorias aparecem corretamente
3. Teste navegação entre categorias
4. Valide que produtos são exibidos

**Resultado esperado:** ✅ Tudo funcionando normalmente

### Teste 2: Admin - Categorias (3 minutos)
1. Acesse: Admin → Categorias
2. Crie uma nova categoria de teste: "Teste Deploy"
3. Dentro dela, crie uma família: "Familia Teste"
4. Valide que apareceram na lista

**Resultado esperado:** ✅ Categoria e família criadas com sucesso

### Teste 3: Admin - Catálogo (5 minutos)
1. Acesse: Admin → Catálogo
2. Clique em "Novo item"
3. Selecione a categoria "Teste Deploy"
4. Selecione a família "Familia Teste"
5. Preencha nome: "Item Teste"
6. Salve
7. **VALIDE:** Código foi gerado automaticamente (formato XX.XX.XXX)

**Resultado esperado:** ✅ Item criado com código automático

### Teste 4: Reordenação (2 minutos)
1. Na lista de catálogo, filtre pela família "Familia Teste"
2. Crie um segundo item na mesma família
3. Use os botões ↑ ↓ para reordenar
4. Valide que a ordem mudou

**Resultado esperado:** ✅ Reordenação funcionando

### Teste 5: Exclusão Segura (2 minutos)
1. Tente excluir a categoria "Teste Deploy"
2. **VALIDE:** Sistema deve bloquear (há itens vinculados)
3. Exclua os 2 itens de teste primeiro
4. Exclua a família "Familia Teste"
5. Exclua a categoria "Teste Deploy"

**Resultado esperado:** ✅ Bloqueio funcionou, exclusão só permitida após limpar dependências

---

## ETAPA 5: MONITORAMENTO (2 HORAS)

### Via Supabase Dashboard

1. **Logs de Erro:**
   - Dashboard → Logs → Error
   - Filtrar últimas 2 horas
   - **Resultado esperado:** Nenhum erro relacionado a catalog_items, catalog_categories, catalog_families

2. **Performance:**
   - Dashboard → Database → Performance
   - Verificar queries lentas
   - **Resultado esperado:** Sem queries >1s

3. **Triggers:**
   - Verificar se trigger de reindexação não está causando slowdown
   - Monitorar INSERT/UPDATE em catalog_items

---

## ROLLBACK DE EMERGÊNCIA

**Use APENAS se houver problemas graves:**

### Cenário 1: Migration 4 falhou
```sql
-- Remover constraints adicionados
ALTER TABLE catalog_items DROP CONSTRAINT IF EXISTS fk_catalog_items_category_slug;
ALTER TABLE catalog_items DROP CONSTRAINT IF EXISTS fk_catalog_items_family;

-- Verificar sucesso
SELECT constraint_name
FROM information_schema.table_constraints
WHERE table_name = 'catalog_items' AND constraint_type = 'FOREIGN KEY';
-- Resultado esperado: 0 linhas
```

### Cenário 2: Frontend quebrado
```bash
# Reverter último commit
git revert HEAD
git push origin main

# Aguardar redeploy automático
```

### Cenário 3: Performance degradada
```sql
-- Desabilitar trigger de reindexação temporariamente
DROP TRIGGER IF EXISTS trg_reindex_catalog_orders ON catalog_items;

-- Reabilitar depois de investigar
CREATE TRIGGER trg_reindex_catalog_orders
AFTER INSERT OR UPDATE OR DELETE ON catalog_items
FOR EACH STATEMENT
EXECUTE FUNCTION reindex_catalog_orders_trigger();
```

---

## CHECKLIST FINAL

### Pré-Deploy
- [x] Query de validação executada (0 duplicatas)
- [ ] Backup do banco realizado
- [ ] Horário de manutenção definido
- [ ] Equipe avisada sobre janela de manutenção
- [ ] Plano de rollback revisado

### Durante Deploy
- [ ] Commit realizado
- [ ] Migrations aplicadas (5 migrations)
- [ ] Frontend deployado
- [ ] Tempo total < 30 minutos

### Pós-Deploy
- [ ] Teste 1: Catálogo público ✅
- [ ] Teste 2: Admin - Categorias ✅
- [ ] Teste 3: Admin - Criar item com código automático ✅
- [ ] Teste 4: Reordenação ✅
- [ ] Teste 5: Exclusão segura ✅
- [ ] Logs verificados (sem erros)
- [ ] Performance normal

### Monitoramento (24h)
- [ ] 2h após deploy: Sem erros nos logs
- [ ] 6h após deploy: Performance normal
- [ ] 24h após deploy: Sistema estável

---

## CONTATOS DE EMERGÊNCIA

**Se algo der errado:**
1. Execute script de rollback (acima)
2. Reverta commit do frontend
3. Documente o erro no GitHub Issues
4. Contate suporte do Supabase (se necessário)

---

## DOCUMENTAÇÃO

**Relatórios completos:**
- Análise de Risco: `docs/checklists/analise-risco-producao-stab.md`
- Homologação Técnica: `docs/checklists/stab-016-relatorio-homologacao-tecnica.md`
- Checklist Operacional: `docs/checklists/stab-016-homologacao-catalogo.md`

**Stories:**
- STAB-011 até STAB-016: `docs/stories/STAB-*.md`

---

**Status:** ✅ PRONTO PARA DEPLOY
**Último update:** 2026-02-24
**Validação:** Query executada, 0 duplicatas encontradas
