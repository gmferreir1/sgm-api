"use strict";

const Env = use("Env");
const Logger = use("App/Helpers/Logger");

const SystemActionModel = use(
  `${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`
);

class ReserveHistoricController {
  /**
   * Retorna o historico e a açao da reserva
   * @param {*} param0
   */
  async all({ params }) {
    const reserve_id = params.reserve_id;
    const results = await SystemActionModel.query()
      .with("responsibleData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .where({ id_register: reserve_id })
      .orderBy("id", "DESC")
      .fetch();

    return results;
  }

  /**
   * Cria um novo historico no sistema
   * @param {*} param0 
   */
  async create({ request, response, auth }) {
    const requestData = request.all();

    const data = {
      text: requestData.text,
      type_action: "historic",
      module_name: "register_reserve",
      responsible: auth.user.id,
      id_register: requestData.id_register
    };

    try {
      await SystemActionModel.create(data);
      return response.dispatch(200, "success");
    } catch (error) {
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }
}

module.exports = ReserveHistoricController;
