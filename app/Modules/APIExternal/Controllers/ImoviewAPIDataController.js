"use strict";

const Env = use("Env");
const { toLowerCase } = use("App/Helpers/String");

const ImoviewAPIDataService = use(
  `${Env.get("API_EXTERNAL_MODULE")}/Services/ImoviewAPIDataService`
);

class ImoviewAPIDataController {
  constructor() {
    this.API = new ImoviewAPIDataService();
  }
  /**
   * Retorna os dados do imovel
   * @param {*} param0
   */
  async getImmobileData({ request, response }) {
    const requestData = toLowerCase(request.all());

    const result = await this.API.getImmobileData(requestData.immobile_code);

    return result.error
      ? response.dispatch(result.error_code, result.error_message)
      : result;
  }

  /**
   * Retorna os dados do cliente
   * @param {*} param0
   */
  async getClientData({ request, response }) {
    const requestData = toLowerCase(request.all());

    const result = await this.API.getClientData(requestData.client_code);

    return result.error
      ? response.dispatch(result.error_code, result.error_message)
      : result;
  }
}
module.exports = ImoviewAPIDataController;
