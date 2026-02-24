# Story: MIG-002 - Infra/API Base na Hostinger

## Status
In Progress

## Objetivo
Subir API base em Hostinger com observabilidade minima, CORS e health checks.

## Acceptance Criteria
1. API responde `GET /health` e `GET /ready` com 200
2. CORS permite apenas `https://locamulti.com`, `https://admin.locamulti.com` e `https://locamulti.com.br`
3. Logs estruturados com request-id ativos
4. Secrets configurados no ambiente Hostinger

## Tasks
- [x] Definir runtime (Node LTS) e framework HTTP
- [x] Criar bootstrap da API
- [x] Configurar middlewares (CORS, logger, error handler)
- [x] Configurar variaveis de ambiente (template local)
- [ ] Publicar ambiente staging

## File List
- backend/package.json
- backend/.env.example
- backend/README.md
- backend/src/config.js
- backend/src/index.js
- backend/src/server.js
- docs/checklists/mig-002-inicio-operacional.md
- docs/stories/MIG-002-infra-api-base-hostinger.md
