# Desafio Elaw - Sistema de Coleta e Processamento de Processos TJRJ

[➡️ Ir para Instruções](#-como-executar)  
[➡️ Ir para Decisões Técnicas](#decisões-técnicas)

Este projeto implementa um sistema completo de coleta de processos do TJRJ com duas aplicações: uma em Node.js/TypeScript para coleta e outra em C# para processamento.

## 🏗️ Arquitetura

O sistema é composto por:

- **Parte 1 (Node.js/TypeScript)**: Coleta processos do TJRJ e envia para RabbitMQ
- **Parte 2 (C#)**: Worker que consome mensagens do RabbitMQ e salva em banco separado
- **PostgreSQL**: Dois bancos separados (um para cada parte)
- **RabbitMQ**: Sistema de mensageria entre as aplicações
- **Docker**: Orquestração completa com docker-compose

## 📋 Pré-requisitos

- **Docker** instalado e funcionando
- **Docker Compose** instalado e funcionando
- Conexão com internet (para coleta de dados do TJRJ)

## 🚀 Como Executar

### **1. Executar tudo de uma vez (Recomendado)**

```bash
docker-compose up
```

Este comando vai:

- Subir todos os serviços (PostgreSQL, RabbitMQ, Parte 1 e Parte 2)
- Executar automaticamente a coleta de dados (Parte 1)
- Iniciar o worker C# para processar as mensagens (Parte 2)

### **2. Executar em background**

```bash
docker-compose up -d
```

### **3. Ver logs em tempo real**

```bash
docker-compose up --follow
```

### **4. Ver logs de serviços específicos**

```bash
# Logs da Parte 1 (Node.js)
docker-compose logs parte1-node

# Logs da Parte 2 (C#)
docker-compose logs parte2-csharp

# Logs do RabbitMQ
docker-compose logs rabbitmq
```

## 🔍 Verificar Resultados

### **Verificar dados salvos nos bancos:**

```bash
# Verificar dados na Parte 1 (Node.js)
docker-compose exec postgres-parte1 psql -U postgres -d processos_tjrj -c "SELECT COUNT(*) FROM processos;"

# Verificar dados na Parte 2 (C#)
docker-compose exec postgres-parte2 psql -U postgres -d processos_worker -c "SELECT COUNT(*) FROM processos_worker;"
```

### **Ver detalhes dos processos:**

```bash
# Ver processos da Parte 1
docker-compose exec postgres-parte1 psql -U postgres -d processos_tjrj -c "SELECT numero_processo, nome_parte, criado_em FROM processos LIMIT 5;"

# Ver processos da Parte 2
docker-compose exec postgres-parte2 psql -U postgres -d processos_worker -c "SELECT numero_processo, nome_parte, criado_em FROM processos_worker LIMIT 5;"
```

## 🌐 Acessos

- **RabbitMQ Management**: http://localhost:15672
  - Usuário: `admin`
  - Senha: `admin`
- **PostgreSQL Parte 1**: localhost:5432
  - Database: `processos_tjrj`
  - Usuário: `postgres`
  - Senha: `postgres`
- **PostgreSQL Parte 2**: localhost:5433
  - Database: `processos_worker`
  - Usuário: `postgres`
  - Senha: `postgres`

## 📊 O que acontece durante a execução

1. **Inicialização dos serviços**:

   - PostgreSQL parte 1 e parte 2 iniciam
   - RabbitMQ inicia
   - Health checks garantem que os serviços estejam prontos

2. **Parte 1 (Node.js) executa automaticamente**:

   - Coleta 10 processos do TJRJ
   - Salva no banco `processos_tjrj`
   - Envia mensagens para a fila RabbitMQ `new_processes`
   - Para após concluir (graças ao `docker-compose.override.yml`)

3. **Parte 2 (C#) processa as mensagens**:
   - Consome mensagens da fila RabbitMQ
   - Salva os dados no banco `processos_worker`
   - Fica aguardando novas mensagens

## 🛑 Comandos de Controle

### **Parar todos os serviços:**

```bash
docker-compose down
```

### **Parar e remover volumes (dados):**

```bash
docker-compose down -v
```

### **Reconstruir containers:**

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## 📁 Estrutura do Projeto

```
DesafioElaw/
├── docker-compose.yml          # Orquestração Docker
├── docker-compose.override.yml # Configurações específicas
├── parte1-node/                # Aplicação Node.js/TypeScript
│   ├── src/
│   │   ├── index.ts           # Arquivo principal
│   │   ├── types/
│   │   │   └── Process.ts     # Interfaces
│   │   └── services/
│   │       ├── TJRJApiService.ts # Web scraping
│   │       ├── DatabaseService.ts # PostgreSQL
│   │       └── RabbitMQService.ts # RabbitMQ
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── env.example
├── parte2-csharp/              # Aplicação C#
│   ├── Worker.cs
│   ├── Processo.cs
│   ├── Program.cs
│   ├── parte2-csharp.csproj
│   ├── appsettings.json
│   └── Dockerfile
└── README.md
```

## 🔧 Serviços Docker

- **postgres-parte1**: Banco para a aplicação Node.js (porta 5432)
- **postgres-parte2**: Banco para a aplicação C# (porta 5433)
- **rabbitmq**: Sistema de mensageria (porta 5672, admin 15672)
- **parte1-node**: Aplicação de coleta (executa automaticamente)
- **parte2-csharp**: Worker de processamento (aguarda mensagens)

## ⚠️ Observações Importantes

### **Variáveis de Ambiente**

- No Docker, as variáveis são injetadas pelo `docker-compose.yml`
- Não é necessário arquivo `.env` para execução Docker
- Para desenvolvimento local, copie `env.example` para `.env`

### **Portas Utilizadas**

- **5432**: PostgreSQL Parte 1
- **5433**: PostgreSQL Parte 2
- **5672**: RabbitMQ
- **15672**: RabbitMQ Management

### **Persistência de Dados**

- Os dados são persistidos em volumes Docker
- Para limpar dados: `docker-compose down -v`

### **Logs e Debugging**

- Use `docker-compose logs -f` para ver logs em tempo real
- Cada serviço tem logs específicos para facilitar debugging

## 🎯 Funcionalidades

### Parte 1 - Coleta (Node.js/TypeScript)

- Web scraping do TJRJ com Puppeteer
- Filtros configurados:
  - Origem: 1 Instância
  - Comarca/Regional: Todas as Comarcas
  - Competência: Cível
  - Nome da Parte: Eduardo
- Coleta dos primeiros 10 processos
- Persistência em PostgreSQL
- Envio para fila RabbitMQ "new_processes"

### Parte 2 - Processamento (C#)

- Worker que consome mensagens da fila
- Persistência em banco PostgreSQL separado
- Processamento assíncrono
- Retry automático em caso de falhas

## 📈 Resultado Esperado

Após executar `docker-compose up`, você deve ver:

- **10 processos** salvos no banco `processos_tjrj` (Parte 1)
- **10 processos** processados e salvos no banco `processos_worker` (Parte 2)
- Logs confirmando o sucesso da operação

## 🚨 Troubleshooting

### **Erro de conexão com banco**

```bash
docker-compose down
docker-compose up
```

### **Erro de conexão com RabbitMQ**

- Aguarde alguns segundos para o RabbitMQ inicializar
- Verifique logs: `docker-compose logs rabbitmq`

### **Dados não aparecem**

- Verifique se a Parte 1 executou: `docker-compose logs parte1-node`
- Verifique se a Parte 2 processou: `docker-compose logs parte2-csharp`

---

**🎉 O sistema demonstra comunicação assíncrona entre aplicações via RabbitMQ com persistência em bancos separados!**

---

## Decisões Técnicas

### 1ª Parte - Feita com Node.js e TypeScript

Optei por desenvolver a primeira parte utilizando Node.js com TypeScript, linguagem com a qual tenho mais familiaridade. Analisei que essa etapa poderia demandar mais esforço técnico, então decidi executá-la com uma stack que domino bem. Inicialmente, tentei realizar o processo via web scraping utilizando a biblioteca Puppeteer, o que funcionou parcialmente, mas percebi que o site do Tribunal de Justiça implementa algumas medidas para mitigar esse tipo de acesso. Ao inspecionar o network do site, notei que era possível realizar requisições diretas à API utilizada pelo front-end.
Essa abordagem simplificou bastante o código, mas me deparei com um problema: em determinados horários, a API exige um token de verificação. Para lidar com isso de forma prática e manter o fluxo funcional, implementei uma verificação que, ao detectar essa exigência, utiliza um mock com dados reais previamente coletados. O sistema também registra em logs quando essa alternativa foi acionada. Reconheço que essa é uma solução improvisada, com mais tempo, estudaria uma forma mais robusta de contornar o uso do token, evitando o uso de mocks.

### 2ª Parte - Feita com C#

A segunda etapa, que consistia em consumir os dados armazenados via fila RabbitMQ, me pareceu mais simples tecnicamente. Tenho conhecimentos básicos de C# e, embora nunca tenha utilizado RabbitMQ antes, já trabalhei com mensageria no Google Cloud Platform usando Pub/Sub. A estrutura que adotei seguiu um padrão semelhante ao da primeira parte, com arquivos de serviço separados para lidar com a conexão ao RabbitMQ e ao banco de dados, em ambas as parte utilizei o banco postgreSQL escolhi por ser um banco que estou acostumado de usar em projetos e por já ter utilizado ele com o docker antes

### 3ª Parte - Orquestração com Docker

Tenho alguma experiência com Docker, principalmente em ajustes de arquivos existentes, como DockerFile e docker-compose, e no uso em pipelines de CI/CD com GitHub Actions. Neste desafio, me propus a montar do zero a orquestração dos serviços. O maior desafio foi garantir a ordem correta de inicialização dos containers, especialmente a conexão com o RabbitMQ e os bancos de dados. Para isso, implementei uma lógica de tentativas com retentativas em loop, o que resolveu o problema de forma funcional. Ainda assim, considero esse ponto como uma oportunidade de melhoria, buscando formas mais elegantes e resilientes de garantir a orquestração sem soluções improvisadas.
