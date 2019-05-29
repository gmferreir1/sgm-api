"use strict";

const Env = use("Env");
const collect = use("collect.js");
const { dateFormat, datesDefaultSystem } = use("App/Helpers/DateTime");

const ReserveModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/Reserve`
);

class ReserveService {
  /**
   * Verifica se o imóvel esta lançado no sistema
   * @param {*} immobileCode
   */
  static async immobileIsReleased(immobileCode) {
    if (!immobileCode) {
      return {
        error: true,
        error_code: 400,
        message: "Informe o código do imóvel"
      };
    }

    const check = await ReserveModel.query()
      .where({ immobile_code: immobileCode })
      .whereNotIn("status", ["as", "ap", "af", "c"])
      .first();
    if (check) {
      return {
        error: true,
        error_code: 400,
        message: "Código do imóvel em uso no sistema"
      };
    }
  }

  /**
   * Monta o filtro para consulta
   * @param {*} filter
   */
  static queryFilter(filter, query) {

    if (!filter.init_date || !filter.end_date) {
      filter.init_date = datesDefaultSystem().init_date;
      filter.end_date = datesDefaultSystem().end_date;
    } else {
      filter.init_date = dateFormat(filter.init_date, "YYYY-MM-DD");
      filter.end_date = dateFormat(filter.end_date, "YYYY-MM-DD");
    }

    if (filter.responsible_register.length) {
      query.whereIn("attendant_register", filter.responsible_register);
    }

    if (filter.responsible_reception.length) {
      query.whereIn("attendant_reception", filter.responsible_reception);
    }

    if (filter.status.length) {
      query.whereIn("status", filter.status);
    }

    
    if (filter.type_date === "r") {
      query.whereBetween("date_reserve", [filter.init_date, filter.end_date]);
    }

    if (filter.type_date === "p") {
      query.whereBetween("prevision", [filter.init_date, filter.end_date]);
    }

    if (filter.type_date === "c") {
      query.whereBetween("conclusion", [filter.init_date, filter.end_date]);
    }

    return query;
  }

  /**
   * Retorna os dados quantitativo
   * @param {*} data 
   */
  static async quantityReserves(data) {

    const collection = collect(data);

    return {
      qt_total: collection.count(),
      value_total: collection.sum('value_negotiated'),
      qt_total_reserve: collection.where("status", "r").count(),
      value_total_reserve: collection.where("status", "r").sum('value_negotiated'),
      qt_total_documentation: collection.where("status", "d").count(),
      value_total_documentation: collection.where("status", "d").sum('value_negotiated'),
      qt_total_analising: collection.where("status", "a").count(),
      value_total_analising: collection.where("status", "a").sum('value_negotiated'),
      qt_total_register: collection.where("status", "cd").count(),
      value_total_register: collection.where("status", "cd").sum('value_negotiated'),
      qt_total_pending: collection.where("status", "p").count(),
      value_total_pending: collection.where("status", "p").sum('value_negotiated'),
      qt_total_assigned: collection.where("status", "as").count(),
      value_total_assigned: collection.where("status", "as").sum('value_negotiated'),
      qt_total_assigned_with_pending: collection.where("status", "ap").count(),
      value_total_assigned_with_pending: collection.where("status", "ap").sum('value_negotiated'),
      qt_total_final_active: collection.where("status", "af").count(),
      value_total_final_active: collection.where("status", "af").sum('value_negotiated'),
      qt_total_canceled: collection.where("status", "c").count(),
      value_total_canceled: collection.where("status", "c").sum('value_negotiated'),
    }

  }
}

module.exports = ReserveService;
