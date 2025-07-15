# Parte 1 - Coleta de Processos TJRJ

Esta aplicação Node.js com TypeScript coleta processos do site do TJRJ e os envia para uma fila RabbitMQ.

## Funcionalidades

- Web scraping do site do TJRJ usando Puppeteer
- Coleta de 10 processos com filtros específicos:
  - Origem: 1 Instância
  - Comarca/Regional: Todas as Comarcas
  - Competência: Cível
  - Nome da Parte: Eduardo
- Persistência dos dados em PostgreSQL
- Envio de mensagens para fila RabbitMQ

## Estrutura do Projeto

```
parte1-node/
├── src/
│   ├── index.ts              # Arquivo principal
│   ├── types/
│   │   └── Processo.ts       # Interfaces TypeScript
│   └── services/
│       ├── TJRJScraper.ts    # Web scraping
│       ├── DatabaseService.ts # PostgreSQL
│       └── RabbitMQService.ts # RabbitMQ
├── package.json
├── tsconfig.json
├── Dockerfile
└── env.example
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- RabbitMQ
- Docker (opcional)

## Instalação

1. Instalar dependências:

```bash
npm install
```

2. Configurar variáveis de ambiente:

```bash
cp env.example .env
# Editar .env com suas configurações
```

3. Compilar TypeScript:

```bash
npm run build
```

## Execução

### Local

```bash
npm run dev
```

### Com Docker

```bash
docker build -t parte1-node .
docker run --env-file .env parte1-node
```

### Com Docker Compose (recomendado)

```bash
docker-compose up parte1-node
```

## Configuração dos Filtros

Os filtros são configurados automaticamente no arquivo `TJRJScraper.ts`:

- **Origem**: 1 Instância
- **Comarca/Regional**: Todas as Comarcas
- **Competência**: Cível
- **Nome da Parte**: Eduardo

## Estrutura da Mensagem

A mensagem enviada para o RabbitMQ contém:

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

## Logs

A aplicação gera logs detalhados de cada etapa:

- Inicialização dos serviços
- Coleta de processos
- Persistência no banco
- Envio para RabbitMQ

## Tratamento de Erros

- Timeout de 30 segundos para carregamento de páginas
- Retry automático em caso de falha de conexão
- Logs detalhados para debugging
