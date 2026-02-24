# Análise de Risco - Deploy STAB em Produção

## Data da Análise
**2026-02-24**

## Objetivo
Avaliar se é seguro fazer commit e deploy das mudanças STAB-011 até STAB-016 em produção com o sistema rodando.

---

## 1. Resumo Executivo

### ✅ Conclusão Geral: **DEPLOY SEGURO COM RESSALVAS**

**Nível de Risco:** 🟡 **MÉDIO** (mitigável com plano de execução adequado)

**Recomendação:**
- ✅ **SIM, é seguro fazer commit**
- ⚠️ **Deploy requer janela de manutenção de ~5-10 minutos** para migrations
- ✅ **Compatibilidade backwards: SIM** (frontend antigo continua funcionando)
- ✅ **Rollback possível: SIM** (sem perda de dados)

---

## 2. Análise das Migrations (5 migrations novas)

### 🟢 Migration 1: `20260219120000_fix_catalog_items_admin_select_policy.sql`

**Tipo:** Correção de RLS Policy

**Operações:**
```sql
DROP POLICY IF EXISTS "Allow admins read all catalog_items"
CREATE POLICY "Allow admins read all catalog_items"
```

**Risco:** 🟢 **BAIXO**
- **Tempo de execução:** < 1 segundo
- **Lock:** Momentâneo (statement-level)
- **Impacto:** Apenas admins, não afeta público
- **Reversível:** SIM (pode dropar a policy)
- **Breaking change:** NÃO

**Segurança:** ✅ **SEGURO**

---

### 🟢 Migration 2: `20260219133000_create_featured_carousel_items.sql`

**Tipo:** Criação de tabela nova

**Operações:**
```sql
CREATE TABLE featured_carousel_items
CREATE INDEX
ALTER TABLE ... ENABLE ROW LEVEL SECURITY
CREATE POLICY (5x)
CREATE TRIGGER
```

**Risco:** 🟢 **BAIXO**
- **Tempo de execução:** < 2 segundos
- **Lock:** Nenhum em tabelas existentes
- **Impacto:** Zero (tabela nova, sem dependências)
- **Reversível:** SIM (DROP TABLE)
- **Breaking change:** NÃO

**Segurança:** ✅ **SEGURO** - Tabela isolada, não afeta catálogo atual

---

### 🟡 Migration 3: `20260219184000_reindex_catalog_orders_after_mutations.sql`

**Tipo:** Funções + Trigger em tabela existente

**Operações:**
```sql
CREATE OR REPLACE FUNCTION reindex_catalog_orders()
CREATE OR REPLACE FUNCTION reindex_catalog_orders_trigger()
CREATE TRIGGER AFTER INSERT/UPDATE/DELETE ON catalog_items
SELECT reindex_catalog_orders() -- Executa imediatamente!
```

**Risco:** 🟡 **MÉDIO**
- **Tempo de execução:** ~3-10 segundos (depende do volume de dados)
- **Lock:** ShareRowExclusiveLock durante normalização inicial
- **Impacto:** Pode causar **lentidão temporária** no catálogo
- **Reversível:** SIM (DROP TRIGGER + DROP FUNCTION)
- **Breaking change:** NÃO

**⚠️ ATENÇÃO:**
- A última linha `SELECT reindex_catalog_orders()` **executa normalização IMEDIATAMENTE**
- Se houver muitos itens no catálogo (>1000), pode demorar 5-10 segundos
- Durante esse tempo, **writes em catalog_items podem ficar bloqueados**

**Mitigação:**
- Executar em horário de baixo tráfego
- Monitorar tempo de execução
- Se demorar >30s, considerar ROLLBACK manual

**Segurança:** ⚠️ **SEGURO COM RESSALVAS** - Executar fora do horário de pico

---

### 🟡 Migration 4: `20260219190000_create_catalog_master_tables.sql`

**Tipo:** Criação de tabelas mestres + backfill + ALTER TABLE (FKs)

**Operações:**
```sql
-- 1. Criar tabelas novas (SEGURO)
CREATE TABLE catalog_categories
CREATE TABLE catalog_families
CREATE INDEX (2x)

-- 2. Backfill inicial (ATENÇÃO)
INSERT INTO catalog_categories ... ON CONFLICT DO UPDATE
INSERT INTO catalog_families ... ON CONFLICT DO UPDATE

-- 3. Adicionar Foreign Keys (LOCK!)
ALTER TABLE catalog_items ADD CONSTRAINT fk_catalog_items_category_slug
ALTER TABLE catalog_items ADD CONSTRAINT fk_catalog_items_family

-- 4. Habilitar RLS e criar policies (SEGURO)
ALTER TABLE ... ENABLE ROW LEVEL SECURITY
CREATE POLICY (10x)
CREATE TRIGGER (2x)
```

**Risco:** 🟡 **MÉDIO-ALTO**

#### Fase 1: CREATE TABLE (SEGURO)
- **Tempo:** < 2 segundos
- **Lock:** Nenhum
- **Segurança:** ✅

#### Fase 2: Backfill (ATENÇÃO)
- **Tempo:** ~2-5 segundos (depende do volume)
- **Lock:** Nenhum em catalog_items (apenas leitura)
- **Segurança:** ✅

#### Fase 3: ADD CONSTRAINT (CRÍTICO!)
- **Tempo:** ~5-15 segundos
- **Lock:** **ShareRowExclusiveLock** em `catalog_items`
  - 🔒 **Bloqueia todos os writes** (INSERT, UPDATE, DELETE)
  - ✅ **Permite reads** (SELECT continua funcionando)
- **Impacto:** **Catálogo público continua funcionando** (apenas lê)
- **Impacto:** **Admin não consegue criar/editar itens** durante ~10-15s
- **Validação:** PostgreSQL valida **TODOS os registros existentes** para garantir integridade

**⚠️ ATENÇÃO CRÍTICA:**
Se houver **registros órfãos** (category_slug ou family_slug que não existem), a migration **FALHARÁ**!

**Mitigação:**
```sql
-- Antes do deploy, verificar órfãos:
SELECT category_slug, family_slug, COUNT(*)
FROM catalog_items
WHERE NOT EXISTS (
  SELECT 1 FROM catalog_categories cc WHERE cc.slug = catalog_items.category_slug
)
GROUP BY category_slug, family_slug;
```

**Reversibilidade:**
- ✅ Pode dropar constraints: `ALTER TABLE catalog_items DROP CONSTRAINT ...`
- ⚠️ Backfill já terá populado as tabelas mestres (mas não há problema)

**Segurança:** ⚠️ **SEGURO COM VALIDAÇÃO PRÉVIA** - Executar query de validação antes!

---

### 🟢 Migration 5: `20260219194000_auto_generate_catalog_item_code.sql`

**Tipo:** Criação de função + trigger

**Operações:**
```sql
CREATE OR REPLACE FUNCTION generate_catalog_item_code()
CREATE TRIGGER trg_generate_catalog_item_code BEFORE INSERT
```

**Risco:** 🟢 **BAIXO**
- **Tempo de execução:** < 1 segundo
- **Lock:** Nenhum
- **Impacto:** Zero (apenas novos inserts)
- **Reversível:** SIM (DROP TRIGGER + DROP FUNCTION)
- **Breaking change:** NÃO

**Comportamento:**
- Trigger só dispara em **novos inserts**
- Registros existentes **não são afetados**
- Campo `code` existente é **preservado**

**Segurança:** ✅ **SEGURO**

---

## 3. Análise de Compatibilidade Backwards

### Frontend Atual vs. Novo Schema

#### ✅ Catálogo Público (Leitura)
**Status:** ✅ **COMPATÍVEL** - Zero impacto

**Motivo:**
- Frontend lê de `catalog_items` (tabela preservada)
- Campos antigos continuam existindo
- Novas tabelas mestres não são consultadas pelo frontend antigo

#### ⚠️ Admin (Escrita)
**Status:** ⚠️ **REQUER DEPLOY SIMULTÂNEO DE FRONTEND**

**Motivo:**
- Frontend antigo tentará criar itens sem categoria/família válidas
- **FK constraints bloquearão** inserção de dados inválidos
- Frontend novo valida categoria/família **antes** de inserir

**Solução:**
- Deploy de frontend **IMEDIATAMENTE APÓS** migrations
- Janela crítica: ~2-5 minutos entre migrations e frontend

---

## 4. Análise de Rollback

### Cenário: Migration 4 falhou (FK constraint)

**Causa mais provável:** Dados órfãos

**Rollback:**
```sql
-- 1. Remover constraints
ALTER TABLE catalog_items DROP CONSTRAINT fk_catalog_items_category_slug;
ALTER TABLE catalog_items DROP CONSTRAINT fk_catalog_items_family;

-- 2. (Opcional) Dropar tabelas mestres
DROP TABLE catalog_families;
DROP TABLE catalog_categories;
```

**Tempo de rollback:** < 5 segundos

**Perda de dados:** ❌ NENHUMA - catalog_items não é modificado

---

## 5. Plano de Execução Recomendado

### Pré-Deploy (Obrigatório)

1. **Validar órfãos:**
```sql
-- Query 1: Validar categorias
SELECT DISTINCT category_slug, category_name
FROM catalog_items
ORDER BY category_slug;

-- Query 2: Validar famílias
SELECT DISTINCT category_slug, family_slug, family_name
FROM catalog_items
ORDER BY category_slug, family_slug;

-- Query 3: Contar itens
SELECT COUNT(*) FROM catalog_items;
```

2. **Backup do banco:**
```bash
# Via Supabase Dashboard ou CLI
supabase db dump > backup_pre_stab_$(date +%Y%m%d_%H%M%S).sql
```

### Deploy (Sequencial)

#### Etapa 1: Commit do código
```bash
git add .
git commit -m "feat: refatoração estrutura catálogo (STAB-011 a STAB-016)"
git push origin main
```

#### Etapa 2: Executar Migrations (Supabase Dashboard)
**Ordem correta:**
1. `20260219120000_fix_catalog_items_admin_select_policy.sql` (~1s)
2. `20260219133000_create_featured_carousel_items.sql` (~2s)
3. `20260219184000_reindex_catalog_orders_after_mutations.sql` (~5-10s) ⚠️
4. `20260219190000_create_catalog_master_tables.sql` (~10-15s) ⚠️ **CRÍTICO**
5. `20260219194000_auto_generate_catalog_item_code.sql` (~1s)

**Tempo total estimado:** ~20-30 segundos

⚠️ **JANELA CRÍTICA:** Migrations 3 e 4 causam lock temporário

#### Etapa 3: Deploy do Frontend
- Via Lovable.dev ou CI/CD
- **IMEDIATAMENTE** após migrations

#### Etapa 4: Validação Pós-Deploy
```bash
# 1. Testar catálogo público
curl https://seu-site.com/catalogo

# 2. Testar admin (criar categoria)
# Via interface admin

# 3. Verificar logs de erro
# Via Supabase Dashboard > Logs
```

### Pós-Deploy (Monitoramento)

**Primeiras 2 horas:**
- ✅ Monitorar erros no Supabase Dashboard
- ✅ Testar criação de item no admin
- ✅ Validar catálogo público

**Primeiras 24 horas:**
- ✅ Monitorar performance de reindexação (trigger)
- ✅ Validar geração automática de códigos

---

## 6. Checklist de Segurança

### Antes do Deploy
- [ ] Backup do banco realizado
- [ ] Query de validação de órfãos executada (resultado: OK)
- [ ] Contagem de itens verificada (<1000 itens = risco baixo)
- [ ] Horário escolhido (baixo tráfego, ex: 22h-6h)
- [ ] Plano de rollback revisado
- [ ] Frontend pronto para deploy

### Durante o Deploy
- [ ] Migrations executadas na ordem correta
- [ ] Tempo de execução monitorado (<30s = OK)
- [ ] Frontend deployado imediatamente após migrations
- [ ] Erros no console monitorados

### Após o Deploy
- [ ] Catálogo público funcionando (teste manual)
- [ ] Admin consegue criar categoria/família
- [ ] Admin consegue criar item com código automático
- [ ] Reordenação de itens funcionando
- [ ] Sem erros nos logs (primeiras 2h)

---

## 7. Riscos Residuais Identificados

### 🟡 Risco 1: Dados Órfãos
**Probabilidade:** Baixa (se backfill anterior funcionou corretamente)
**Impacto:** Alto (migration falhará)
**Mitigação:** Executar query de validação antes do deploy

### 🟡 Risco 2: Lock Prolongado (>30s)
**Probabilidade:** Baixa (apenas se >5000 itens no catálogo)
**Impacto:** Médio (admin temporariamente indisponível)
**Mitigação:** Executar em horário de baixo tráfego

### 🟢 Risco 3: Frontend Incompatível
**Probabilidade:** Zero (frontend já atualizado)
**Impacto:** Baixo (apenas admin afetado)
**Mitigação:** Deploy simultâneo de frontend

### 🟢 Risco 4: Perda de Dados
**Probabilidade:** Zero (migrations são aditivas)
**Impacto:** Nenhum
**Mitigação:** Backup pré-deploy

---

## 8. Recomendações Finais

### ✅ **APROVADO PARA PRODUÇÃO** com as seguintes condições:

1. **Executar em janela de manutenção** (baixo tráfego)
2. **Validar dados órfãos** antes do deploy (query obrigatória)
3. **Backup completo** do banco antes de iniciar
4. **Deploy sequencial:** Migrations → Frontend (máximo 5 min entre eles)
5. **Monitoramento ativo** nas primeiras 2 horas

### Janela de Deploy Recomendada
- **Melhor horário:** Terça a Quinta, 22h-23h (baixo tráfego)
- **Evitar:** Segunda (início de semana), Sexta (fim de semana próximo)
- **Duração total:** ~30-45 minutos (incluindo validações)

### Rollback Plan (se necessário)
- **Trigger:** Migration 4 falha ou demora >2 minutos
- **Ação:** Executar script de rollback (dropar constraints)
- **Tempo:** < 5 minutos
- **Perda de dados:** Nenhuma

---

## 9. Aprovações

**Análise técnica:** ✅ Claude AI (Sonnet 4.5)
**Status:** ✅ **APROVADO COM RESSALVAS**
**Data:** 2026-02-24

**Próxima etapa:** Validar dados e agendar janela de deploy

---

## Anexo A: Query de Validação Pré-Deploy

Execute no Supabase SQL Editor **ANTES** de fazer deploy:

```sql
-- 1. Verificar total de itens (estimar tempo de lock)
SELECT
  COUNT(*) as total_items,
  CASE
    WHEN COUNT(*) < 500 THEN 'Lock rápido (~5s)'
    WHEN COUNT(*) < 2000 THEN 'Lock moderado (~10s)'
    ELSE 'Lock lento (~15-30s)'
  END as estimated_lock_time
FROM catalog_items;

-- 2. Verificar estrutura atual (categorias únicas)
SELECT
  category_slug,
  category_name,
  COUNT(*) as num_items
FROM catalog_items
GROUP BY category_slug, category_name
ORDER BY category_slug;

-- 3. Verificar estrutura atual (famílias únicas)
SELECT
  category_slug,
  family_slug,
  family_name,
  COUNT(*) as num_items
FROM catalog_items
GROUP BY category_slug, family_slug, family_name
ORDER BY category_slug, family_slug;

-- 4. CRÍTICO: Verificar se há códigos duplicados
SELECT code, COUNT(*)
FROM catalog_items
WHERE code IS NOT NULL AND code != ''
GROUP BY code
HAVING COUNT(*) > 1;

-- Se resultado = 0 linhas → OK para deploy
-- Se resultado > 0 → BLOQUEAR deploy, corrigir duplicatas primeiro!
```

**Resultado esperado:**
- Query 1: < 2000 itens
- Query 2: Lista de categorias (todas devem ter slug válido)
- Query 3: Lista de famílias (todas devem ter slug válido)
- Query 4: **0 linhas** (sem duplicatas)

Se Query 4 retornar linhas: **NÃO FAZER DEPLOY** até corrigir!

---

## Anexo B: Script de Rollback de Emergência

**Use apenas se a migration 4 falhar ou causar problemas graves:**

```sql
-- ROLLBACK: Remover constraints adicionados pela migration 4
BEGIN;

-- 1. Remover constraints de FK
ALTER TABLE public.catalog_items
DROP CONSTRAINT IF EXISTS fk_catalog_items_category_slug;

ALTER TABLE public.catalog_items
DROP CONSTRAINT IF EXISTS fk_catalog_items_family;

-- 2. (Opcional) Remover tabelas mestres
-- ATENÇÃO: Só fazer se quiser rollback completo!
-- DROP TABLE IF EXISTS public.catalog_families CASCADE;
-- DROP TABLE IF EXISTS public.catalog_categories CASCADE;

COMMIT;

-- Verificar se rollback funcionou
SELECT
  constraint_name,
  table_name
FROM information_schema.table_constraints
WHERE table_name = 'catalog_items'
  AND constraint_type = 'FOREIGN KEY';

-- Se resultado = 0 linhas → Rollback completo
```

**Tempo de execução:** < 5 segundos
**Perda de dados:** ❌ NENHUMA
