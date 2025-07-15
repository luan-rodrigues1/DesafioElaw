import dotenv from 'dotenv';
import { TJRJApiService } from './services/TJRJApiService';
import { DatabaseService } from './services/DatabaseService';
import { RabbitMQService } from './services/RabbitMQService';

dotenv.config();

async function main() {
  console.log('Iniciando coleta de processos do TJRJ');

  const apiService = new TJRJApiService();
  const database = new DatabaseService();
  const rabbitMQ = new RabbitMQService();

  await database.init();
  await rabbitMQ.init();

  const processos = await apiService.fetchProcessos();

  if (processos.length === 0) {
    await database.saveProcessos([]);
    await rabbitMQ.close();
    return;
  }

  await database.saveProcessos(processos);
  await rabbitMQ.sendProcessos(processos);

  await rabbitMQ.close();
  console.log('Processo concluído com sucesso!');
}

main().catch((error) => {
  console.error('Erro durante a execução:', error);
  process.exit(1);
}); 