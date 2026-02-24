# Story: MIG-001 - Kickoff da Migracao Opcao 2 (Vercel + Hostinger API + Supabase)

## Status
Draft

## Contexto
Migrar da operacao atual vinculada ao Lovable para uma arquitetura com frontend em Vercel e backend custom na Hostinger, mantendo Supabase para Auth/DB/Storage.

## Objetivo
Definir baseline tecnico, plano executavel e criterios de aceite para iniciar migracao segura sem regressao do admin/catalogo.

## Escopo (IN)
- Definir arquitetura alvo e limites de responsabilidade (Vercel/Hostinger/Supabase)
- Definir backlog inicial da migracao
- Definir riscos, mitigacoes e plano de rollback
- Definir checklist de homologacao e go-live

## Escopo (OUT)
- Implementacao de endpoints
- Alteracoes de codigo no frontend
- Mudancas de DNS em producao

## Acceptance Criteria
1. Documento de plano com fases e entregaveis aprovado
2. Riscos criticos com mitigacao e dono definidos
3. Cutover e rollback definidos por endpoint
4. Primeira wave de execucao pronta (Infra/API base)

## Entregaveis
- Plano de migracao por fases
- Matriz de risco
- Checklist de homologacao
- Sequencia de execucao das stories tecnicas

## Checklist
- [x] Arquitetura alvo definida
- [x] Workflow recomendado definido
- [x] Squad recomendado definido
- [x] Plano macro 30 dias definido
- [ ] Backlog tecnico detalhado por story criado
- [ ] Story de implementacao da API base criada
- [ ] Story de migracao do endpoint de contato criada
- [ ] Story de migracao do endpoint de upload criada
- [ ] Story de integracao frontend com feature flag criada
- [ ] Story de homologacao/cutover criada

## Riscos iniciais
- CORS/Auth quebrar entre Vercel e API Hostinger
- Exposicao indevida de service role key
- Regressao no upload em lote
- Rollback lento sem flag de fallback

## Plano de rollback (alto nivel)
- Toggle para voltar chamadas do frontend para `supabase.functions.invoke`
- Reversao por endpoint (contact e upload) sem alterar DNS

## File List
- docs/stories/MIG-001-kickoff-opcao-2.md

## Proximos passos
1. Criar stories MIG-002..MIG-006 para cada fase tecnica
2. Iniciar MIG-002 (Infra/API base)
