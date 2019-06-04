"use strict";

const Env = use("Env");
const http = use("axios");
const Logger = use("App/Helpers/Logger");

const Immobile = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/Immobile`
);

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

    /** pesquisa na API */
    let result = await this.getData(url);

    /** pesquisa na base de dados, se achar já retorna */
    if (result.error && result.error_code === 400) {
      return await this.getImmobileDataInDb(immobileCode);
    }

    /** Prepara o retorno os dados da API */
    result = result.imovel;

    const valueRent =
      result.valor.split(" ").length > 1 ? result.valor.split(" ")[1] : 0;
    const valueCondominum =
      result.valorcondominio.split(" ").length > 1
        ? result.valorcondominio.split(" ")[1]
        : 0;
    const valueIptu =
      result.valoriptu.split(" ").length > 1
        ? result.valoriptu.split(" ")[1]
        : 0;

    return {
      imovel: {
        immobile_code: result.codigoauxiliar,
        immobile_code_extra: result.codigo,
        zip_code: result.cep ? result.cep.replace(/\D/g, "") : null,
        address: result.complemento
          ? `${result.endereco} ${result.numero}, ${result.complemento}`
          : `${result.endereco} ${result.numero}`,
        neighborhood: result.bairro,
        type_location: result.destinacao === "Comercial" ? "c" : "r",
        immobile_type: result.codigotipo,
        indicator_key: result.identificadorchave,
        number_keys: result.numerochave,
        number_controls: null,
        value_rent: valueRent
          ? valueRent.replace(".", "").replace(",", ".")
          : 0,
        value_condominum: valueCondominum
          ? valueCondominum.replace(".", "").replace(",", ".")
          : 0,
        value_iptu: valueIptu
          ? valueIptu.replace(".", "").replace(",", ".")
          : 0,
        index_iptu: result.indiceiptu,
        tx_administration: result.taxaadm
          ? parseInt(result.taxaadm.replace(/\D/g, ""))
          : null,
        tx_intermediation: null,
        city: result.cidade,
        state: result.estado
      }
    };
  }

  /**
   * Retorna os dados do cliente
   * @param {*} clientCode
   */
  async getClientData(clientCode) {
    const url = `/Usuario/RetornarTipo2?codigoCliente=${clientCode}`;
    const result = await this.getData(url);

    if (result.error) {
      return result;
    }

    const phones_array = result.telefones ? result.telefones.split(" - ") : "";
    const client_email_array = result.email ? result.email.split(" ") : "";

    return {
      client_name: result.nome.toLowerCase(),
      client_code: result.codigo,
      client_cpf_cnpj: result.cpfoucnpj,
      client_email: client_email_array.length ? client_email_array[1] : null,
      guarantor: result.fiador,
      tenant: result.locatario,
      owner: result.locador,
      phones: {
        phone_01: phones_array.length > 0 ? phones_array[0] : null,
        phone_02: phones_array.length >= 1 ? phones_array[1] : null,
        phone_03: phones_array.length >= 2 ? phones_array[2] : null
      }
    };
  }

  /**
   * Busca os dados do imovel na base de dados
   * @param {*} immobile_code
   */
  async getImmobileDataInDb(immobile_code) {
    const results = await Immobile.query()
      .where({ immobile_code })
      .first();

    if (!results) {
      return {
        error: true,
        error_code: 400,
        error_message: "Nenhum dado encontrado na consulta da API"
      };
    }

    return {
      imovel: results
    };
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
