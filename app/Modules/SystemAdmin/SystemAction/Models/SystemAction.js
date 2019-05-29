"use strict";

const Env = use("Env");

const Model = use("Model");

class SystemAction extends Model {
  static get table() {
    return "system_actions";
  }

  /**
   * Retorna o responsável
   * @returns {HasOne}
   */
  responsibleData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/User/Models/User`,
      "responsible",
      "id"
    );
  }
}

module.exports = SystemAction;
