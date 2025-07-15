import { Processo } from '../types/Process';
import { Pool } from 'pg';

export class DatabaseService {
  private readonly pool: Pool;
  private readonly connectionString: string = process.env.DATABASE_URL || '';

  constructor() {
    this.pool = new Pool({ connectionString: this.connectionString });
  }

  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS processos (
        id VARCHAR(50) PRIMARY KEY,
        numeroprocesso VARCHAR(50) NOT NULL,
        origem VARCHAR(50),
        comarca_regional VARCHAR(100),
        competencia VARCHAR(50),
        nomeparte VARCHAR(200),
        criadoem TIMESTAMP NOT NULL
      )
    `);
  }

  async saveProcesso(processo: Processo): Promise<void> {
    await this.pool.query(
      `INSERT INTO processos (id, numeroprocesso, origem, comarca_regional, competencia, nomeparte, criadoem)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [
        processo.Id,
        processo.NumeroProcesso,
        processo.Origem,
        processo.Comarca_Regional,
        processo.Competencia,
        processo.NomeParte,
        processo.CriadoEm
      ]
    );
  }

  async saveProcessos(processos: Processo[]): Promise<void> {
    for (const processo of processos) {
      await this.saveProcesso(processo);
    }
  }
} 