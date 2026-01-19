# 📘 GUIA DE MIGRAÇÃO - CATÁLOGO LOCAMULTI

## Padrão Novo: `X.Y.001`

Este guia explica como executar a migração completa do catálogo de equipamentos do padrão antigo para o novo padrão de códigos.

---

## 🎯 Objetivo

Padronizar todos os códigos de equipamentos e consumíveis para o formato `X.Y.ZZZ` (3 dígitos), onde:

- **X** = Número da categoria (1 a 10)
- **Y** = Número da família dentro da categoria
- **ZZZ** = Número do item dentro da família (001 a 999)

### Exemplos de Conversão:

| Código Antigo | Código Novo | Tipo |
|---------------|-------------|------|
| `1.1.2001` → `1.1.001` | Martelo Demolidor 30 Kg | Equipamento |
| `1.1.2002` → `1.1.002` | Martelo Demolidor 16 Kg | Equipamento |
| `1.1.2003` → `1.1.003` | Ponteiro Sextavado | Consumível |
| `BOS002` → `4.1.002` | Bomba Submersível | Equipamento |
| `GER001` → `4.2.001` | Gerador Gasolina | Equipamento |

---

## ✅ Vantagens do Novo Padrão

1. ✅ **Consumíveis ficam junto aos equipamentos** (mesma família)
2. ✅ **Códigos limpos e fáceis de ler** (`1.7.005` vs `1.7.2005`)
3. ✅ **Ordenação automática** funciona perfeitamente
4. ✅ **Escalável** - permite até 999 itens por família
5. ✅ **Hierarquia clara** - Cliente vê relação equipamento → consumível
6. ✅ **Elimina 194 códigos inválidos** (BOS002, GER001, etc.)

---

## 📋 Pré-requisitos

Antes de executar a migração, certifique-se de que:

- ✅ Node.js está instalado
- ✅ Arquivo `.env` existe com as credenciais do Supabase
- ✅ Arquivo `locamulti_produtos.json` existe
- ✅ Você tem acesso de escrita ao banco de dados Supabase
- ✅ **IMPORTANTE:** Faça backup do database antes de executar!

---

## 🚀 Execução da Migração

### Opção 1: Executar Tudo de Uma Vez (RECOMENDADO)

```bash
node EXECUTAR_MIGRACAO.cjs
```

Este script executa automaticamente todas as 4 etapas e cria backup do JSON original.

### Opção 2: Executar Etapa por Etapa

Se preferir controle manual sobre cada etapa:

#### Etapa 1: Converter JSON

```bash
node 1_converter_json_para_novo_padrao.cjs
```

**O que faz:**
- Lê `locamulti_produtos.json`
- Converte todos os códigos para `X.Y.001`
- Gera `locamulti_produtos_NOVO_PADRAO.json`
- Gera `relatorio_conversao_json.json`

**Saída esperada:**
```
✅ Total de códigos convertidos: 272
✅ JSON convertido salvo em: locamulti_produtos_NOVO_PADRAO.json
```

---

#### Etapa 2: Mapear Códigos Inválidos

```bash
node 2_mapear_codigos_invalidos.cjs
```

**O que faz:**
- Busca itens no database
- Identifica 194 códigos inválidos (BOS002, GER001, etc.)
- Tenta mapear automaticamente para os códigos corretos
- Gera `mapeamento_codigos_invalidos.json`

**Saída esperada:**
```
✅ Códigos mapeados com sucesso: 190
❌ Códigos não mapeados: 4
```

**⚠️ ATENÇÃO:** Se houver códigos não mapeados, você precisará completar o mapeamento manualmente no arquivo `mapeamento_codigos_invalidos.json` antes de continuar.

---

#### Etapa 3: Atualizar Database

```bash
node 3_atualizar_database.cjs
```

**O que faz:**
- Lê o mapeamento criado na Etapa 2
- Atualiza todos os códigos no database
- Gera `relatorio_atualizacao_database.json`

**Saída esperada:**
```
✅ Atualizações bem-sucedidas: 279
❌ Erros: 0
```

**⚠️ ESTA ETAPA MODIFICA O DATABASE!**

---

#### Etapa 4: Sincronizar JSON com Database

```bash
node 4_sincronizar_json_com_database.cjs
```

**O que faz:**
- Compara JSON convertido com database atualizado
- Insere itens que existem no JSON mas não no database
- Atualiza informações divergentes
- Desativa itens que existem no database mas não no JSON
- Gera `relatorio_sincronizacao_final.json`

**Saída esperada:**
```
✅ Itens inseridos: 5
✅ Itens atualizados: 3
✅ Itens desativados: 7
```

---

## 📊 Arquivos Gerados

Após a execução completa, você terá os seguintes arquivos:

| Arquivo | Descrição |
|---------|-----------|
| `locamulti_produtos_NOVO_PADRAO.json` | JSON convertido para o novo padrão |
| `locamulti_produtos_BACKUP_*.json` | Backup do JSON original |
| `relatorio_conversao_json.json` | Relatório da conversão do JSON |
| `mapeamento_codigos_invalidos.json` | Mapeamento dos códigos inválidos |
| `relatorio_atualizacao_database.json` | Relatório da atualização do database |
| `relatorio_sincronizacao_final.json` | Relatório da sincronização final |

---

## ✅ Validação Pós-Migração

Após executar a migração, verifique:

### 1. No Database (Supabase)

Execute esta query para verificar os códigos:

```sql
SELECT
  code,
  category_order,
  family_order,
  item_type,
  description
FROM catalog_items
WHERE active = true
ORDER BY category_order, family_order, item_order
LIMIT 50;
```

**Resultado esperado:**
- Todos os códigos no formato `X.Y.001`, `X.Y.002`, etc.
- Nenhum código inválido (BOS002, GER001, etc.)

### 2. No Frontend

Acesse o catálogo e verifique:

- ✅ Todas as categorias aparecem
- ✅ Todas as famílias aparecem
- ✅ Consumíveis aparecem **junto** aos equipamentos da mesma família
- ✅ Ordenação está correta (equipamentos primeiro, depois consumíveis)
- ✅ Nenhum item duplicado

### Exemplo de como deve aparecer:

```
📁 Categoria 1 - DEMOLIÇÃO E PERFURAÇÃO
  📂 Família 1.1 - MARTELOS DEMOLIDORES

    EQUIPAMENTOS:
    🔧 1.1.001 - MARTELO DEMOLIDOR 30 Kg
    🔧 1.1.002 - MARTELO DEMOLIDOR 16 Kg

    CONSUMÍVEIS:
    🛠️ 1.1.003 - PONTEIRO SEXTAVADO 28mm
    🛠️ 1.1.004 - TALHADEIRA SEXTAVADA 28mm

  📂 Família 1.7 - PERFURATRIZES DIAMANTADAS

    EQUIPAMENTOS:
    🔧 1.7.001 - PERFURATRIZ DIAMANTADA DMS 240

    CONSUMÍVEIS:
    🛠️ 1.7.002 - SERRA COPO Ø 57mm
    🛠️ 1.7.003 - SERRA COPO Ø 82mm
    🛠️ 1.7.004 - SERRA COPO Ø 107mm
    🛠️ 1.7.005 - SERRA COPO Ø 159mm
```

---

## 🔄 Finalização

Se tudo estiver correto, substitua o JSON original:

```bash
# Windows
move locamulti_produtos.json locamulti_produtos_OLD.json
move locamulti_produtos_NOVO_PADRAO.json locamulti_produtos.json

# Linux/Mac
mv locamulti_produtos.json locamulti_produtos_OLD.json
mv locamulti_produtos_NOVO_PADRAO.json locamulti_produtos.json
```

---

## 🆘 Resolução de Problemas

### Problema 1: Códigos não mapeados

**Sintoma:**
```
❌ Códigos não mapeados: 4
```

**Solução:**
1. Abra `mapeamento_codigos_invalidos.json`
2. Localize a seção `nao_mapeados`
3. Para cada item, adicione manualmente na seção `mapeamentos`:

```json
{
  "codigo_antigo": "XYZ123",
  "codigo_novo": "4.3.005",
  "nome": "Nome do equipamento",
  "categoria": 4,
  "familia": "4.3",
  "tipo": "equipamento",
  "db_id": "uuid-do-item"
}
```

4. Execute novamente a Etapa 3

### Problema 2: Erro de permissão no database

**Sintoma:**
```
❌ Erro ao atualizar: permission denied
```

**Solução:**
- Verifique se a chave do Supabase tem permissão de escrita
- Verifique as RLS (Row Level Security) policies no Supabase
- Você pode precisar usar a Service Role Key (com cuidado!)

### Problema 3: Itens duplicados

**Sintoma:**
Itens aparecem duplicados no frontend

**Solução:**
1. Execute esta query no Supabase:

```sql
SELECT code, COUNT(*)
FROM catalog_items
WHERE active = true
GROUP BY code
HAVING COUNT(*) > 1;
```

2. Se houver duplicatas, desative as mais antigas:

```sql
UPDATE catalog_items
SET active = false
WHERE id IN (
  SELECT id FROM catalog_items
  WHERE code = 'X.Y.001'
  ORDER BY created_at DESC
  OFFSET 1
);
```

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Revise os arquivos de relatório gerados
2. Verifique se seguiu todas as etapas em ordem
3. Confira se o backup foi criado antes de fazer alterações

---

## 🎉 Conclusão

Após concluir a migração com sucesso:

- ✅ Todos os códigos estarão no padrão `X.Y.001`
- ✅ Consumíveis aparecerão junto aos equipamentos relacionados
- ✅ O catálogo estará organizado e escalável
- ✅ Não haverá mais códigos inválidos

**Parabéns! 🎊 Seu catálogo está padronizado!**
