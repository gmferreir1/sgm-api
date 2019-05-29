"use strict";
const Model = use("Model");
const Env = use("Env");

class Reserve extends Model {
  static get table() {
    return "register_reserves";
  }

  /**
   * Atendente cadastro
   * @returns {HasOne}
   */
  attendantRegisterData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/User/Models/User`,
      "attendant_register",
      "id"
    );
  }

  /**
   * Atendente recepção
   * @returns {HasOne}
   */
  attendantReceptionData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/User/Models/User`,
      "attendant_reception",
      "id"
    );
  }

  /**
   * Histórico
   * @returns {HasOne}
   */
  historicData() {
    return this.hasMany(
      `${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`,
      "id",
      "id_register"
    ).where({ module_name: "register_reserve" });
  }

  /**
   * Retorna os dados do tipo do imovel
   */
  immobileTypeData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/TypeImmobile`,
      "immobile_type",
      "value"
    );
  }

  /**
   * Retorna o motivo do cancelamento
   */
  reasonCancelData() {
    return this.hasOne(
      `${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`,
      "id_reason_cancel",
      "id"
    ).where({
      module_name: "register_reserve",
      type_reason: "reason_cancel_contract"
    });
  }
}

module.exports = Reserve;
