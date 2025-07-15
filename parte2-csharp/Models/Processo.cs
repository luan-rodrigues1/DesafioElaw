using System;

namespace DesafioElawParte2.Models
{
    public class Processo
    {
        public string Id { get; set; } = string.Empty;
        public string NumeroProcesso { get; set; } = string.Empty;
        public string Origem { get; set; } = string.Empty;
        public string Comarca_Regional { get; set; } = string.Empty;
        public string Competencia { get; set; } = string.Empty;
        public string NomeParte { get; set; } = string.Empty;
        public DateTime CriadoEm { get; set; }
    }
} 