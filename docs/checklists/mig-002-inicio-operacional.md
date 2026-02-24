# Checklist Operacional - Inicio da Migracao (MIG-002)

## Como usar este checklist
- Marque cada item somente quando a validacao do item estiver concluida.
- Se um item bloquear, registre em "Observacoes" no fim do arquivo.
- Objetivo desta fase: criar a base da API (sem migrar contato/upload ainda).

## 1) Preparacao
- [ ] Confirmar que a fase atual e a MIG-002 (Infra/API Base).
  - Acao: validar na story `docs/stories/MIG-002-infra-api-base-hostinger.md`.
  - Validacao: status e objetivo da story estao claros para a equipe.

- [ ] Confirmar acesso aos paineis necessarios.
  - Acao: testar login no Hostinger (staging) e Supabase.
  - Validacao: acessos funcionando sem erro.

- [ ] Definir stack do backend.
  - Acao: registrar decisao (recomendado: Node.js + Fastify).
  - Validacao: decisao registrada na story MIG-002.

- [ ] Definir dominios permitidos em CORS.
  - Acao: listar dominios de producao e staging autorizados.
  - Validacao: lista final aprovada (sem usar `*`).

## 2) Implementacao da API base
- [ ] Criar estrutura `backend/`.
  - Acao: iniciar projeto backend com Node.
  - Validacao: projeto inicia localmente sem erro.

- [ ] Criar endpoint `GET /health`.
  - Acao: adicionar rota de saude.
  - Validacao: retorna HTTP 200.

- [ ] Criar endpoint `GET /ready`.
  - Acao: adicionar rota de prontidao.
  - Validacao: retorna HTTP 200 quando app estiver pronto.

- [ ] Configurar CORS restrito.
  - Acao: permitir somente dominios aprovados.
  - Validacao: dominio permitido funciona; dominio nao permitido bloqueia.

- [ ] Configurar logs com `request-id`.
  - Acao: registrar request-id em logs de sucesso e erro.
  - Validacao: cada requisicao aparece com request-id nos logs.

- [ ] Configurar variaveis de ambiente no Hostinger (staging).
  - Acao: cadastrar secrets necessarios.
  - Validacao: deploy sobe sem erro de variavel ausente.

- [ ] Publicar API em staging.
  - Acao: fazer deploy do backend base.
  - Validacao: URL de staging responde `/health` e `/ready`.

## 3) Validacao final da MIG-002
- [ ] Testar `/health` em staging.
  - Resultado esperado: HTTP 200.

- [ ] Testar `/ready` em staging.
  - Resultado esperado: HTTP 200.

- [ ] Testar CORS com origem valida e invalida.
  - Resultado esperado: origem valida permitida; invalida bloqueada.

- [ ] Confirmar logs com request-id.
  - Resultado esperado: rastreabilidade completa de 2 a 3 chamadas.

- [ ] Atualizar story MIG-002.
  - Acao: marcar tasks concluidas e atualizar File List.
  - Validacao: story pronta para iniciar MIG-003.

## 4) Hand-off para proxima fase
- [ ] Registrar pendencias conhecidas da MIG-002.
- [ ] Confirmar criterio de entrada da MIG-003 (endpoint de contato).

## Evidencias
- Responsavel:
- Data:
- Ambiente:
- URL staging da API:
- Resultado geral: [ ] Aprovado [ ] Reprovado
- Observacoes:
