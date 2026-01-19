const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

/**
 * SCRIPT 3: Atualizar Database com novos códigos
 *
 * Este script atualiza o database Supabase com:
 * 1. Códigos válidos convertidos (X.Y.1 → X.Y.001)
 * 2. Códigos inválidos mapeados (BOS002 → X.Y.001)
 */

// Lê as variáveis de ambiente
function loadEnv() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  const lines = envFile.split('\n');
  const env = {};

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      let value = valueParts.join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      env[key.trim()] = value;
    }
  });

  return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Função para converter código
function convertCode(oldCode) {
  const parts = oldCode.split('.');

  if (parts.length === 3) {
    const categoria = parts[0];
    const familia = parts[1];
    let item = parts[2];

    // Remove o "2000" se existir (2001 → 001)
    if (item.startsWith('200') && item.length === 4) {
      item = item.substring(1);
    }
    // Adiciona zeros à esquerda
    else {
      item = item.padStart(3, '0');
    }

    return `${categoria}.${familia}.${item}`;
  }

  return oldCode;
}

async function updateDatabase() {
  console.log('========================================');
  console.log('ATUALIZAÇÃO DO DATABASE');
  console.log('========================================\n');

  // 1. Busca todos os itens do database
  const { data: dbItems, error } = await supabase
    .from('catalog_items')
    .select('*');

  if (error) {
    console.error('❌ Erro ao buscar dados do Supabase:', error);
    return;
  }

  console.log(`Total de itens no database: ${dbItems.length}\n`);

  // 2. Carrega mapeamento de códigos inválidos
  let mapeamentoData;
  try {
    mapeamentoData = JSON.parse(fs.readFileSync('mapeamento_codigos_invalidos.json', 'utf-8'));
  } catch (err) {
    console.error('❌ Erro: Execute primeiro o script 2_mapear_codigos_invalidos.cjs');
    process.exit(1);
  }

  const mapeamentoMap = new Map();
  mapeamentoData.mapeamentos.forEach(map => {
    mapeamentoMap.set(map.codigo_antigo, map.codigo_novo);
  });

  console.log(`Códigos inválidos mapeados: ${mapeamentoMap.size}`);
  console.log(`Códigos não mapeados: ${mapeamentoData.nao_mapeados.length}\n`);

  if (mapeamentoData.nao_mapeados.length > 0) {
    console.log('⚠️  ATENÇÃO: Existem códigos não mapeados!');
    console.log('   Revise o arquivo mapeamento_codigos_invalidos.json');
    console.log('   antes de continuar.\n');

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      readline.question('Deseja continuar mesmo assim? (sim/não): ', (answer) => {
        readline.close();
        if (answer.toLowerCase() !== 'sim' && answer.toLowerCase() !== 's') {
          console.log('Operação cancelada.');
          resolve();
          return;
        }
        performUpdate();
        resolve();
      });
    });
  } else {
    await performUpdate();
  }

  async function performUpdate() {
    // 3. Prepara atualizações
    const updates = [];

    dbItems.forEach(item => {
      let newCode;

      // Verifica se é um código inválido mapeado
      if (mapeamentoMap.has(item.code)) {
        newCode = mapeamentoMap.get(item.code);
      } else {
        // Converte código válido
        newCode = convertCode(item.code);
      }

      if (newCode !== item.code) {
        updates.push({
          id: item.id,
          oldCode: item.code,
          newCode: newCode,
          description: item.description
        });
      }
    });

    console.log(`\nTotal de códigos a serem atualizados: ${updates.length}\n`);

    if (updates.length === 0) {
      console.log('✅ Nenhuma atualização necessária!');
      return;
    }

    // Mostra primeiros 20
    console.log('Primeiras 20 atualizações:');
    updates.slice(0, 20).forEach((upd, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${upd.oldCode.padEnd(12)} → ${upd.newCode.padEnd(12)} | ${upd.description.substring(0, 40)}`);
    });
    if (updates.length > 20) {
      console.log(`... e mais ${updates.length - 20} atualizações\n`);
    }

    // 4. Executa atualizações
    console.log('\n🔄 Iniciando atualizações no database...\n');

    let sucessos = 0;
    let erros = 0;
    const errosList = [];

    for (const update of updates) {
      const { error } = await supabase
        .from('catalog_items')
        .update({ code: update.newCode })
        .eq('id', update.id);

      if (error) {
        erros++;
        errosList.push({
          id: update.id,
          oldCode: update.oldCode,
          newCode: update.newCode,
          error: error.message
        });
        console.error(`❌ Erro ao atualizar ${update.oldCode}: ${error.message}`);
      } else {
        sucessos++;
        if (sucessos % 50 === 0) {
          console.log(`   Processados: ${sucessos}/${updates.length}`);
        }
      }
    }

    console.log('\n========================================');
    console.log('RESULTADO DA ATUALIZAÇÃO');
    console.log('========================================\n');
    console.log(`✅ Atualizações bem-sucedidas: ${sucessos}`);
    console.log(`❌ Erros: ${erros}\n`);

    // Salva relatório
    const relatorioPath = 'relatorio_atualizacao_database.json';
    fs.writeFileSync(relatorioPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      total_atualizacoes: updates.length,
      sucessos: sucessos,
      erros: erros,
      lista_atualizacoes: updates,
      lista_erros: errosList
    }, null, 2));

    console.log(`✅ Relatório salvo em: ${relatorioPath}`);

    console.log('\n========================================');
    console.log('PRÓXIMO PASSO:');
    console.log('Execute: node 4_sincronizar_json_com_database.cjs');
    console.log('========================================\n');
  }
}

updateDatabase().catch(console.error);
