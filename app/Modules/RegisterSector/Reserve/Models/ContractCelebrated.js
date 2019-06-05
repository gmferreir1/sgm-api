"use strict";
const Env = use("Env");
const Model = use("Model");

class Reserve extends Model {
  static get table() {
    return "register_reserve_contract_celebrateds";
  }

  /**
   * Responsável por ter liberado a reserva
   * @returns {HasOne}
   */
  responsibleReleaseReserve() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/User/Models/User`,
      "rp_release_reserve",
      "id"
    );
  }
}

module.exports = Reserve;
