"use strict";

const Env = use("Env");
const Model = use("Model");

class FluxAttendance extends Model {
  static get table() {
    return "flux_attendances";
  }

  /**
   * Retorna os dados do usuário do fluxo
   */
  userData() {
    return this.hasOne(`${Env.get("ADMIN_MODULE")}/User/Models/User`, "user", "id");
  }
}

module.exports = FluxAttendance;