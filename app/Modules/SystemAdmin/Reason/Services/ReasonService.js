"use strict";
const Env = use("Env");
const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);

class ReasonService {
  /**
   * Verifica se o motivo ja esta cadastrado no modulo
   * @param {*} reason
   * @param {*} module_name
   */
  static async checkExists(reason, module_name, distinctId = null) {
    const query = ReasonModel.query();

    if (distinctId) {
      query.whereNotIn("id", [distinctId]);
    }

    const check = await query.where({ reason, module_name }).first();

    if (check && check.id) {
      return true;
    }
  }
}

module.exports = ReasonService;
