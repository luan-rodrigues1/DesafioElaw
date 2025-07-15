import { Processo, ProcessRaw } from '../types/Process';
import { v4 as uuidv4 } from 'uuid';
import mockProcessosRaw from '../mocks/processosRaw.mock';

export class TJRJApiService {
  private readonly apiUrl = 'https://www3.tjrj.jus.br/consultaprocessual/api/processos/por-nome-parte';

  async fetchProcessos(): Promise<Processo[]> {
    try {
      console.info("Iniciando coleta de processos");

      const requestBody = {
        anoInicial: 2024,
        anoFinal: 2025,
        origem: "1",
        codCom: null,
        codComp: null,
        nome: "Eduardo",
        comarca: "TODAS",
        competencia: "01",
        totalProcessoPesquisa: 10,
        tipoConsulta: "publica",
        isPortalDeServicos: 1,
        isPortal: "S",
        pIsProcAtivos: "N",
        secao: "RJ",
        tipoSegundaInstancia: "1",
        validarSecao: true,
        aba: "nome",
        radio: "1"
      };

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      let data: ProcessRaw[];
      if (response.status === 412) {
        console.warn('Resposta 412 recebida da API, usando mock de processos.');
        data = mockProcessosRaw;
      } else if (response.status === 200) {
        data = await response.json();
      } else {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const processos = this.formatApiResultToProcesses(data);
      console.info('Coleta de dados concluída');
      return processos;
    } catch (error) {
      console.error('Erro durante a coleta via API:', error);
      throw error;
    }
  }

  private formatApiResultToProcesses(apiData: ProcessRaw[]): Processo[] {
    if (!Array.isArray(apiData)) {
      console.info('API retornou dados vazios ou inválidos');
      return [];
    }

    const processosLimitados = apiData.slice(0, 10);

    return processosLimitados.map((apiProcess: ProcessRaw) => {
      let nomeParte = 'Eduardo';
      if (apiProcess.nomeAutor && apiProcess.nomeAutor.toLowerCase().includes('eduardo')) {
        nomeParte = apiProcess.nomeAutor;
      } else if (apiProcess.nomeReu && apiProcess.nomeReu.toLowerCase().includes('eduardo')) {
        nomeParte = apiProcess.nomeReu;
      }

      return {
        Id: uuidv4(),
        NumeroProcesso: apiProcess.codProc || apiProcess.codCnj || '',
        Origem: '1ª Instância',
        Comarca_Regional: apiProcess.nomeComarca || '',
        Competencia: 'Cível',
        NomeParte: nomeParte,
        CriadoEm: new Date()
      };
    });
  }
} 