"use strict";
const Env = use("Env");
const { toLowerCase } = use("App/Helpers/String");
const ReasonService = use(
  `${Env.get("ADMIN_MODULE")}/Reason/Services/ReasonService`
);
const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);

class ReasonController {
  /**
   * Cria um novo motivo no sistema
   * @param {*} param0
   */
  async create({ request, response, auth }) {
    const requestData = toLowerCase(request.all());
    requestData.responsible = auth.user.id;

    const checkExists = await ReasonService.checkExists(
      requestData.reason,
      requestData.module_name
    );
    if (checkExists)
      return response.dispatch(400, "Motivo já cadastrado no sistema");

    return await ReasonModel.create(requestData);
  }

  /**
   * Retorna todos os motivos
   */
  async all({ request }) {
    const requestData = request.all();
    
    const query = ReasonModel.query();

    if (requestData.module_name && requestData.type_reason) {
      query.where({
        module_name: requestData.module_name,
        type_reason: requestData.type_reason
      });
    }

    return await query
      .with("responsibleData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .orderBy("module_name", "ASC")
      .orderBy("reason", "ASC")
      .fetch();
  }

  /**
   * Atualiza motivo no sistema
   * @param {*} param0
   */
  async update({ request, params, auth }) {
    const id = params.id;
    const requestData = toLowerCase(request.all());
    requestData.responsible = auth.user.id;

    const checkExists = await ReasonService.checkExists(
      requestData.reason,
      requestData.module_name,
      id
    );
    if (checkExists)
      return response.dispatch(400, "Motivo já cadastrado no sistema");

    return await ReasonModel.query()
      .where({ id })
      .update(requestData);
  }
}

module.exports = ReasonController;
