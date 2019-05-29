"use strict";
const Env = use("Env");
const SystemActionModel = use(`${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`);

class SystemActionController {
  /**
   * Retorna todas as ações registradas no sistema
   */
  async all({ request }) {

    const requestData = request.all();

    return await SystemActionModel.query()
      .orWhere("text", "like", "%" + requestData.input + "%")
      .where("type_action", "like", "%" + requestData.input + "%")
      .fetch();
  }
}

module.exports = SystemActionController;
