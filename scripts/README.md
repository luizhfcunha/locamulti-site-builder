# Scripts de Importação - LocaMulti

## Upload em Massa de Imagens

### Pré-requisitos

1. **Node.js** instalado (versão 14 ou superior)
2. **Credenciais de admin** do sistema

### Instalação

```bash
cd scripts
npm install @supabase/supabase-js form-data node-fetch
```

### Configuração

1. Edite o arquivo `upload-images.js`
2. Configure suas credenciais:
   ```javascript
   const ADMIN_EMAIL = 'seu-email@locamulti.com.br';
   const ADMIN_PASSWORD = 'sua-senha';
   ```
3. Configure o diretório das imagens:
   ```javascript
   const IMAGES_DIR = './imagens'; // Pasta com suas imagens
   ```

### Estrutura de Diretórios

```
scripts/
├── upload-images.js
├── README.md
└── imagens/           # Coloque suas imagens aqui
    ├── produto1.jpg
    ├── produto2.png
    └── ...
```

### Uso

#### Opção 1: Upload sem associação automática

Se você só quer fazer upload das imagens e depois associá-las manualmente pelo admin:

```bash
node upload-images.js
```

As imagens serão enviadas e você receberá as URLs, mas não serão associadas automaticamente aos produtos.

#### Opção 2: Upload com associação automática

Se você quer associar automaticamente as imagens aos produtos, configure o mapeamento:

```javascript
const FILE_TO_PRODUCT_MAP = {
  'martelete-bosch.jpg': 'abc123-def456-789...',  // UUID do produto
  'furadeira-dewalt.png': '123abc-456def-789...',
  // ... mais mapeamentos
};
```

Para obter os UUIDs dos produtos:
1. Acesse o admin: https://admin.locamulti.com
2. Vá em "Produtos"
3. Copie o ID do produto desejado

Depois execute:
```bash
node upload-images.js
```

### Resultado Esperado

```
🔐 Fazendo login...
✅ Login realizado com sucesso!
📁 Encontradas 15 imagens em ./imagens
📤 Iniciando upload de 15 imagens...

📊 Resultado do upload:
Upload complete: 15 success, 0 failed

✅ 15 imagens enviadas com sucesso:
   - martelete-bosch.jpg -> https://...
   - furadeira-dewalt.png -> https://...
   ...

📝 Produtos atualizados: 15
⏭️  Produtos pulados: 0

🎉 Processo concluído!
```

### Formato de Arquivos Suportados

- **Tipos**: JPG, JPEG, PNG, WebP
- **Tamanho máximo**: 10MB por arquivo
- **Limite**: Sem limite de quantidade por upload

### Segurança

⚠️ **IMPORTANTE**: 
- **NUNCA** commite o arquivo `upload-images.js` com suas credenciais reais
- Considere usar variáveis de ambiente para credenciais
- Mantenha suas senhas seguras

### Solução de Problemas

#### Erro: "Login failed"
- Verifique suas credenciais (email e senha)
- Certifique-se de que sua conta tem role de admin

#### Erro: "Admin access required"
- Sua conta precisa ter a role 'admin' no sistema
- Entre em contato com o administrador principal

#### Erro: "No files provided"
- Verifique se o diretório `IMAGES_DIR` existe
- Certifique-se de que há imagens com extensão válida (jpg, jpeg, png, webp)

#### Erro: "File too large"
- A imagem excede 10MB
- Comprima a imagem antes de fazer upload

### Alternativa: Upload Manual pelo Admin

Se preferir não usar scripts, você pode usar a interface web:

1. Acesse: https://admin.locamulti.com
2. Vá em "Produtos"
3. Edite o produto desejado
4. Faça upload da imagem no formulário

---

## Suporte

Para dúvidas ou problemas, consulte a documentação da Edge Function em:
`supabase/functions/upload-images/index.ts`
