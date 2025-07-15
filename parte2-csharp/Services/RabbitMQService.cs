using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using DesafioElawParte2.Models;

namespace DesafioElawParte2.Services
{
    public class RabbitMQService : IDisposable
    {
        private readonly ILogger<RabbitMQService> _logger;
        private readonly string _queueName = "new_processes";
        private IConnection? _connection;
        private IModel? _channel;
        private readonly string _rabbitMQUrl;

        public RabbitMQService(ILogger<RabbitMQService> logger, string rabbitMQUrl)
        {
            _logger = logger;
            _rabbitMQUrl = rabbitMQUrl;
        }

        public async Task InitializeAsync()
        {
            const int maxRetries = 5;
            const int retryDelayMs = 2000;

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    _logger.LogInformation("Tentativa {Attempt} de {MaxRetries} para conectar com RabbitMQ", attempt, maxRetries);
                    
                    var factory = new ConnectionFactory
                    {
                        Uri = new Uri(_rabbitMQUrl)
                    };

                    _connection = factory.CreateConnection();
                    _channel = _connection.CreateModel();
                    
                    _channel.QueueDeclare(
                        queue: _queueName,
                        durable: true,
                        exclusive: false,
                        autoDelete: false,
                        arguments: null);

                    _logger.LogInformation("Conexão com RabbitMQ estabelecida");
                    return;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Tentativa {Attempt} falhou ao conectar com RabbitMQ", attempt);
                    
                    if (attempt == maxRetries)
                    {
                        _logger.LogError(ex, "Erro ao conectar com RabbitMQ após {MaxRetries} tentativas", maxRetries);
                        throw;
                    }
                    
                    await Task.Delay(retryDelayMs);
                }
            }
        }

        public void StartConsuming(Func<Processo, Task> messageHandler)
        {
            if (_channel == null)
            {
                throw new InvalidOperationException("Canal do RabbitMQ não foi inicializado");
            }

            var consumer = new EventingBasicConsumer(_channel);
            
            consumer.Received += async (model, ea) =>
            {
                try
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    
                    _logger.LogInformation("Mensagem recebida: {Message}", message);
                    
                    var processo = JsonSerializer.Deserialize<Processo>(message);
                    if (processo != null)
                    {
                        await messageHandler(processo);
                        _channel.BasicAck(ea.DeliveryTag, false);
                        _logger.LogInformation("Processo {NumeroProcesso} processado com sucesso", processo.NumeroProcesso);
                    }
                    else
                    {
                        _channel.BasicNack(ea.DeliveryTag, false, true);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Erro ao processar mensagem");
                    _channel.BasicNack(ea.DeliveryTag, false, true);
                }
            };

            _channel.BasicConsume(
                queue: _queueName,
                autoAck: false,
                consumer: consumer);

            _logger.LogInformation("Iniciado consumo da fila {QueueName}", _queueName);
        }

        public void Dispose()
        {
            _channel?.Close();
            _connection?.Close();
            _channel?.Dispose();
            _connection?.Dispose();
        }
    }
} 