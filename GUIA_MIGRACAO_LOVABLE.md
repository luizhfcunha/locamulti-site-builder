# 📘 GUIA DE MIGRAÇÃO - CATÁLOGO LOCAMULTI (LOVABLE)

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ANTIGRAVITY (LOCAL)                                        │
│  - Edição de código                                         │
│  - Desenvolvimento local                                    │
│  - Scripts de migração                                      │
│  - Conversão do JSON                                        │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ git push
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  GITHUB (REPOSITÓRIO REMOTO)                                │
│  - Versionamento                                            │
│  - Sincronização                                            │
│  - Backup                                                   │
│                                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ Auto-sync
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  LOVABLE (CLOUD - TESTE/PRODUÇÃO)                          │
│  - Supabase Cloud Database                                  │
│  - Ambiente de testes                                       │
│  - Deploy automático                                        │
│  - AQUI QUE EXECUTAMOS A MIGRAÇÃO! ✅                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚠️ IMPORTANTE: Onde Executar Cada Etapa

| Etapa | Local (AntiGravity) | GitHub | Lovable |
|-------|---------------------|--------|---------|
| **1. Converter JSON** | ✅ AQUI | ❌ | ❌ |
| **2. Commit & Push** | ✅ AQUI | ✅ Recebe | ✅ Sincroniza |
| **3. Mapear códigos DB** | ❌ | ❌ | ✅ AQUI |
| **4. Atualizar Database** | ❌ | ❌ | ✅ AQUI |
| **5. Sincronizar final** | ❌ | ❌ | ✅ AQUI |

---

## 🎯 ESTRATÉGIA DE MIGRAÇÃO

### Por que converter o JSON localmente?

✅ **Vantagens:**
- Você tem controle total sobre o processo
- Pode revisar o JSON convertido antes de enviar
- Mantém histórico de versões no Git
- Lovable já recebe o arquivo pronto

❌ **NÃO converter localmente:**
- Lovable teria que converter, mas não é ideal
- Perderia controle sobre validação

### Por que migrar o Database no Lovable?

✅ **Motivos:**
- O Supabase Database está na cloud do Lovable
- Scripts de migração precisam acessar o database remoto
- Evita problemas de conexão/latência
- Lovable tem acesso direto ao .env do projeto

---

## 📋 PASSO A PASSO COMPLETO

### **PARTE 1: LOCAL (AntiGravity)** 🖥️

#### Etapa 1.1: Converter JSON Localmente

```bash
# No terminal do AntiGravity (local)
cd "C:\Users\kssya\OneDrive\Documentos\Agencia Excalibur Ads\LocaMulti\Locamulti"

# Executa conversão
node 1_converter_json_para_novo_padrao.cjs
```

**Resultado:**
- ✅ `locamulti_produtos_NOVO_PADRAO.json` criado
- ✅ `relatorio_conversao_json.json` criado

#### Etapa 1.2: Validar Conversão

```bash
# Valida se está tudo OK
node validar_conversao.cjs
```

**Verifique:**
- ✅ Todos os 272 itens convertidos
- ✅ Consumíveis na mesma família dos equipamentos
- ✅ Códigos no padrão X.Y.001

#### Etapa 1.3: Substituir JSON Original (Opcional - RECOMENDADO)

```bash
# Backup do original
copy locamulti_produtos.json locamulti_produtos_BACKUP.json

# Substitui pelo novo
copy locamulti_produtos_NOVO_PADRAO.json locamulti_produtos.json
```

**OU manualmente:**
1. Renomear `locamulti_produtos.json` → `locamulti_produtos_BACKUP.json`
2. Renomear `locamulti_produtos_NOVO_PADRAO.json` → `locamulti_produtos.json`

---

#### Etapa 1.4: Commit dos Scripts de Migração

**IMPORTANTE:** Você precisa enviar os scripts de migração para o Lovable poder executá-los!

```bash
# Adiciona os arquivos
git add .

# Commit
git commit -m "feat: adiciona scripts de migração para padrão X.Y.001

- Converte JSON para novo padrão X.Y.001
- Scripts para mapear códigos inválidos do DB
- Scripts para atualizar database Supabase
- Script de sincronização final
- Guia de migração completo
- JSON convertido com 272 itens"

# Push para GitHub
git push origin main
```

**Arquivos que DEVEM ser enviados:**
- ✅ `locamulti_produtos.json` (já convertido)
- ✅ `2_mapear_codigos_invalidos.cjs`
- ✅ `3_atualizar_database.cjs`
- ✅ `4_sincronizar_json_com_database.cjs`
- ✅ `EXECUTAR_MIGRACAO.cjs` (opcional, se quiser usar)
- ✅ `GUIA_MIGRACAO_LOVABLE.md` (este arquivo)

**Arquivos OPCIONAIS (podem enviar para referência):**
- 📄 `relatorio_conversao_json.json`
- 📄 `locamulti_produtos_BACKUP.json`
- 📄 `locamulti_produtos_NOVO_PADRAO.json` (se não substituiu)

---

### **PARTE 2: LOVABLE (Cloud)** ☁️

Aguarde alguns segundos/minutos para o Lovable sincronizar com o GitHub.

#### Etapa 2.1: Verificar Sincronização

No Lovable:
1. Abra o terminal integrado
2. Verifique se os arquivos foram sincronizados:

```bash
ls -la *.cjs
```

**Deve mostrar:**
- `2_mapear_codigos_invalidos.cjs`
- `3_atualizar_database.cjs`
- `4_sincronizar_json_com_database.cjs`

3. Verifique o JSON:

```bash
ls -la locamulti_produtos.json
```

---

#### Etapa 2.2: Mapear Códigos Inválidos do Database

**AGORA SIM - EXECUTA NO LOVABLE!**

```bash
node 2_mapear_codigos_invalidos.cjs
```

**O que vai acontecer:**
- Script conecta no Supabase (usando .env do Lovable)
- Busca os 279 itens do database
- Identifica 194 códigos inválidos (BOS002, GER001, etc.)
- Tenta mapear automaticamente para os códigos corretos
- Gera `mapeamento_codigos_invalidos.json`

**Resultado esperado:**
```
✅ Códigos mapeados com sucesso: 190
❌ Códigos não mapeados: 4
```

**Se houver códigos não mapeados:**
1. Abra `mapeamento_codigos_invalidos.json` no Lovable
2. Complete os mapeamentos faltantes manualmente
3. Salve o arquivo

---

#### Etapa 2.3: Atualizar Database

```bash
node 3_atualizar_database.cjs
```

**O que vai acontecer:**
- Lê o mapeamento criado na etapa anterior
- Atualiza TODOS os códigos no Supabase
- Converte códigos válidos: `1.1.1` → `1.1.001`
- Converte códigos inválidos: `BOS002` → `4.1.002`

**⚠️ ATENÇÃO:** Este script **MODIFICA O DATABASE**!

**Confirmação:**
O script vai perguntar se você tem certeza. Digite `sim` para continuar.

**Resultado esperado:**
```
✅ Atualizações bem-sucedidas: 279
❌ Erros: 0
```

---

#### Etapa 2.4: Sincronizar JSON com Database

```bash
node 4_sincronizar_json_com_database.cjs
```

**O que vai acontecer:**
- Compara JSON (já convertido) com Database (já atualizado)
- Insere itens que existem no JSON mas não no DB
- Atualiza informações divergentes
- Desativa itens que existem no DB mas não no JSON

**Resultado esperado:**
```
✅ Itens inseridos: 0-5
✅ Itens atualizados: 0-3
✅ Itens desativados: 0-7
```

---

### **PARTE 3: VALIDAÇÃO FINAL** ✅

#### No Lovable - Testar o Catálogo

1. Acesse o catálogo no preview do Lovable
2. Navegue pelas categorias
3. Verifique:
   - ✅ Consumíveis aparecem junto aos equipamentos
   - ✅ Códigos estão no formato `X.Y.001`
   - ✅ Ordenação está correta
   - ✅ Nenhum item duplicado

#### Exemplo de como deve aparecer:

```
📁 DEMOLIÇÃO E PERFURAÇÃO
  📂 PERFURATRIZES DIAMANTADAS (1.7)

    EQUIPAMENTOS:
    🔧 1.7.001 - PERFURATRIZ DIAMANTADA DMS 240

    CONSUMÍVEIS:
    🛠️ 1.7.002 - SERRA COPO Ø 57mm
    🛠️ 1.7.003 - SERRA COPO Ø 82mm
    🛠️ 1.7.004 - SERRA COPO Ø 107mm
    🛠️ 1.7.005 - SERRA COPO Ø 159mm
```

---

## 🔍 PERGUNTAS FREQUENTES

### ❓ "Por que não executar tudo no AntiGravity?"

**Resposta:** Porque o database Supabase está na cloud do Lovable. Se executar localmente:
- ❌ Precisaria credenciais de acesso remoto ao Supabase
- ❌ Problemas de latência/conexão
- ❌ Risco de conflitos de versão

### ❓ "E se eu NÃO fizer commit do JSON convertido?"

**Resposta:** O Lovable **NÃO VAI TER** o JSON convertido!
- ❌ Terá apenas o JSON antigo (`X.Y.2001`)
- ❌ Scripts de sincronização vão falhar
- ❌ Terá que converter manualmente no Lovable

**Solução:** SEMPRE faça commit do `locamulti_produtos.json` já convertido.

### ❓ "Preciso fazer backup do database antes?"

**Resposta:** **SIM! OBRIGATÓRIO!**

No Supabase (via Lovable):
1. Acesse o dashboard do Supabase
2. Vá em "Database" → "Backups"
3. Clique em "Create backup"

**OU execute este comando no Lovable:**

```bash
# Exporta todos os itens para backup
node -e "
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  const lines = envFile.split('\\n');
  const env = {};
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      let value = valueParts.join('=').trim();
      if (value.startsWith('\"') && value.endsWith('\"')) {
        value = value.slice(1, -1);
      }
      env[key.trim()] = value;
    }
  });
  return env;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

(async () => {
  const { data, error } = await supabase.from('catalog_items').select('*');
  if (error) {
    console.error('Erro:', error);
  } else {
    fs.writeFileSync('backup_database_antes_migracao.json', JSON.stringify(data, null, 2));
    console.log('Backup salvo: backup_database_antes_migracao.json');
  }
})();
"
```

### ❓ "E se der erro durante a migração?"

**Resposta:** Todos os scripts geram relatórios detalhados:
- `mapeamento_codigos_invalidos.json`
- `relatorio_atualizacao_database.json`
- `relatorio_sincronizacao_final.json`

Revise os relatórios para identificar o problema.

**Para reverter:**
1. Restaure o backup do database no Supabase
2. Faça rollback do commit no Git (se necessário)

---

## 📝 CHECKLIST FINAL

### Antes de Começar:
- [ ] Backup do database Supabase criado
- [ ] JSON convertido localmente (`1_converter_json_para_novo_padrao.cjs`)
- [ ] Validação executada (`validar_conversao.cjs`)
- [ ] Scripts commitados e enviados para GitHub
- [ ] Lovable sincronizado com GitHub

### Durante a Migração (no Lovable):
- [ ] Etapa 2: Mapear códigos inválidos
- [ ] Revisar mapeamento (se houver não mapeados)
- [ ] Etapa 3: Atualizar database (confirmar execução)
- [ ] Etapa 4: Sincronizar JSON com database

### Após a Migração:
- [ ] Testar catálogo no preview do Lovable
- [ ] Verificar consumíveis junto aos equipamentos
- [ ] Verificar códigos no padrão `X.Y.001`
- [ ] Nenhum item duplicado
- [ ] Publicar em produção (quando estiver OK)

---

## 🎯 RESUMO - FLUXO COMPLETO

```
1. LOCAL (AntiGravity):
   ├─ node 1_converter_json_para_novo_padrao.cjs
   ├─ node validar_conversao.cjs
   ├─ Substituir JSON original
   └─ git add . && git commit && git push

2. GITHUB:
   └─ Sincroniza automaticamente

3. LOVABLE (aguardar sync):
   ├─ Verificar arquivos sincronizados
   ├─ node 2_mapear_codigos_invalidos.cjs
   ├─ node 3_atualizar_database.cjs
   ├─ node 4_sincronizar_json_com_database.cjs
   └─ Testar no preview

4. VALIDAÇÃO:
   └─ Verificar catálogo funcionando corretamente

5. PRODUÇÃO:
   └─ Deploy quando tudo estiver OK ✅
```

---

## 🆘 Suporte

Em caso de dúvidas durante a migração:

1. **Revise os relatórios gerados** (arquivos `.json`)
2. **Confira o backup do database** antes de reverter
3. **Teste cada etapa individualmente** antes de prosseguir

---

## ✅ Conclusão

A migração está dividida em **duas partes**:

- **Parte 1 (Local):** Conversão do JSON (seguro, reversível)
- **Parte 2 (Lovable):** Atualização do Database (requer backup)

Isso garante que você tenha **controle total** sobre o processo e possa **testar no Lovable** antes de ir para produção!

🎊 **Boa migração!**
