"use strict";

const Env = use("Env");
const Logger = use("App/Helpers/Logger");
const Promise = use("bluebird");

const ImoviewAPIDataService = use(
  `${Env.get("API_EXTERNAL_MODULE")}/Services/ImoviewAPIDataService`
);

const TypesImmobileModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/TypeImmobile`
);

class UpdateDatabaseController {
  constructor() {
    this.serviceAPI = new ImoviewAPIDataService();
  }

  /**
   * Atualiza a base de dados de acordo com a seleção do usuário
   * @param {*} param0
   */
  async updateDatabase({ request, response }) {
    const requestData = request.all();

    /** Tipos de imovel */
    if (requestData && requestData.type_update === "types_immobile") {
      const typesImmobileData = await this.serviceAPI.getTypesImmobile();
      if (typesImmobileData.lista.length) {
        const data = typesImmobileData.lista;
        try {
          await TypesImmobileModel.truncate();

          await Promise.each(data, async value => {
            await TypesImmobileModel.create({
              value: value.codigo,
              name: value.nome.toLowerCase()
            });
          });
        } catch (error) {
          Logger.create(error);
          return response.dispatch(500, "error: check system log");
        }
      }
    }
  }
}

module.exports = UpdateDatabaseController;
