import { Processo } from '../types/Process';
import * as amqp from 'amqplib';

export class RabbitMQService {
  private readonly queueName = 'new_processes';
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  async init(): Promise<void> {
    const maxRetries = 5;
    const retryDelayMs = 2000;
    let attempt = 0;
    let lastError: any = null;
    while (attempt < maxRetries) {
      try {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL || "");
        if (!this.connection) throw new Error('Failed to connect to RabbitMQ');
        this.channel = await this.connection.createChannel();
        if (!this.channel) throw new Error('Failed to create RabbitMQ channel');
        await this.channel.assertQueue(this.queueName, { durable: true });
        console.info('Conexão com RabbitMQ estabelecida');
        return;
      } catch (error) {
        attempt++;
        lastError = error;
        const errMsg = (error as any)?.message || error;
        console.warn(`Tentativa ${attempt} de ${maxRetries} falhou ao conectar com RabbitMQ:`, errMsg);
        if (attempt < maxRetries) {
          await new Promise(res => setTimeout(res, retryDelayMs));
        }
      }
    }
    const lastErrMsg = (lastError as any)?.message || lastError;
    console.error('Erro ao conectar com RabbitMQ após várias tentativas:', lastErrMsg);
    throw lastError;
  }

  async sendProcesso(processo: Processo): Promise<void> {
    if (!this.channel) throw new Error('RabbitMQ channel not initialized');
    const message = JSON.stringify(processo);
    this.channel.sendToQueue(this.queueName, Buffer.from(message), { persistent: true });
    console.info(`Processo ${processo.NumeroProcesso} enviado para a fila ${this.queueName}`);
  }

  async sendProcessos(processos: Processo[]): Promise<void> {
    for (const processo of processos) {
      await this.sendProcesso(processo);
    }
    console.info(`${processos.length} processos enviados para o RabbitMQ`);
  }

  async close(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
    console.info('Conexão com RabbitMQ fechada');
  }
} 