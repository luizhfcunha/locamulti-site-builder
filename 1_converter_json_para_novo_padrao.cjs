const fs = require('fs');

/**
 * SCRIPT 1: Converter JSON para o novo padrão X.Y.001
 *
 * Conversões:
 * - X.Y.2001 → X.Y.001
 * - X.Y.2002 → X.Y.002
 * - X.Y.1 → X.Y.001 (casos especiais)
 * - X.Y.10 → X.Y.010
 */

console.log('========================================');
console.log('CONVERSÃO JSON - PADRÃO X.Y.001');
console.log('========================================\n');

// Lê o JSON original
const jsonData = JSON.parse(fs.readFileSync('locamulti_produtos.json', 'utf-8'));

// Função para converter código para o novo padrão
function convertCode(oldCode) {
  const parts = oldCode.split('.');

  if (parts.length === 3) {
    const categoria = parts[0];
    const familia = parts[1];
    let item = parts[2];

    // Remove o "2000" se existir (2001 → 001)
    if (item.startsWith('200') && item.length === 4) {
      item = item.substring(1); // 2001 → 001
    }
    // Se o número é menor que 100, adiciona zeros à esquerda
    else {
      item = item.padStart(3, '0'); // 1 → 001, 10 → 010
    }

    return `${categoria}.${familia}.${item}`;
  }

  return oldCode; // Retorna sem modificação se não for o padrão esperado
}

// Contador de conversões
let totalConversoes = 0;
const conversoes = [];

// Processa o JSON
jsonData.categorias.forEach(categoria => {
  categoria.familias.forEach(familia => {
    familia.equipamentos.forEach(item => {
      const oldCode = item.ordem;
      const newCode = convertCode(oldCode);

      if (oldCode !== newCode) {
        conversoes.push({
          antigo: oldCode,
          novo: newCode,
          nome: item.nome,
          tipo: item.tipo
        });
        totalConversoes++;
      }

      // Atualiza o código
      item.ordem = newCode;
    });
  });
});

console.log(`✅ Total de códigos convertidos: ${totalConversoes}\n`);

// Mostra primeiras 20 conversões
console.log('Primeiras 20 conversões:');
conversoes.slice(0, 20).forEach((conv, idx) => {
  console.log(`${(idx + 1).toString().padStart(3, '0')}. ${conv.antigo.padEnd(12)} → ${conv.novo.padEnd(12)} | ${conv.tipo.padEnd(11)} | ${conv.nome.substring(0, 40)}`);
});

if (conversoes.length > 20) {
  console.log(`... e mais ${conversoes.length - 20} conversões\n`);
}

// Salva o JSON convertido
const newJsonPath = 'locamulti_produtos_NOVO_PADRAO.json';
fs.writeFileSync(newJsonPath, JSON.stringify(jsonData, null, 2));
console.log(`\n✅ JSON convertido salvo em: ${newJsonPath}`);

// Salva relatório de conversões
const reportPath = 'relatorio_conversao_json.json';
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  total_conversoes: totalConversoes,
  conversoes: conversoes
}, null, 2));
console.log(`✅ Relatório de conversões salvo em: ${reportPath}`);

console.log('\n========================================');
console.log('PRÓXIMO PASSO:');
console.log('Execute: node 2_mapear_codigos_invalidos.cjs');
console.log('========================================\n');
