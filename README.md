# Desafio Elaw - Sistema de Coleta e Processamento de Processos TJRJ

Este projeto implementa um sistema completo de coleta de processos do TJRJ com duas aplicações: uma em Node.js/TypeScript para coleta e outra em C# para processamento.

## Arquitetura

O sistema é composto por:

- **Parte 1 (Node.js/TypeScript)**: Coleta processos do TJRJ e envia para RabbitMQ
- **Parte 2 (C#)**: Worker que consome mensagens do RabbitMQ e salva em banco separado
- **PostgreSQL**: Dois bancos separados (um para cada parte)
- **RabbitMQ**: Sistema de mensageria entre as aplicações
- **Docker**: Orquestração completa com docker-compose

## Estrutura do Projeto

```
DesafioElaw/
├── docker-compose.yml          # Orquestração Docker
├── parte1-node/                # Aplicação Node.js/TypeScript
│   ├── src/
│   │   ├── index.ts           # Arquivo principal
│   │   ├── types/
│   │   │   └── Processo.ts    # Interfaces
│   │   └── services/
│   │       ├── TJRJScraper.ts # Web scraping
│   │       ├── DatabaseService.ts # PostgreSQL
│   │       └── RabbitMQService.ts # RabbitMQ
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── README.md
├── parte2-csharp/              # Aplicação C# (a ser implementada)
│   ├── Worker.cs
│   ├── Processo.cs
│   ├── Program.cs
│   ├── parte2-csharp.csproj
│   └── Dockerfile
└── README.md
```

## Serviços Docker

- **postgres-parte1**: Banco para a aplicação Node.js (porta 5432)
- **postgres-parte2**: Banco para a aplicação C# (porta 5433)
- **rabbitmq**: Sistema de mensageria (porta 5672, admin 15672)
- **parte1-node**: Aplicação de coleta
- **parte2-csharp**: Worker de processamento

## Execução

### Pré-requisitos

- Docker e Docker Compose instalados

### Executar tudo

```bash
docker-compose up -d
```

### Executar apenas infraestrutura

```bash
docker-compose up -d postgres-parte1 postgres-parte2 rabbitmq
```

### Executar apenas Parte 1

```bash
docker-compose up parte1-node
```

### Executar apenas Parte 2

```bash
docker-compose up parte2-csharp
```

## Acessos

- **RabbitMQ Management**: http://localhost:15672 (admin/admin)
- **PostgreSQL Parte 1**: localhost:5432
- **PostgreSQL Parte 2**: localhost:5433

## Funcionalidades

### Parte 1 - Coleta (Node.js/TypeScript)

- Web scraping do TJRJ com Puppeteer
- Filtros configurados:
  - Origem: 1 Instância
  - Comarca/Regional: Todas as Comarcas
  - Competência: Cível
  - Nome da Parte: Eduardo
- Coleta dos primeiros 10 processos
- Persistência em PostgreSQL
- Envio para fila RabbitMQ "novos_processos"

### Parte 2 - Processamento (C#)

- Worker que consome mensagens da fila
- Persistência em banco PostgreSQL separado
- Processamento assíncrono

## Estrutura da Mensagem

```json
{
  "Id": "uuid",
  "NumeroProcesso": "string",
  "Origem": "string",
  "Comarca_Regional": "string",
  "Competencia": "string",
  "NomeParte": "string",
  "CriadoEm": "datetime"
}
```

## Desenvolvimento

### Parte 1 (Node.js)

```bash
cd parte1-node
npm install
npm run dev
```

### Parte 2 (C#)

```bash
cd parte2-csharp
dotnet run
```

## Logs

Cada aplicação gera logs detalhados:

- Inicialização de serviços
- Coleta de dados
- Persistência
- Comunicação RabbitMQ
- Tratamento de erros

## Próximos Passos

1. Implementar a Parte 2 em C#
2. Adicionar testes automatizados
3. Implementar monitoramento
4. Adicionar retry policies
5. Implementar health checks
