const { execSync } = require('child_process');
const fs = require('fs');

/**
 * SCRIPT PRINCIPAL - EXECUÇÃO COMPLETA DA MIGRAÇÃO
 *
 * Este script executa todos os passos da migração em sequência
 */

console.log('\n');
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║     MIGRAÇÃO CATÁLOGO LOCAMULTI - PADRÃO X.Y.001          ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝');
console.log('\n');

console.log('Este script irá:');
console.log('  1. Converter JSON para padrão X.Y.001');
console.log('  2. Mapear códigos inválidos do database');
console.log('  3. Atualizar database com novos códigos');
console.log('  4. Sincronizar JSON com database\n');

// Função para executar comando e mostrar output
function executarEtapa(numero, titulo, comando) {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log(`ETAPA ${numero}: ${titulo}`);
  console.log('═'.repeat(60));
  console.log('\n');

  try {
    execSync(comando, { stdio: 'inherit' });
    console.log('\n✅ Etapa concluída com sucesso!\n');
    return true;
  } catch (error) {
    console.error(`\n❌ Erro na etapa ${numero}: ${error.message}\n`);
    return false;
  }
}

// Confirmação antes de iniciar
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('⚠️  ATENÇÃO: Esta operação irá modificar o database!\n   Deseja continuar? (sim/não): ', (answer) => {
  readline.close();

  if (answer.toLowerCase() !== 'sim' && answer.toLowerCase() !== 's') {
    console.log('\n❌ Operação cancelada pelo usuário.\n');
    process.exit(0);
  }

  console.log('\n🚀 Iniciando migração...\n');

  // Cria backup do JSON original
  console.log('📦 Criando backup do JSON original...');
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `locamulti_produtos_BACKUP_${timestamp}.json`;
    fs.copyFileSync('locamulti_produtos.json', backupPath);
    console.log(`✅ Backup criado: ${backupPath}\n`);
  } catch (error) {
    console.error(`❌ Erro ao criar backup: ${error.message}`);
    process.exit(1);
  }

  // Executa etapas
  let sucesso = true;

  // Etapa 1: Converter JSON
  sucesso = executarEtapa(
    1,
    'Converter JSON para padrão X.Y.001',
    'node 1_converter_json_para_novo_padrao.cjs'
  );

  if (!sucesso) {
    console.log('❌ Migração interrompida.\n');
    process.exit(1);
  }

  // Etapa 2: Mapear códigos inválidos
  sucesso = executarEtapa(
    2,
    'Mapear códigos inválidos do database',
    'node 2_mapear_codigos_invalidos.cjs'
  );

  if (!sucesso) {
    console.log('❌ Migração interrompida.\n');
    process.exit(1);
  }

  // Verifica se há códigos não mapeados
  try {
    const mapeamento = JSON.parse(fs.readFileSync('mapeamento_codigos_invalidos.json', 'utf-8'));

    if (mapeamento.nao_mapeados && mapeamento.nao_mapeados.length > 0) {
      console.log('\n⚠️  ATENÇÃO: Existem códigos que não foram mapeados automaticamente!');
      console.log(`   Total: ${mapeamento.nao_mapeados.length} itens`);
      console.log('   Revise o arquivo: mapeamento_codigos_invalidos.json\n');

      const readline2 = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline2.question('   Deseja continuar mesmo assim? (sim/não): ', (answer2) => {
        readline2.close();

        if (answer2.toLowerCase() !== 'sim' && answer2.toLowerCase() !== 's') {
          console.log('\n❌ Migração interrompida. Complete o mapeamento e execute novamente.\n');
          process.exit(0);
        }

        continuarMigracao();
      });
    } else {
      continuarMigracao();
    }
  } catch (error) {
    console.error('❌ Erro ao ler mapeamento:', error.message);
    process.exit(1);
  }
});

function continuarMigracao() {
  let sucesso = true;

  // Etapa 3: Atualizar database
  sucesso = executarEtapa(
    3,
    'Atualizar database com novos códigos',
    'node 3_atualizar_database.cjs'
  );

  if (!sucesso) {
    console.log('❌ Migração interrompida.\n');
    process.exit(1);
  }

  // Etapa 4: Sincronizar JSON com database
  sucesso = executarEtapa(
    4,
    'Sincronizar JSON com database',
    'node 4_sincronizar_json_com_database.cjs'
  );

  if (!sucesso) {
    console.log('❌ Migração interrompida.\n');
    process.exit(1);
  }

  // Conclusão
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║              ✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!            ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');

  console.log('📋 PRÓXIMOS PASSOS:\n');
  console.log('1. Revise os relatórios gerados:');
  console.log('   - relatorio_conversao_json.json');
  console.log('   - mapeamento_codigos_invalidos.json');
  console.log('   - relatorio_atualizacao_database.json');
  console.log('   - relatorio_sincronizacao_final.json\n');

  console.log('2. Teste o catálogo no frontend e verifique:');
  console.log('   ✓ Consumíveis aparecem junto aos equipamentos');
  console.log('   ✓ Ordenação está correta');
  console.log('   ✓ Todos os itens estão visíveis\n');

  console.log('3. Se tudo estiver OK, substitua o JSON:');
  console.log('   mv locamulti_produtos.json locamulti_produtos_OLD.json');
  console.log('   mv locamulti_produtos_NOVO_PADRAO.json locamulti_produtos.json\n');

  console.log('4. Atualize o código do frontend (se necessário):\n');
  console.log('   - Verifique se há referências hardcoded aos códigos antigos');
  console.log('   - Atualize consultas SQL que usem os códigos\n');

  console.log('═'.repeat(60));
  console.log('\n');
}
