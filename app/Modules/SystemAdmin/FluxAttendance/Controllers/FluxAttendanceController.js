"use strict";
const Env = use("Env");
const { toLowerCase } = use("App/Helpers/String");
const FluxAttendanceModel = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Models/FluxAttendance`
);

class FluxAttendanceController {
  /**
   * Cria um novo fluxo de atendimento no sistema
   * @param {*} param0
   */
  async create({ request, response, auth }) {
    const requestData = toLowerCase(request.all());
    requestData.rp_last_action = auth.user.id;

    // verifica se ja não tem gravado um fluxo com o mesmo usuário e modulo.
    const check = await FluxAttendanceModel.query()
      .where({ user: requestData.user, module_name: requestData.module_name })
      .first();

    if (check && check.id) {
      return response.dispatch(
        400,
        "Fluxo de atendimento cadastrado no sistema"
      );
    }

    await FluxAttendanceModel.create(requestData);
  }

  /**
   * Retorna os fluxos de atendimento no sistema
   * @param {*} param0
   */
  async all({ request }) {
    return await FluxAttendanceModel.query()
      .with("userData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .fetch();
  }

  /**
   * Atualiza dados do fluxo de atendimento no sistema
   * @param {*} param0
   */
  async update({ request, params, auth }) {
    const requestData = toLowerCase(request.all());
    const id = params.id;
    delete requestData.user;
    requestData.rp_last_action = auth.user.id;

    return await FluxAttendanceModel.query()
      .where({ id })
      .update(requestData);
  }

  /**
   * Remove o fluxo de atendimento
   * @param {*} param0
   */
  async delete({ params }) {
    const id = params.id;

    return await FluxAttendanceModel.query()
      .where({ id })
      .delete();
  }

  /**
   * Retorna o proximo atendente de acordo o modulo passado
   * @param {*} param0 
   */
  async getNextAttendance({ request, response, auth }) {
    const requestData = request.all();

    if (!requestData.module_name) {
      return response.dispatch(400, "Nome do modulo não informado !");
    }

    return FluxAttendanceModel.query()
      .where({ module_name: requestData.module_name })
      .with("userData", builder => {
        builder.setVisible(["name", "last_name"])
      })
      .orderBy("score", "asc")
      .fetch();
  }
}

module.exports = FluxAttendanceController;
