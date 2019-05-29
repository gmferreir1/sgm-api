"use strict";

const http = use("axios");
const Logger = use("App/Helpers/Logger");

class ImoviewAPIDataService {
  constructor() {
    this._apiKey = "X24aIYlUp843WSmY3yIYJ42cn5/zS6RwOTXscRCwdkY=";
    this._mainUrl = "https://www.imoview.com.br/api";
  }

  /**
   * Retorna os tipos de imoveis disponiveis
   */
  async getTypesImmobile() {
    const url = `/Imovel/RetornarTiposImoveisDisponiveis?parametros={"finalidade":"1"}`;

    return await this.getData(url);
  }

  /**
   * Retorna os dados do imovel
   * @param {*} immobileCode
   */
  async getImmobileData(immobileCode) {
    if (!immobileCode) {
      throw {
        error: true,
        error_code: 400,
        error_message: "Informe o código do imovel"
      };
    }

    const url = `/Imovel/RetornarDetalhesImovelDisponivel?codigoImovel=${immobileCode}`;

    return await this.getData(url);
  }

  /**
   * Retorna os dados do cliente
   * @param {*} clientCode 
   */
  async getClientData(clientCode) {
    const url = `/Usuario/RetornarTipo2?codigoCliente=${clientCode}`;
    return await this.getData(url);
  }

  /**
   * Consulta a API de acordo a url passada
   * @param {*} url
   */
  async getData(url) {
    const mainUrl = `${this._mainUrl}${url}`;

    return await http
      .get(mainUrl, { headers: { chave: this._apiKey } })
      .then(result => {
        return result.data;
      })
      .catch(err => {
        Logger.create(err);
        const message = "Nenhum dado encontrado na consulta da API";
        return {
          error: true,
          error_code: 400,
          error_message: message
        };
      });
  }
}

module.exports = ImoviewAPIDataService;
