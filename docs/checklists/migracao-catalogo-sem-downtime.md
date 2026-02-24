# Checklist: Migracao de Catalogo Sem Downtime

## Objetivo
Executar evolucao estrutural do catalogo (categorias/familias/codigos/ordenacao) sem indisponibilidade e sem quebrar vinculos de imagens.

## Pre-Migracao
- [ ] Confirmar backup logico do banco (schema + dados)
- [ ] Exportar snapshot de `catalog_items` e tabelas de imagens vinculadas
- [ ] Validar volume de dados e tempo estimado de migracao
- [ ] Definir janela de deploy e plano de rollback
- [ ] Validar que o frontend atual funciona com schema vigente

## Migracao de Banco (Aditiva)
- [ ] Criar novas tabelas (`catalog_categories`, `catalog_families`) sem remover legado
- [ ] Criar indices e constraints (unicidade, FKs, ordens)
- [ ] Criar policies RLS para leitura publica e escrita admin
- [ ] Criar funcoes de suporte (reindexacao/geracao de codigo) com transacao
- [ ] Aplicar backfill inicial a partir de `catalog_items`

## Compatibilidade
- [ ] Garantir que `catalog_items.id` permaneceu inalterado
- [ ] Garantir que vinculos de imagens por `equipment_id` permaneceram validos
- [ ] Garantir que `code` antigo continua legivel ate virar auto-gerado
- [ ] Garantir fallback no frontend durante fase de transicao

## Validacao Tecnica
- [ ] Criar categoria/familia no admin e validar persistencia
- [ ] Criar item no admin e validar codigo automatico unico
- [ ] Excluir item/familia e validar reindexacao de ordens
- [ ] Validar ordenacao publica (`category_order`, `family_order`, `item_order`)
- [ ] Validar busca/filtros por categoria e familia
- [ ] Validar que nenhuma imagem perdeu vinculo

## Rollback
- [ ] Script de rollback testado em homologacao
- [ ] Procedimento de retorno para leitura no modelo legado validado
- [ ] Tempo maximo de rollback definido e comunicado

## Pos-Deploy
- [ ] Monitorar erros no admin e no catalogo publico por 24h
- [ ] Conferir contagem de itens/categorias/familias pre vs pos
- [ ] Confirmar com negocio a ordem final no catalogo publico
- [ ] Encerrar migracao somente apos validacao funcional completa

