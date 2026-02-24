# Backend Scaffold (MIG-002)

API base para migracao Hostinger com Fastify.

## Requisitos
- Node.js 20+

## Setup local
1. Copie `.env.example` para `.env` (opcional para dev inicial).
2. Instale dependencias:
   - `npm install`
3. Rode em dev:
   - `npm run dev`

## Endpoints
- `GET /health`
- `GET /ready`

## Variaveis de ambiente
- `PORT` (default: `3001`)
- `HOST` (default: `0.0.0.0`)
- `CORS_ORIGINS` (csv)
