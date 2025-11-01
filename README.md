<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

# NestJS Scheduling API

Uma API construída com **NestJS** para criar, listar, atualizar e executar **schedules** automáticos de tarefas. Suporta:

- CRON schedules (expressões como `*/5 * * * * *`)
- Horários customizados (datas específicas)
- Listagem de todos, ativos ou próximos schedules
- Atualização e remoção de schedules

---

## Features

- Criação de schedules com **payload JSON**.
- Execução automática de CRONs em background.
- Próximos horários calculados para cada schedule.
- Suporte para múltiplos schedules rodando simultaneamente.
- Integração Swagger pronta para testes de endpoints.

---

## Exemplo de Payload

### CRON Schedule

```json
{
  "name": "Backup diário",
  "type": "cron",
  "cronExpression": "*/5 * * * * *",
  "customTimes": [],
  "task": "Enviar e-mail de backup"
}
```

## Horários Customizados

```json
{
  "name": "Envio de relatórios",
  "type": "custom",
  "customTimes": ["2025-11-01T14:00:00Z", "2025-11-01T18:00:00Z"],
  "task": "Enviar relatório diário"
}
```

## Endpoints Principais

| Endpoint             | Método | Descrição                                |
| -------------------- | ------ | ---------------------------------------- |
| `/schedules`         | GET    | Listar todos os schedules                |
| `/schedules/active`  | GET    | Listar schedules ativos                  |
| `/schedules/running` | GET    | Listar schedules em execução ou próximos |
| `/schedules/:id`     | GET    | Buscar schedule por ID                   |
| `/schedules`         | POST   | Criar um schedule                        |
| `/schedules/:id`     | PATCH  | Atualizar schedule                       |
| `/schedules/:id`     | DELETE | Remover schedule                         |

## Instalação

```bash
npm install
```

## Rodando o Projeto

```bash
# Desenvolvimento
 npm run start:dev

# Produção
 npm run start:prod
```

## Observações

- Todos os CRONs rodam na mesma thread do Node.js.
- Para tarefas pesadas, considere usar worker_threads ou filas (Bull/BullMQ).