import { Processo } from '../types/Process';
import * as amqp from 'amqplib';

export class RabbitMQService {
  private readonly queueName = 'new_processes';
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  async init(): Promise<void> {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL || "");
    if (!this.connection) throw new Error('Failed to connect to RabbitMQ');
    this.channel = await this.connection.createChannel();
    if (!this.channel) throw new Error('Failed to create RabbitMQ channel');
    await this.channel.assertQueue(this.queueName, { durable: true });
    console.info('Conexão com RabbitMQ estabelecida');
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