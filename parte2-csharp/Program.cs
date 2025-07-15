using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using DesafioElawParte2.Models;
using DesafioElawParte2.Services;

namespace DesafioElawParte2
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureServices((hostContext, services) =>
                {
                    var configuration = hostContext.Configuration;
                    
                    services.AddSingleton<DatabaseService>(provider =>
                    {
                        var logger = provider.GetRequiredService<ILogger<DatabaseService>>();
                        var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
                            ?? configuration.GetConnectionString("Database") 
                            ?? "Host=postgres-parte2;Port=5432;Database=processos_worker;Username=postgres;Password=postgres";
                        return new DatabaseService(logger, connectionString);
                    });

                    services.AddSingleton<RabbitMQService>(provider =>
                    {
                        var logger = provider.GetRequiredService<ILogger<RabbitMQService>>();
                        var rabbitMQUrl = Environment.GetEnvironmentVariable("RABBITMQ_URL") 
                            ?? configuration.GetConnectionString("RabbitMQ") 
                            ?? "amqp://admin:admin@rabbitmq:5672";
                        return new RabbitMQService(logger, rabbitMQUrl);
                    });

                    services.AddHostedService<Worker>();
                })
                .ConfigureLogging(logging =>
                {
                    logging.ClearProviders();
                    logging.AddConsole();
                });
    }

    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly DatabaseService _databaseService;
        private readonly RabbitMQService _rabbitMQService;

        public Worker(
            ILogger<Worker> logger,
            DatabaseService databaseService,
            RabbitMQService rabbitMQService)
        {
            _logger = logger;
            _databaseService = databaseService;
            _rabbitMQService = rabbitMQService;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                _logger.LogInformation("Iniciando Worker C# - Consumidor de Processos TJRJ");

                await _databaseService.InitializeAsync();
                await _rabbitMQService.InitializeAsync();

                _rabbitMQService.StartConsuming(async (processo) =>
                {
                    _logger.LogInformation("Processando processo: {NumeroProcesso}", processo.NumeroProcesso);
                    await _databaseService.SaveProcessoAsync(processo);
                });

                _logger.LogInformation("Worker iniciado com sucesso. Aguardando mensagens...");

                while (!stoppingToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro no Worker");
                throw;
            }
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Parando Worker...");
            _rabbitMQService.Dispose();
            await base.StopAsync(cancellationToken);
        }
    }
}
