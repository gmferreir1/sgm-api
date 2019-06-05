"use strict";

const { dateFormat, datesDefaultSystem } = use("App/Helpers/DateTime");

class ContractCelebratedService {
  /**
   *
   * @param {*} filter
   * @param {*} query
   */
  static queryFilter(filter, query) {
    if (filter.status) {
      query.whereIn("status_general", filter.status);
    }

    if (filter.init_date || filter.end_date) {
      filter.init_date = dateFormat(filter.init_date, "YYYY-MM-DD");
      filter.end_date = dateFormat(filter.end_date, "YYYY-MM-DD");
    } else {
      filter.init_date = datesDefaultSystem().init_date;
      filter.end_date = datesDefaultSystem().end_date;
    }

    return query.whereBetween("delivery_key", [filter.init_date, filter.end_date]);
  }
}

module.exports = ContractCelebratedService;
