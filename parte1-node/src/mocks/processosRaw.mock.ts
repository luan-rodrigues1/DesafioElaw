import { ProcessRaw } from '../types/Process';

const mockProcessosRaw: ProcessRaw[] = [
  {
    "codProc": "2024.210.000420-0",
    "codCnj": "0000420-15.2024.8.19.0210",
    "descrFase": "Arquivamento",
    "tipoAutor": "Requerente",
    "tipoReu": "Requerido",
    "exibProc": "N",
    "descServ": "Cartório do Centro de Mediação Pré-processual",
    "nomeComarca": "Regional da Leopoldina",
    "nomeAutor": "JACOB AUGUSTO ALVES",
    "nomeReu": "EDUARDO",
    "personagensResumido": [
      { "tipo": null, "nome": "JACOB AUGUSTO ALVES", "nomeSocial": null },
      { "tipo": null, "nome": "EDUARDO", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.001.049900-6",
    "codCnj": "0069504-51.2024.8.19.0001",
    "descrFase": "Envio de Documento Eletrônico",
    "tipoAutor": "Autor",
    "tipoReu": "Réu",
    "exibProc": "N",
    "descServ": "Cartório da 21ª Vara Cível",
    "nomeComarca": "Comarca da Capital",
    "nomeAutor": "DANIELA SANTOS OLIVEIRA",
    "nomeReu": "EDUARDO ADES MORAES e outro(s)...",
    "personagensResumido": [
      { "tipo": null, "nome": "DANIELA SANTOS OLIVEIRA", "nomeSocial": null },
      { "tipo": null, "nome": "EDUARDO ADES MORAES e outro(s)...", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2025.900.014125-9",
    "codCnj": "0061867-15.2025.8.19.0001",
    "descrFase": "Juntada",
    "tipoAutor": "Requerente",
    "tipoReu": "Requerido",
    "exibProc": "N",
    "descServ": "Cartório da 1ª Vara Cível",
    "nomeComarca": "Regional da Região Oceânica",
    "nomeAutor": "EDUARDO ALBERTO MONTEIRO GUIMARAES",
    "nomeReu": "KLINI PLANOS DE SAUDE LTDA",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ALBERTO MONTEIRO GUIMARAES", "nomeSocial": null },
      { "tipo": null, "nome": "KLINI PLANOS DE SAUDE LTDA", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.001.065651-3",
    "codCnj": "0089914-33.2024.8.19.0001",
    "descrFase": "Arquivamento",
    "tipoAutor": "Requerente",
    "tipoReu": "Requerido",
    "exibProc": "N",
    "descServ": "Centro de Mediação da Capital (Cart Pré-processual)",
    "nomeComarca": "Comarca da Capital",
    "nomeAutor": "EDUARDO ALEXANDRE",
    "nomeReu": "UBER DO BRASIL TECNOLOGIA LTDA",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ALEXANDRE", "nomeSocial": null },
      { "tipo": null, "nome": "UBER DO BRASIL TECNOLOGIA LTDA", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.063.004059-2",
    "codCnj": "0004089-32.2024.8.19.0063",
    "descrFase": "Arquivamento",
    "tipoAutor": "Requerente",
    "tipoReu": "Requerido",
    "exibProc": "N",
    "descServ": "Cartório do Centro de Mediação Pré-processual",
    "nomeComarca": "Comarca de Três Rios",
    "nomeAutor": "EDUARDO ALMEIDA SILVA",
    "nomeReu": "LUMMAN",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ALMEIDA SILVA", "nomeSocial": null },
      { "tipo": null, "nome": "LUMMAN", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.038.004967-6",
    "codCnj": "0005022-80.2024.8.19.0038",
    "descrFase": "Ato Ordinatório Praticado",
    "tipoAutor": "Requerente",
    "tipoReu": "Requerido",
    "exibProc": "N",
    "descServ": "Cartório do Centro de Mediação Pré-processual",
    "nomeComarca": "Comarca de Nova Iguaçu",
    "nomeAutor": "EDUARDO ALVES DE OLIVEIRA",
    "nomeReu": "JOAO LUCIANO OLIVEIRA DE SOUSA",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ALVES DE OLIVEIRA", "nomeSocial": null },
      { "tipo": null, "nome": "JOAO LUCIANO OLIVEIRA DE SOUSA", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.900.030419-5",
    "codCnj": "0131964-74.2024.8.19.0001",
    "descrFase": "Conclusão ao Juiz",
    "tipoAutor": "Autor",
    "tipoReu": "Réu",
    "exibProc": "N",
    "descServ": "Cartório da 2ª Vara Cível",
    "nomeComarca": "Comarca de Araruama",
    "nomeAutor": "EDUARDO ALVES HERCULANO",
    "nomeReu": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S A",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ALVES HERCULANO", "nomeSocial": null },
      { "tipo": null, "nome": "AMIL ASSISTENCIA MEDICA INTERNACIONAL S A", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.001.054816-9",
    "codCnj": "0076007-88.2024.8.19.0001",
    "descrFase": "Conclusão ao Juiz",
    "tipoAutor": "Exequente",
    "tipoReu": "Herdeiro",
    "exibProc": "N",
    "descServ": "Cartório da 49ª Vara Cível",
    "nomeComarca": "Comarca da Capital",
    "nomeAutor": "CONDOMINIO DO EDIFICIO VILLAGE SAO MIGUEL",
    "nomeReu": "EDUARDO ANDRADE PARDAL PINHO",
    "personagensResumido": [
      { "tipo": null, "nome": "CONDOMINIO DO EDIFICIO VILLAGE SAO MIGUEL", "nomeSocial": null },
      { "tipo": null, "nome": "EDUARDO ANDRADE PARDAL PINHO", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.900.007656-3",
    "codCnj": "0031203-35.2024.8.19.0001",
    "descrFase": "Declínio de Competência",
    "tipoAutor": "Autor",
    "tipoReu": "Réu",
    "exibProc": "N",
    "descServ": "Cartório do Nucleo 4.0.6 Saúde Privada (Cível)",
    "nomeComarca": "Comarca da Capital",
    "nomeAutor": "EDUARDO ANTONIO DE SOUZA CORTES",
    "nomeReu": "UNIMED RIO COOPERATIVA DE TRABALHO MEDICO DO RIO e outro(s)...",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ANTONIO DE SOUZA CORTES", "nomeSocial": null },
      { "tipo": null, "nome": "UNIMED RIO COOPERATIVA DE TRABALHO MEDICO DO RIO e outro(s)...", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  },
  {
    "codProc": "2024.900.008002-5",
    "codCnj": "0032559-65.2024.8.19.0001",
    "descrFase": "Juntada",
    "tipoAutor": "Autor",
    "tipoReu": "Réu",
    "exibProc": "N",
    "descServ": "Cartório da 36ª Vara Cível",
    "nomeComarca": "Comarca da Capital",
    "nomeAutor": "EDUARDO ANTONIO MOTTA MAY",
    "nomeReu": "BRADESCO SAUDE S A",
    "personagensResumido": [
      { "tipo": null, "nome": "EDUARDO ANTONIO MOTTA MAY", "nomeSocial": null },
      { "tipo": null, "nome": "BRADESCO SAUDE S A", "nomeSocial": null }
    ],
    "totalPersonagem": 2
  }
];

export default mockProcessosRaw; 