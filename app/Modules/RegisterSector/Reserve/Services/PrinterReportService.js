"use strict";

const Env = use("Env");
const Promise = use("bluebird");
const collect = use("collect.js");
const moment = use("moment");
const { datesDefaultSystem, dateFormat } = use("App/Helpers/DateTime");

const ModelUser = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);

const ReserveModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/Reserve`
);

const ModelReasonCancel = use(
  `${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`
);

const ReserveService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ReserveService`
);

class PrinterReportService {
  /**
   * Gera a impressão do relatório de acompanhamento da reserva
   * @param {*} month
   * @param {*} year
   */
  static async reservationTrackingReport(requestData) {
    const month =
      requestData.month <= 9 ? `0${requestData.month}` : `${requestData.month}`;
    const initDate = `${requestData.year}-${month}-01`;
    const initDateMonth = moment(initDate)
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDateMonth = moment(initDate)
      .endOf("month")
      .format("YYYY-MM-DD");

    const initDateSystem = datesDefaultSystem().init_date;
    const endDatePreviousMonth = moment(initDateMonth)
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    const initDateNextMonth = moment(initDate)
      .add(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    const endDateNextMonth = moment(initDate)
      .add(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");

    /**
     * reservas meses anteriores
     */
    const reservesPreviousMonth = await ReserveModel.query()
      .whereBetween("date_reserve", [initDateSystem, endDatePreviousMonth])
      .whereIn("status", ["p", "a", "r"])
      .orWhere(function() {
        this.whereBetween("date_reserve", [
          datesDefaultSystem().init_date,
          endDatePreviousMonth
        ]).whereBetween("conclusion", [
          initDateMonth,
          datesDefaultSystem().end_date
        ]);
      })
      .orWhere(function() {
        this.whereBetween("date_reserve", [
          datesDefaultSystem().init_date,
          endDatePreviousMonth
        ]).whereBetween("conclusion", [
          moment(initDateMonth)
            .add(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD"),
          datesDefaultSystem().end_date
        ]);
      })
      .fetch();

    /**
     * reservas do mes
     */
    const reservesMonth = await ReserveModel.query()
      .whereBetween("date_reserve", [initDateMonth, endDateMonth])
      .fetch();

    /**
     * reservas canceladas no mes
     */
    const reservesCanceledMonth = await ReserveModel.query()
      .whereBetween("end_process", [initDateMonth, endDateMonth])
      .where("status", "c")
      .fetch();

    /**
     * reservas assinadas no mes
     */
    const reservesSignedMonth = await ReserveModel.query()
      .whereBetween("conclusion", [initDateMonth, endDateMonth])
      .whereIn("status", ["as", "ap", "af"])
      .fetch();

    /**
     * reservas proximo no mes
     */
    const reservesNextMonth = await ReserveModel.query()
      .whereIn("status", ["r", "d", "a", "cd", "p"])
      .orWhere(function() {
        this.whereBetween("date_reserve", [
          initDateNextMonth,
          endDateNextMonth
        ]);
      })
      .fetch();

    const collectionReservesPreviousMonth = collect(reservesPreviousMonth.rows);
    const collectionReservesMonth = collect(reservesMonth.rows);
    const collectionReservesCanceledMonth = collect(reservesCanceledMonth.rows);
    const collectionReservesSigned = collect(reservesSignedMonth.rows);
    const collectionReservesNextMonth = collect(reservesNextMonth.rows);

    const dataReport = {
      // reservas meses anteriores
      reserves_previous_month: {
        total: {
          qt: collectionReservesPreviousMonth.count(),
          value: collectionReservesPreviousMonth.sum("value_negotiated")
        },
        commercial: {
          qt: collectionReservesPreviousMonth
            .where("type_location", "c")
            .count(),
          value: collectionReservesPreviousMonth
            .where("type_location", "c")
            .sum("value_negotiated"),
          percent: collectionReservesPreviousMonth
            .where("type_location", "c")
            .sum("value_negotiated")
            ? (
                (collectionReservesPreviousMonth
                  .where("type_location", "c")
                  .sum("value_negotiated") /
                  collectionReservesPreviousMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        residential: {
          qt: collectionReservesPreviousMonth
            .where("type_location", "r")
            .count(),
          value: collectionReservesPreviousMonth
            .where("type_location", "r")
            .sum("value_negotiated"),
          percent: collectionReservesPreviousMonth
            .where("type_location", "r")
            .sum("value_negotiated")
            ? (
                (collectionReservesPreviousMonth
                  .where("type_location", "r")
                  .sum("value_negotiated") /
                  collectionReservesPreviousMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        }
      },

      // reservas do mes
      reserves_month: {
        total: {
          qt: collectionReservesMonth.count(),
          value: collectionReservesMonth.sum("value_negotiated")
        },
        commercial: {
          qt: collectionReservesMonth.where("type_location", "c").count(),
          value: collectionReservesMonth
            .where("type_location", "c")
            .sum("value_negotiated"),
          percent: collectionReservesMonth.sum("value_negotiated")
            ? (
                (collectionReservesMonth
                  .where("type_location", "c")
                  .sum("value_negotiated") /
                  collectionReservesMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        residential: {
          qt: collectionReservesMonth.where("type_location", "r").count(),
          value: collectionReservesMonth
            .where("type_location", "r")
            .sum("value_negotiated"),
          percent: collectionReservesMonth.sum("value_negotiated")
            ? (
                (collectionReservesMonth
                  .where("type_location", "r")
                  .sum("value_negotiated") /
                  collectionReservesMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        per_user: await this.reservesPerUser(reservesMonth.rows)
      },

      // reservas canceladas do mes
      reserves_canceled: {
        total: {
          qt: collectionReservesCanceledMonth.count(),
          value: collectionReservesCanceledMonth.sum("value_negotiated")
        },
        commercial: {
          qt: collectionReservesCanceledMonth
            .where("type_location", "c")
            .count(),
          value: collectionReservesCanceledMonth
            .where("type_location", "c")
            .sum("value_negotiated"),
          percent: collectionReservesCanceledMonth.sum("value_negotiated")
            ? (
                (collectionReservesCanceledMonth
                  .where("type_location", "c")
                  .sum("value_negotiated") /
                  collectionReservesCanceledMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        residential: {
          qt: collectionReservesCanceledMonth
            .where("type_location", "r")
            .count(),
          value: collectionReservesCanceledMonth
            .where("type_location", "r")
            .sum("value_negotiated"),
          percent: collectionReservesCanceledMonth.sum("value_negotiated")
            ? (
                (collectionReservesCanceledMonth
                  .where("type_location", "r")
                  .sum("value_negotiated") /
                  collectionReservesCanceledMonth.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        per_user: await this.reservesPerUser(reservesCanceledMonth.rows)
      },

      // reservas assinadas do mes
      reserves_signed: {
        total: {
          qt: collectionReservesSigned.count(),
          value: collectionReservesSigned.sum("value_negotiated")
        },
        commercial: {
          qt: collectionReservesSigned.where("type_location", "c").count(),
          value: collectionReservesSigned
            .where("type_location", "c")
            .sum("value_negotiated"),
          percent: collectionReservesSigned.sum("value_negotiated")
            ? (
                (collectionReservesSigned
                  .where("type_location", "c")
                  .sum("value_negotiated") /
                  collectionReservesSigned.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        residential: {
          qt: collectionReservesSigned.where("type_location", "r").count(),
          value: collectionReservesSigned
            .where("type_location", "r")
            .sum("value_negotiated"),
          percent: collectionReservesSigned.sum("value_negotiated")
            ? (
                (collectionReservesSigned
                  .where("type_location", "r")
                  .sum("value_negotiated") /
                  collectionReservesSigned.sum("value_negotiated")) *
                100
              ).toFixed(1)
            : 0
        },
        per_user: await this.reservesPerUser(reservesSignedMonth.rows)
      },

      // reservas assinadas do mes
      reserves_next_month: {
        total: {
          qt: collectionReservesNextMonth.count(),
          value: collectionReservesNextMonth.sum("value_negotiated")
        },
        commercial: {
          qt: collectionReservesNextMonth.where("type_location", "c").count(),
          value: collectionReservesNextMonth
            .where("type_location", "c")
            .sum("value_negotiated"),
          percent: (
            (collectionReservesNextMonth
              .where("type_location", "c")
              .sum("value_negotiated") /
              collectionReservesNextMonth.sum("value_negotiated")) *
            100
          ).toFixed(1)
        },
        residential: {
          qt: collectionReservesNextMonth.where("type_location", "r").count(),
          value: collectionReservesNextMonth
            .where("type_location", "r")
            .sum("value_negotiated"),
          percent: (
            (collectionReservesNextMonth
              .where("type_location", "r")
              .sum("value_negotiated") /
              collectionReservesNextMonth.sum("value_negotiated")) *
            100
          ).toFixed(1)
        },
        per_user: await this.reservesPerUser(reservesNextMonth.rows)
      }
    };

    return dataReport;
  }

  /**
   * Gera a impressão de contratos celebrados
   * @param {*} requestData
   */
  static async contractCelebreatedReport(requestData) {
    const initDate = !requestData.init_date
      ? datesDefaultSystem().init_date
      : dateFormat(requestData.init_date, "YYYY-MM-DD");
    const endDate = !requestData.end_date
      ? datesDefaultSystem().end_date
      : dateFormat(requestData.end_date, "YYYY-MM-DD");

    const query = ReserveModel.query();

    if (requestData.order_by && requestData.sort_by) {
      query.orderBy(requestData.order_by, requestData.sort_by);
    }

    let reserveData = await query
      .whereBetween("conclusion", [initDate, endDate])
      .whereIn("status", ["as", "ap", "af"])
      .with("immobileTypeData", builder => {
        builder.setVisible(["name"]);
      })
      .fetch();

    return reserveData;
  }

  /**
   * Gera os dados do relatorio da lista de reservas
   * @param {*} filter
   */
  static async reserveListReport(filter, sortBy = null, sortOrder = null) {
    let query = ReserveModel.query();
    query = ReserveService.queryFilter(filter, query);
    query
      .with("attendantRegisterData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .with("attendantReceptionData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .where(function() {
        this.orWhere("client_name", "like", "%" + filter.input + "%");
        this.orWhere("address", "like", "%" + filter.input + "%");
        this.orWhere("neighborhood", "like", "%" + filter.input + "%");
        this.orWhere("immobile_code", "like", "%" + filter.input + "%");
        this.orWhere("contract", "like", "%" + filter.input + "%");
      });

    if (sortBy && sortOrder) {
      query.orderBy(sortBy, sortOrder);
    } else {
      query.orderBy("id", "DESC");
    }

    const results = await query.fetch();
    return results.toJSON();
  }

  /**
   * Gera os dados do relatório de reservas canceladas
   * @param {*} filter
   * @param {*} sortBy
   * @param {*} sortOrder
   */
  static async reserveCanceledReport(filter, sortBy = null, sortOrder = null) {
    let query = ReserveModel.query();
    query = ReserveService.queryFilter(filter, query);

    if (sortBy && sortOrder) {
      query.orderBy(sortBy, sortOrder);
    } else {
      query.orderBy("id", "DESC");
    }

    let results = await query
      .with("attendantRegisterData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .with("attendantReceptionData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .with("reasonCancelData", builder => {
        builder.setVisible(["reason"]);
      })
      .where(function() {
        this.orWhere("client_name", "like", "%" + filter.input + "%");
        this.orWhere("address", "like", "%" + filter.input + "%");
        this.orWhere("neighborhood", "like", "%" + filter.input + "%");
        this.orWhere("immobile_code", "like", "%" + filter.input + "%");
        this.orWhere("contract", "like", "%" + filter.input + "%");
      })
      .fetch();

    const reserveData = results.toJSON();

    return reserveData;
  }

  /**
   * Retorna a media de dias para o cancelamento da reserva
   * @param {*} reserveData
   */
  static async medianDaysReserveCanceled(reserveData) {
    let total = 0;
    let days = [];

    await Promise.each(reserveData, reserve => {
      if (reserve.date_reserve && reserve.end_process) {
        const a = moment(reserve.conclusion);
        const b = moment(reserve.date_reserve);
        const diff = a.diff(b, "days");
        total = diff + total;
        days.push(diff);
      }
    });

    return parseInt(total / days.length);
  }

  /**
   * Relatório quantitativo
   * @param {*} reservesData
   */
  static async reportQuantity(reservesData) {
    const collection = collect(reservesData);
    const collectionCommercial = collection.where("type_location", "c");
    const collectionResidencial = collection.where("type_location", "r");

    return {
      total_qt: collection.count(),
      total_value: collection.sum("value_negotiated"),
      total_qt_commercial: collectionCommercial.count(),
      total_value_commercial: collectionCommercial.sum("value_negotiated"),
      total_percent_commercial: (
        (collectionCommercial.sum("value_negotiated") /
          collection.sum("value_negotiated")) *
        100
      ).toFixed(1),
      total_qt_residential: collectionResidencial.count(),
      total_value_residential: collectionResidencial.sum("value_negotiated"),
      total_percent_residential: (
        (collectionResidencial.sum("value_negotiated") /
          collection.sum("value_negotiated")) *
        100
      ).toFixed(1)
    };
  }

  /**
   * Relatório quantitativo por usuário
   * @param {*} reservesData
   */
  static async reportQuantityPerUser(reservesData) {
    //separa os nomes dos integrantes
    const collection = collect(reservesData);
    const usersRegisterSector = collection
      .unique("attendant_register")
      .pluck("attendant_register")
      .all();
    let usersRegisterSectorReportData = [];

    await Promise.each(usersRegisterSector, async (element, index) => {
      const userData = await ModelUser.query()
        .where({ id: element })
        .first();

      usersRegisterSectorReportData.push({
        id: userData.id,
        name: `${userData.name} ${userData.last_name}`,
        ...(await this.reportQuantity(
          collect(reservesData)
            .where("attendant_register", userData.id)
            .all()
        ))
      });

      // altero o valor de percentual para ser calculado por integrante
      usersRegisterSectorReportData[index].total_percent = (
        (usersRegisterSectorReportData[index].total_value /
          collection.sum("value_negotiated")) *
        100
      ).toFixed(1);
    });

    const sort = collect(usersRegisterSectorReportData);
    return sort.sortBy("name").all();
  }

  /**
   * Pega as reservas por usuário
   * @param {*} reserves
   */
  static async reservesPerUser(reserves) {
    const collection = collect(reserves);

    // remove os ids repetidos do setor de cadastro e recepção
    const idsUniqueRegisterSector = collection
      .unique("attendant_register")
      .pluck("attendant_register")
      .all();
    const idsUniqueReceptionSector = collection
      .unique("attendant_reception")
      .pluck("attendant_reception")
      .all();
    let registerSectorUserData = [];
    let receptionUserData = [];
    let totalReportRegisterSector = [];
    let totalReportReceptionSector = [];

    // usuários setor cadastro
    await Promise.each(idsUniqueRegisterSector, async element => {
      const userData = await ModelUser.query()
        .where({ id: element })
        .first();
      registerSectorUserData.push({
        id: element,
        name: `${userData.name} ${userData.last_name}`
      });
    });

    // usuários setor recepção
    await Promise.each(idsUniqueReceptionSector, async element => {
      const userData = await ModelUser.query()
        .where({ id: element })
        .first();
      receptionUserData.push({
        id: element,
        name: `${userData.name} ${userData.last_name}`
      });
    });

    // ordenação usuários
    const collectionUsersRegisterSector = collect(registerSectorUserData)
      .sortBy("name")
      .all();
    const collectionUsersReceptionSector = collect(receptionUserData)
      .sortBy("name")
      .all();

    // total setor cadastro
    await Promise.each(collectionUsersRegisterSector, async element => {
      const collectionUser = collection.where("attendant_register", element.id);
      totalReportRegisterSector.push({
        name: element.name,
        qt: collectionUser.count(),
        value: collectionUser.sum("value_negotiated"),
        percent: (
          (collectionUser.sum("value_negotiated") /
            collection.sum("value_negotiated")) *
          100
        ).toFixed(1)
      });
    });

    // total setor recepção
    await Promise.each(collectionUsersReceptionSector, async element => {
      const collectionUser = collection.where(
        "attendant_reception",
        element.id
      );
      totalReportReceptionSector.push({
        name: element.name,
        qt: collectionUser.count(),
        value: collectionUser.sum("value_negotiated"),
        percent: (
          (collectionUser.sum("value_negotiated") /
            collection.sum("value_negotiated")) *
          100
        ).toFixed(1)
      });
    });

    return {
      register_sector: totalReportRegisterSector,
      reception_sector: totalReportReceptionSector
    };
  }

  /**
   * Motivos de cancelamento
   * @param {*} data
   */
  static async reasonsCancel(data) {
    const collection = collect(data);
    const uniqueReason = collection
      .unique("id_reason_cancel")
      .pluck("id_reason_cancel")
      .all();
    const reasons = [];

    /** Motivo total */
    await Promise.each(uniqueReason, async reason => {
      if (reason) {
        const reasonData = await ModelReasonCancel.query()
          .where({
            id: reason
          })
          .first();
        reasons.push({
          reason_id: reason,
          reason_name: reasonData.reason,
          qt_total: collection.where("id_reason_cancel", reason).count(),
          value_total: collection
            .where("id_reason_cancel", reason)
            .sum("value"),
          percent_total: (
            (collection.where("id_reason_cancel", reason).sum("value") /
              collection.sum("value")) *
            100
          ).toFixed(1)
        });
      }
    });

    return collect(reasons)
      .sortByDesc("qt_total")
      .all();
  }
}

module.exports = PrinterReportService;
