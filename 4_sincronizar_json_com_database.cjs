const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

/**
 * SCRIPT 4: Sincronização Final JSON ↔ Database
 *
 * Este script:
 * 1. Importa itens do JSON que não existem no Database
 * 2. Marca como inativo itens do Database que não existem no JSON
 * 3. Atualiza informações divergentes
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

// Função para gerar slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífen
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim();
}

async function syncJsonWithDatabase() {
  console.log('========================================');
  console.log('SINCRONIZAÇÃO JSON ↔ DATABASE');
  console.log('========================================\n');

  // 1. Busca todos os itens do database
  const { data: dbItems, error: dbError } = await supabase
    .from('catalog_items')
    .select('*');

  if (dbError) {
    console.error('❌ Erro ao buscar dados do Supabase:', dbError);
    return;
  }

  // Cria mapa de códigos do database
  const dbCodesMap = new Map();
  dbItems.forEach(item => {
    dbCodesMap.set(item.code, item);
  });

  console.log(`Itens no Database: ${dbItems.length}\n`);

  // 2. Carrega JSON convertido
  const jsonData = JSON.parse(fs.readFileSync('locamulti_produtos_NOVO_PADRAO.json', 'utf-8'));

  // Extrai todos os itens do JSON
  const jsonItemsMap = new Map();
  const jsonItemsList = [];

  jsonData.categorias.forEach(categoria => {
    const categoriaSlug = generateSlug(categoria.nome);

    categoria.familias.forEach(familia => {
      const familiaSlug = generateSlug(familia.nome);

      familia.equipamentos.forEach((item, index) => {
        const itemData = {
          code: item.ordem,
          category_order: categoria.ordem,
          category_no: categoria.ordem,
          category_name: categoria.nome,
          category_slug: categoriaSlug,
          family_order: familia.ordem,
          family_no: familia.ordem,
          family_name: familia.nome,
          family_slug: familiaSlug,
          item_order: index + 1,
          item_type: item.tipo,
          description: item.nome,
          image_url: null, // Será preenchido depois
          active: true
        };

        jsonItemsMap.set(item.ordem, itemData);
        jsonItemsList.push(itemData);
      });
    });
  });

  console.log(`Itens no JSON: ${jsonItemsList.length}\n`);

  // 3. Identifica diferenças
  const itensParaInserir = [];
  const itensParaAtualizar = [];
  const itensParaDesativar = [];

  // Itens no JSON que não existem no DB
  jsonItemsList.forEach(jsonItem => {
    if (!dbCodesMap.has(jsonItem.code)) {
      itensParaInserir.push(jsonItem);
    } else {
      // Item existe - verifica se precisa atualizar
      const dbItem = dbCodesMap.get(jsonItem.code);

      const needsUpdate =
        dbItem.category_order !== jsonItem.category_order ||
        dbItem.family_order !== jsonItem.family_order ||
        dbItem.item_type !== jsonItem.item_type ||
        dbItem.description.trim() !== jsonItem.description.trim();

      if (needsUpdate) {
        itensParaAtualizar.push({
          id: dbItem.id,
          ...jsonItem
        });
      }
    }
  });

  // Itens no DB que não existem no JSON
  dbItems.forEach(dbItem => {
    if (!jsonItemsMap.has(dbItem.code) && dbItem.active) {
      itensParaDesativar.push(dbItem);
    }
  });

  console.log('========================================');
  console.log('ANÁLISE DE SINCRONIZAÇÃO');
  console.log('========================================\n');
  console.log(`✅ Itens para INSERIR: ${itensParaInserir.length}`);
  console.log(`🔄 Itens para ATUALIZAR: ${itensParaAtualizar.length}`);
  console.log(`❌ Itens para DESATIVAR: ${itensParaDesativar.length}\n`);

  // Mostra detalhes
  if (itensParaInserir.length > 0) {
    console.log('Primeiros 10 itens a inserir:');
    itensParaInserir.slice(0, 10).forEach((item, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${item.code.padEnd(12)} | ${item.description.substring(0, 50)}`);
    });
    if (itensParaInserir.length > 10) {
      console.log(`... e mais ${itensParaInserir.length - 10} itens\n`);
    }
  }

  if (itensParaAtualizar.length > 0) {
    console.log('\nPrimeiros 10 itens a atualizar:');
    itensParaAtualizar.slice(0, 10).forEach((item, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${item.code.padEnd(12)} | ${item.description.substring(0, 50)}`);
    });
    if (itensParaAtualizar.length > 10) {
      console.log(`... e mais ${itensParaAtualizar.length - 10} itens\n`);
    }
  }

  if (itensParaDesativar.length > 0) {
    console.log('\nItens a desativar (não existem no JSON):');
    itensParaDesativar.forEach((item, idx) => {
      console.log(`${(idx + 1).toString().padStart(3, '0')}. ${item.code.padEnd(12)} | ${item.description.substring(0, 50)}`);
    });
  }

  console.log('\n========================================');
  console.log('EXECUTANDO SINCRONIZAÇÃO');
  console.log('========================================\n');

  let totalInseridos = 0;
  let totalAtualizados = 0;
  let totalDesativados = 0;
  const erros = [];

  // 4. Insere novos itens
  if (itensParaInserir.length > 0) {
    console.log('🔄 Inserindo novos itens...\n');

    for (const item of itensParaInserir) {
      const { error } = await supabase
        .from('catalog_items')
        .insert([item]);

      if (error) {
        erros.push({
          operacao: 'INSERT',
          code: item.code,
          error: error.message
        });
        console.error(`❌ Erro ao inserir ${item.code}: ${error.message}`);
      } else {
        totalInseridos++;
        if (totalInseridos % 50 === 0) {
          console.log(`   Inseridos: ${totalInseridos}/${itensParaInserir.length}`);
        }
      }
    }
  }

  // 5. Atualiza itens existentes
  if (itensParaAtualizar.length > 0) {
    console.log('\n🔄 Atualizando itens existentes...\n');

    for (const item of itensParaAtualizar) {
      const { id, ...updateData } = item;

      const { error } = await supabase
        .from('catalog_items')
        .update(updateData)
        .eq('id', id);

      if (error) {
        erros.push({
          operacao: 'UPDATE',
          code: item.code,
          error: error.message
        });
        console.error(`❌ Erro ao atualizar ${item.code}: ${error.message}`);
      } else {
        totalAtualizados++;
        if (totalAtualizados % 50 === 0) {
          console.log(`   Atualizados: ${totalAtualizados}/${itensParaAtualizar.length}`);
        }
      }
    }
  }

  // 6. Desativa itens que não existem no JSON
  if (itensParaDesativar.length > 0) {
    console.log('\n🔄 Desativando itens não encontrados no JSON...\n');

    for (const item of itensParaDesativar) {
      const { error } = await supabase
        .from('catalog_items')
        .update({ active: false })
        .eq('id', item.id);

      if (error) {
        erros.push({
          operacao: 'DEACTIVATE',
          code: item.code,
          error: error.message
        });
        console.error(`❌ Erro ao desativar ${item.code}: ${error.message}`);
      } else {
        totalDesativados++;
      }
    }
  }

  console.log('\n========================================');
  console.log('RESULTADO DA SINCRONIZAÇÃO');
  console.log('========================================\n');
  console.log(`✅ Itens inseridos: ${totalInseridos}/${itensParaInserir.length}`);
  console.log(`✅ Itens atualizados: ${totalAtualizados}/${itensParaAtualizar.length}`);
  console.log(`✅ Itens desativados: ${totalDesativados}/${itensParaDesativar.length}`);
  console.log(`❌ Erros: ${erros.length}\n`);

  // Salva relatório
  const relatorioPath = 'relatorio_sincronizacao_final.json';
  fs.writeFileSync(relatorioPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    resumo: {
      total_json: jsonItemsList.length,
      total_database: dbItems.length,
      inseridos: totalInseridos,
      atualizados: totalAtualizados,
      desativados: totalDesativados,
      erros: erros.length
    },
    itens_inseridos: itensParaInserir,
    itens_atualizados: itensParaAtualizar,
    itens_desativados: itensParaDesativar,
    erros: erros
  }, null, 2));

  console.log(`✅ Relatório final salvo em: ${relatorioPath}`);

  console.log('\n========================================');
  console.log('✅ SINCRONIZAÇÃO CONCLUÍDA!');
  console.log('========================================\n');
  console.log('Próximos passos:');
  console.log('1. Revise o relatório de sincronização');
  console.log('2. Teste o catálogo no frontend');
  console.log('3. Verifique se consumíveis aparecem junto aos equipamentos');
  console.log('4. Substitua o JSON antigo pelo novo (locamulti_produtos_NOVO_PADRAO.json)');
  console.log('\n');
}

syncJsonWithDatabase().catch(console.error);
