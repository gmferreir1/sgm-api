"use strict";

const Env = use("Env");
const Model = use("Model");

class Reason extends Model {
  static get table() {
    return "reasons";
  }

  /**
   * Responsável pela ultima ação
   */
  responsibleData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/User/Models/User`,
      "responsible",
      "id"
    );
  }
}

module.exports = Reason;
