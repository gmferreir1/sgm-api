"use strict";

const Env = use("Env");
const ImmobileSicadiModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/Immobile`
);
const ImmobileTypeSicadiModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/ImmobileType`
);

class QuerySicadiDB {
  /**
   *
   * @param {*} typeQuery = per_code, per_contract
   * @param {*} code
   */
  static async queryImmobileData(typeQuery, code) {
    if (typeQuery === "per_code") {
      return await this.queryImmobileDataPerCode(code);
    }

    if (typeQuery === "per_contract") {
      return await this.queryImmobileDataPerContract(code);
    }
  }

  /**
   * Retorna os dados do imovel pelo código
   * @param {*} immobileCode
   */
  static async queryImmobileDataPerCode(immobileCode) {
    const results = await ImmobileSicadiModel.query()
      .where("immobile_code", "like", "%" + immobileCode + "%")
      .select(
        "immobile_code",
        "address",
        "neighborhood",
        "type_occupation as type_location",
        "type_immobile",
        "type_immobile_id",
        "value_rent"
      )
      .orderBy("immobile_code", "DESC")
      .fetch();

    if (!results.rows.length) return null;

    return results.toJSON();
  }

  /**
   * Retorna os dados do imovel pelo contrato
   * --- Falta implementar
   * @param {*} contract
   */
  static async queryImmobileDataPerContract(contract) {}

  /**
   * Retorna os tipos de imoveis cadastrados no SICADI
   */
  static async getTypesImmobile() {
    return await ImmobileTypeSicadiModel.query()
      .orderBy("name_type_immobile", "ASC")
      .select("type_immobile_id", "name_type_immobile")
      .fetch();
  }
}

module.exports = QuerySicadiDB;
