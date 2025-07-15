using System;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Logging;
using Npgsql;
using DesafioElawParte2.Models;

namespace DesafioElawParte2.Services
{
    public class DatabaseService
    {
        private readonly ILogger<DatabaseService> _logger;
        private readonly string _connectionString;

        public DatabaseService(ILogger<DatabaseService> logger, string connectionString)
        {
            _logger = logger;
            _connectionString = connectionString;
        }

        public async Task InitializeAsync()
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                await connection.ExecuteAsync(@"
                    CREATE TABLE IF NOT EXISTS processos_worker (
                        id VARCHAR(50) PRIMARY KEY,
                        numeroprocesso VARCHAR(50) NOT NULL,
                        origem VARCHAR(50),
                        comarca_regional VARCHAR(100),
                        competencia VARCHAR(50),
                        nomeparte VARCHAR(200),
                        criadoem TIMESTAMP NOT NULL,
                        processado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao inicializar banco de dados");
                throw;
            }
        }

        public async Task SaveProcessoAsync(Processo processo)
        {
            try
            {
                using var connection = new NpgsqlConnection(_connectionString);
                await connection.OpenAsync();

                var sql = @"
                    INSERT INTO processos_worker (id, numeroprocesso, origem, comarca_regional, competencia, nomeparte, criadoem)
                    VALUES (@Id, @NumeroProcesso, @Origem, @Comarca_Regional, @Competencia, @NomeParte, @CriadoEm)
                    ON CONFLICT (id) DO NOTHING";

                var rowsAffected = await connection.ExecuteAsync(sql, processo);
                
                if (rowsAffected > 0)
                {
                    _logger.LogInformation("Processo {NumeroProcesso} salvo no banco de dados", processo.NumeroProcesso);
                }
                else
                {
                    _logger.LogInformation("Processo {NumeroProcesso} já existe no banco de dados", processo.NumeroProcesso);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao salvar processo {NumeroProcesso}", processo.NumeroProcesso);
                throw;
            }
        }
    }
} 