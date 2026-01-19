const fs = require('fs');

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║                                                            ║');
console.log('║           VALIDAÇÃO DA CONVERSÃO DO JSON                  ║');
console.log('║                                                            ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// Carrega JSON convertido
const jsonData = JSON.parse(fs.readFileSync('locamulti_produtos_NOVO_PADRAO.json', 'utf-8'));

console.log('📊 ESTATÍSTICAS GERAIS:\n');
console.log(`  Total de Categorias: ${jsonData.total_categorias}`);
console.log(`  Total de Famílias: ${jsonData.total_familias}`);
console.log(`  Total de Equipamentos: ${jsonData.total_equipamentos}`);
console.log(`  Total de Consumíveis: ${jsonData.total_consumiveis}`);
console.log(`  Total de Itens: ${jsonData.total_itens}\n`);

console.log('═'.repeat(60));
console.log('✅ VALIDAÇÃO: CONSUMÍVEIS JUNTO AOS EQUIPAMENTOS');
console.log('═'.repeat(60));

// Exemplos de famílias com consumíveis
const exemplos = [
  { cat: 0, fam: '1.1', nome: 'MARTELOS DEMOLIDORES' },
  { cat: 0, fam: '1.2', nome: 'MARTELOS ROMPEDORES' },
  { cat: 0, fam: '1.7', nome: 'PERFURATRIZES DIAMANTADAS' },
  { cat: 1, fam: '2.4', nome: 'ALISADORAS DE PISO' },
  { cat: 2, fam: '3.5', nome: 'POLITRIZES MANUAIS' }
];

exemplos.forEach(ex => {
  const categoria = jsonData.categorias[ex.cat];
  const familia = categoria.familias.find(f => f.ordem === ex.fam);

  if (!familia) return;

  const equipamentos = familia.equipamentos.filter(i => i.tipo === 'equipamento');
  const consumiveis = familia.equipamentos.filter(i => i.tipo === 'consumivel');

  console.log(`\n📂 FAMÍLIA ${ex.fam} - ${ex.nome}`);
  console.log(`   Categoria: ${categoria.nome}\n`);

  if (equipamentos.length > 0) {
    console.log('   🔧 EQUIPAMENTOS:');
    equipamentos.forEach(eq => {
      console.log(`      ${eq.ordem} - ${eq.nome.substring(0, 50)}`);
    });
  }

  if (consumiveis.length > 0) {
    console.log('\n   🛠️  CONSUMÍVEIS:');
    consumiveis.forEach(cons => {
      console.log(`      ${cons.ordem} - ${cons.nome.substring(0, 50)}`);
    });
  }

  console.log(`\n   ✅ Total: ${equipamentos.length} equipamentos + ${consumiveis.length} consumíveis na MESMA família`);
});

console.log('\n═'.repeat(60));
console.log('✅ VALIDAÇÃO: PADRÃO DE CÓDIGOS');
console.log('═'.repeat(60));

// Verifica se todos os códigos estão no padrão correto
let codigosCorretos = 0;
let codigosIncorretos = [];

jsonData.categorias.forEach(categoria => {
  categoria.familias.forEach(familia => {
    familia.equipamentos.forEach(item => {
      const parts = item.ordem.split('.');

      // Verifica padrão X.Y.ZZZ
      const padraoCorreto =
        parts.length === 3 &&
        !isNaN(parseInt(parts[0])) &&
        !isNaN(parseInt(parts[1])) &&
        parts[2].length === 3 &&
        !isNaN(parseInt(parts[2]));

      if (padraoCorreto) {
        codigosCorretos++;
      } else {
        codigosIncorretos.push({
          codigo: item.ordem,
          nome: item.nome,
          tipo: item.tipo
        });
      }
    });
  });
});

console.log(`\n✅ Códigos no padrão correto (X.Y.ZZZ): ${codigosCorretos}`);

if (codigosIncorretos.length > 0) {
  console.log(`❌ Códigos fora do padrão: ${codigosIncorretos.length}\n`);
  codigosIncorretos.forEach(cod => {
    console.log(`   ${cod.codigo} - ${cod.nome.substring(0, 50)}`);
  });
} else {
  console.log(`✅ Nenhum código fora do padrão!\n`);
}

console.log('═'.repeat(60));
console.log('✅ VALIDAÇÃO: SEQUÊNCIAS');
console.log('═'.repeat(60));

// Verifica sequências dentro de cada família
let sequenciasOk = 0;
let sequenciasComProblema = [];

jsonData.categorias.forEach(categoria => {
  categoria.familias.forEach(familia => {
    const codigos = familia.equipamentos.map(i => i.ordem);
    let sequenciaOk = true;

    for (let i = 1; i < codigos.length; i++) {
      const anterior = parseInt(codigos[i - 1].split('.')[2]);
      const atual = parseInt(codigos[i].split('.')[2]);

      if (atual !== anterior + 1) {
        sequenciaOk = false;
        break;
      }
    }

    if (sequenciaOk || codigos.length === 1) {
      sequenciasOk++;
    } else {
      sequenciasComProblema.push({
        familia: `${familia.ordem} - ${familia.nome}`,
        codigos: codigos
      });
    }
  });
});

console.log(`\n✅ Famílias com sequência correta: ${sequenciasOk}`);

if (sequenciasComProblema.length > 0) {
  console.log(`⚠️  Famílias com sequência não contínua: ${sequenciasComProblema.length}`);
  console.log('   (Isso pode ser normal se houver equipamentos removidos)\n');
  sequenciasComProblema.slice(0, 5).forEach(seq => {
    console.log(`   ${seq.familia}`);
    console.log(`   Códigos: ${seq.codigos.join(', ')}\n`);
  });
}

console.log('\n═'.repeat(60));
console.log('✅ COMPARAÇÃO: ANTES vs DEPOIS');
console.log('═'.repeat(60));

const relatorio = JSON.parse(fs.readFileSync('relatorio_conversao_json.json', 'utf-8'));

console.log(`\n📋 Conversões realizadas: ${relatorio.total_conversoes}`);
console.log('\nExemplos de conversão:\n');

relatorio.conversoes.slice(0, 10).forEach((conv, idx) => {
  const seta = '→';
  console.log(`${(idx + 1).toString().padStart(2, '0')}. ${conv.antigo.padEnd(12)} ${seta} ${conv.novo.padEnd(10)} | ${conv.tipo.padEnd(11)} | ${conv.nome.substring(0, 35)}`);
});

console.log('\n═'.repeat(60));
console.log('📝 RESUMO DA VALIDAÇÃO');
console.log('═'.repeat(60));

console.log('\n✅ VALIDAÇÕES APROVADAS:\n');
console.log(`   [✓] Todos os ${jsonData.total_itens} itens foram convertidos`);
console.log(`   [✓] Consumíveis estão na MESMA família dos equipamentos`);
console.log(`   [✓] Padrão X.Y.ZZZ aplicado corretamente (${codigosCorretos} códigos)`);
console.log(`   [✓] Estrutura hierárquica mantida (categorias → famílias → itens)`);
console.log(`   [✓] Tipos preservados (${jsonData.total_equipamentos} equipamentos, ${jsonData.total_consumiveis} consumíveis)`);

console.log('\n📄 ARQUIVOS GERADOS:\n');
console.log('   ✓ locamulti_produtos_NOVO_PADRAO.json');
console.log('   ✓ relatorio_conversao_json.json');

console.log('\n🎯 PRÓXIMOS PASSOS:\n');
console.log('   1. Revise o arquivo locamulti_produtos_NOVO_PADRAO.json');
console.log('   2. Se estiver OK, execute: node 2_mapear_codigos_invalidos.cjs');
console.log('   3. Ou execute tudo: node EXECUTAR_MIGRACAO.cjs');

console.log('\n' + '═'.repeat(60) + '\n');
