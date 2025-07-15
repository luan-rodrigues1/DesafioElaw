export interface Processo {
  Id: string;
  NumeroProcesso: string;
  Origem: string;
  Comarca_Regional: string;
  Competencia: string;
  NomeParte: string;
  CriadoEm: Date;
}

export interface ProcessRaw {
  codProc: string;
  codCnj: string;
  descrFase: string;
  tipoAutor: string;
  tipoReu: string;
  exibProc: string;
  descServ: string;
  nomeComarca: string;
  nomeAutor: string;
  nomeReu: string;
  personagensResumido: Array<{
    tipo: string | null;
    nome: string;
    nomeSocial: string | null;
  }>;
  totalPersonagem: number;
} 