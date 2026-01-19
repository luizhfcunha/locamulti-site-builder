const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

/**
 * SCRIPT 2: Mapear códigos inválidos do Database
 *
 * Este script identifica todos os códigos inválidos (BOS002, GER001, etc.)
 * e cria um mapeamento para os códigos corretos baseado no JSON convertido
 */

// Lê as variáveis de ambiente manualmente do arquivo .env
function loadEnv() {
  const envFile = fs.readFileSync('.env', 'utf-8');
  const lines = envFile.split('\n');
  const env = {};

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      let value = valueParts.join('=').trim();
      // Remove aspas duplas se existirem
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

async function mapInvalidCodes() {
  console.log('========================================');
  console.log('MAPEAMENTO DE CÓDIGOS INVÁLIDOS');
  console.log('========================================\n');

  // 1. Busca todos os itens do database
  const { data: dbItems, error } = await supabase
    .from('catalog_items')
    .select('*')
    .order('category_order', { ascending: true });

  if (error) {
    console.error('❌ Erro ao buscar dados do Supabase:', error);
    return;
  }

  // 2. Identifica códigos inválidos
  const invalidCodes = [];
  const validCodes = [];

  dbItems.forEach(item => {
    const parts = item.code.split('.');

    // Verifica se é um código inválido (menos de 3 partes ou partes não numéricas)
    const isInvalid = parts.length < 3 || parts.some(part => isNaN(parseInt(part)));

    if (isInvalid) {
      invalidCodes.push(item);
    } else {
      validCodes.push(item);
    }
  });

  console.log(`Total de códigos no database: ${dbItems.length}`);
  console.log(`Códigos inválidos: ${invalidCodes.length}`);
  console.log(`Códigos válidos: ${validCodes.length}\n`);

  // 3. Carrega JSON convertido
  const jsonData = JSON.parse(fs.readFileSync('locamulti_produtos_NOVO_PADRAO.json', 'utf-8'));

  // 4. Cria índice reverso: nome → código do JSON
  const nomeParaCodigo = new Map();

  jsonData.categorias.forEach(categoria => {
    categoria.familias.forEach(familia => {
      familia.equipamentos.forEach(item => {
        // Normaliza o nome para comparação
        const nomeNormalizado = item.nome.toLowerCase().trim();
        nomeParaCodigo.set(nomeNormalizado, {
          codigo: item.ordem,
          categoria: categoria.ordem,
          familia: familia.ordem,
          tipo: item.tipo
        });
      });
    });
  });

  // 5. Tenta mapear códigos inválidos
  const mapeamento = [];
  const naoMapeados = [];

  invalidCodes.forEach(dbItem => {
    const nomeNormalizado = dbItem.description.toLowerCase().trim();

    // Busca exata
    let match = nomeParaCodigo.get(nomeNormalizado);

    // Se não encontrou, tenta busca parcial
    if (!match) {
      for (const [jsonNome, jsonData] of nomeParaCodigo.entries()) {
        // Verifica se o nome do DB contém o nome do JSON ou vice-versa
        if (nomeNormalizado.includes(jsonNome) || jsonNome.includes(nomeNormalizado)) {
          match = jsonData;
          break;
        }
      }
    }

    if (match) {
      mapeamento.push({
        codigo_antigo: dbItem.code,
        codigo_novo: match.codigo,
        nome: dbItem.description,
        categoria: match.categoria,
        familia: match.familia,
        tipo: match.tipo,
        db_id: dbItem.id
      });
    } else {
      naoMapeados.push({
        codigo_antigo: dbItem.code,
        nome: dbItem.description,
        categoria: dbItem.category_order,
        db_id: dbItem.id
      });
    }
  });

  console.log('\n========================================');
  console.log('RESULTADO DO MAPEAMENTO');
  console.log('========================================\n');
  console.log(`✅ Códigos mapeados com sucesso: ${mapeamento.length}`);
  console.log(`❌ Códigos não mapeados: ${naoMapeados.length}\n`);

  // Mostra primeiros 20 mapeamentos
  if (mapeamento.length > 0) {
    console.log('Primeiros 20 mapeamentos:');
    mapeamento.slice(0, 20).forEach((map, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${map.codigo_antigo.padEnd(10)} → ${map.codigo_novo.padEnd(10)} | ${map.nome.substring(0, 50)}`);
    });
    if (mapeamento.length > 20) {
      console.log(`... e mais ${mapeamento.length - 20} mapeamentos\n`);
    }
  }

  // Mostra itens não mapeados (precisam atenção manual)
  if (naoMapeados.length > 0) {
    console.log('\n⚠️  ATENÇÃO: Itens não mapeados automaticamente:');
    naoMapeados.forEach((item, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${item.codigo_antigo.padEnd(10)} | ${item.nome}`);
    });
  }

  // 6. Salva mapeamento
  const mapeamentoPath = 'mapeamento_codigos_invalidos.json';
  fs.writeFileSync(mapeamentoPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total_invalidos: invalidCodes.length,
    total_mapeados: mapeamento.length,
    total_nao_mapeados: naoMapeados.length,
    mapeamentos: mapeamento,
    nao_mapeados: naoMapeados
  }, null, 2));

  console.log(`\n✅ Mapeamento salvo em: ${mapeamentoPath}`);

  console.log('\n========================================');
  console.log('PRÓXIMO PASSO:');
  if (naoMapeados.length > 0) {
    console.log(`⚠️  Revise o arquivo ${mapeamentoPath}`);
    console.log('   e complete os itens não mapeados antes de prosseguir.');
  } else {
    console.log('Execute: node 3_atualizar_database.cjs');
  }
  console.log('========================================\n');
}

mapInvalidCodes().catch(console.error);
