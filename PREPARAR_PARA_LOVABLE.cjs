const fs = require('fs');
const { execSync } = require('child_process');

/**
 * SCRIPT: Preparar migração para Lovable
 *
 * Este script prepara tudo localmente antes de enviar para o Lovable
 */

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║      PREPARAÇÃO LOCAL - MIGRAÇÃO PARA LOVABLE             ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

console.log('Este script vai preparar tudo localmente e criar o commit.\n');
console.log('Etapas:\n');
console.log('  1. ✅ Converter JSON (já feito)');
console.log('  2. 📦 Criar backup do JSON original');
console.log('  3. 🔄 Substituir JSON original pelo convertido');
console.log('  4. 📝 Listar arquivos para commit');
console.log('  5. ⏸️  Aguardar sua confirmação para commit\n');

console.log('═'.repeat(60));
console.log('ETAPA 1: VERIFICAÇÃO');
console.log('═'.repeat(60) + '\n');

// Verifica se a conversão foi feita
if (!fs.existsSync('locamulti_produtos_NOVO_PADRAO.json')) {
  console.error('❌ ERRO: Arquivo locamulti_produtos_NOVO_PADRAO.json não encontrado!');
  console.error('   Execute primeiro: node 1_converter_json_para_novo_padrao.cjs\n');
  process.exit(1);
}

console.log('✅ JSON convertido encontrado: locamulti_produtos_NOVO_PADRAO.json');

// Verifica se o relatório existe
if (!fs.existsSync('relatorio_conversao_json.json')) {
  console.error('❌ ERRO: Relatório de conversão não encontrado!');
  process.exit(1);
}

console.log('✅ Relatório de conversão encontrado: relatorio_conversao_json.json\n');

console.log('═'.repeat(60));
console.log('ETAPA 2: BACKUP DO JSON ORIGINAL');
console.log('═'.repeat(60) + '\n');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const backupPath = `locamulti_produtos_BACKUP_${timestamp}.json`;

try {
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync('locamulti_produtos.json', backupPath);
    console.log(`✅ Backup criado: ${backupPath}\n`);
  } else {
    console.log(`ℹ️  Backup já existe: ${backupPath}\n`);
  }
} catch (error) {
  console.error('❌ Erro ao criar backup:', error.message);
  process.exit(1);
}

console.log('═'.repeat(60));
console.log('ETAPA 3: SUBSTITUIR JSON ORIGINAL');
console.log('═'.repeat(60) + '\n');

try {
  // Copia o JSON convertido sobre o original
  fs.copyFileSync('locamulti_produtos_NOVO_PADRAO.json', 'locamulti_produtos.json');
  console.log('✅ JSON original substituído pelo convertido (padrão X.Y.001)\n');
} catch (error) {
  console.error('❌ Erro ao substituir JSON:', error.message);
  process.exit(1);
}

console.log('═'.repeat(60));
console.log('ETAPA 4: ARQUIVOS PARA COMMIT');
console.log('═'.repeat(60) + '\n');

console.log('📦 Arquivos que serão enviados para o Lovable:\n');

const arquivosParaCommit = [
  'locamulti_produtos.json',
  '2_mapear_codigos_invalidos.cjs',
  '3_atualizar_database.cjs',
  '4_sincronizar_json_com_database.cjs',
  'GUIA_MIGRACAO_LOVABLE.md',
  'PREPARAR_PARA_LOVABLE.cjs',
  'validar_conversao.cjs'
];

console.log('✅ Arquivos ESSENCIAIS (devem ser enviados):');
arquivosParaCommit.forEach(arquivo => {
  const exists = fs.existsSync(arquivo);
  const status = exists ? '✓' : '✗';
  console.log(`   [${status}] ${arquivo}`);
});

console.log('\n📄 Arquivos OPCIONAIS (podem enviar para referência):');
const opcionais = [
  'relatorio_conversao_json.json',
  'locamulti_produtos_NOVO_PADRAO.json',
  backupPath
];

opcionais.forEach(arquivo => {
  const exists = fs.existsSync(arquivo);
  const status = exists ? '✓' : '✗';
  console.log(`   [${status}] ${arquivo}`);
});

console.log('\n');

// Verifica status do Git
console.log('═'.repeat(60));
console.log('ETAPA 5: STATUS DO GIT');
console.log('═'.repeat(60) + '\n');

try {
  const status = execSync('git status --short', { encoding: 'utf-8' });

  if (status.trim()) {
    console.log('📝 Arquivos modificados/novos:\n');
    console.log(status);
  } else {
    console.log('ℹ️  Nenhuma modificação detectada.\n');
  }
} catch (error) {
  console.log('⚠️  Não foi possível verificar status do Git.\n');
}

console.log('═'.repeat(60));
console.log('PRÓXIMOS PASSOS');
console.log('═'.repeat(60) + '\n');

console.log('🎯 Agora você deve:\n');
console.log('1. Revisar os arquivos modificados acima');
console.log('2. Executar os comandos Git:\n');

console.log('   git add locamulti_produtos.json');
console.log('   git add 2_mapear_codigos_invalidos.cjs');
console.log('   git add 3_atualizar_database.cjs');
console.log('   git add 4_sincronizar_json_com_database.cjs');
console.log('   git add GUIA_MIGRACAO_LOVABLE.md');
console.log('   git add validar_conversao.cjs\n');

console.log('   git commit -m "feat: migração catálogo para padrão X.Y.001\n');
console.log('   \n');
console.log('   - Converte JSON para novo padrão X.Y.001\n');
console.log('   - Scripts para migração do database no Lovable\n');
console.log('   - Guia de migração completo\n');
console.log('   - Consumíveis mantidos junto aos equipamentos\n');
console.log('   - 272 itens convertidos com sucesso"\n');

console.log('   git push origin main\n');

console.log('3. Aguardar sincronização do GitHub → Lovable');
console.log('4. No Lovable, executar os scripts de migração do database\n');

console.log('═'.repeat(60));
console.log('📖 LEIA O GUIA COMPLETO');
console.log('═'.repeat(60) + '\n');

console.log('Para instruções detalhadas de como executar no Lovable:');
console.log('👉 Abra o arquivo: GUIA_MIGRACAO_LOVABLE.md\n');

console.log('═'.repeat(60));
console.log('✅ PREPARAÇÃO LOCAL CONCLUÍDA!');
console.log('═'.repeat(60) + '\n');
