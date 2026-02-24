# Story: MIG-003 - Migrar endpoint de contato para Hostinger

## Status
In Progress

## Objetivo
Substituir `supabase/functions/send-contact-email` por `POST /contact/send` na API Hostinger.

## Acceptance Criteria
1. Envio SMTP funcional com credenciais seguras
2. Validacao de payload equivalente ao atual
3. Resposta padrao de sucesso/erro definida
4. Logs de auditoria para falhas de envio

## Tasks
- [x] Implementar rota `POST /contact/send`
- [x] Validar campos obrigatorios
- [x] Integrar SMTP Hostinger (via env vars)
- [x] Cobrir casos de erro e timeout

## File List
- backend/package.json
- backend/.env.example
- backend/src/config.js
- backend/src/server.js
- backend/src/routes/contact.js
- docs/stories/MIG-003-endpoint-contato-hostinger.md
