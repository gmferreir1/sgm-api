"use strict";

const Env = use("Env");
const Promise = use("bluebird");
const moment = use("moment");
const ServicePrinter = use("App/Helpers/ServicePrinter");
const { getMonthName } = use("App/Helpers/String");
const { datesDefaultSystem, dateFormat, dateExtense } = use(
  "App/Helpers/DateTime"
);

const PrinterReportService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/PrinterReportService`
);

class PrinterReportController {
  /**
   * Chama a impresssão de relatório
   * @param {*} param0
   */
  async printerReport({ request, response }) {
    const requestData = request.all();
    let reportData;
    let viewPath;
    let optionsPrint;
    let period;
    let median;
    let reasonsCancel;

    /** Acompanhamento reserva */
    if (requestData.type_report === "reservation_tracking") {
      reportData = await PrinterReportService.reservationTrackingReport(
        requestData
      );

      viewPath = "RegisterSector.Reserve.monitoringReserve";
      optionsPrint = {
        pageSize: "a4",
        dpi: 72,
        orientation: "portrait",
        "margin-top": 5,
        "margin-left": 5,
        "margin-right": 5
      };
    }

    /** Contratos celebrados */
    if (requestData.type_report === "contract_celebrated") {
      reportData = await PrinterReportService.contractCelebreatedReport(
        requestData
      );

      reportData = reportData.toJSON();

      if (!reportData.length) {
        return response.dispatch(
          400,
          "Nenhum dado encontrado para montagem do relatório"
        );
      }

      // calcula o tempo médio para a celebração da reserva
      median = 0;
      let total = 0;
      let days = [];
      await Promise.each(reportData, report => {
        if (report.date_reserve && report.end_process) {
          const a = moment(report.end_process);
          const b = moment(report.date_reserve);
          const diff = a.diff(b, "days");
          total = diff + total;
          days.push(diff);
        }
      });

      median = parseInt(total / days.length);

      viewPath = "RegisterSector.Reserve.reportContractCelebrated";

      if (!requestData.init_date || !requestData.end_date) {
        period = "GERAL";
      } else {
        period = `${requestData.init_date} a ${requestData.end_date}`;
      }
    }

    /** Lista de reservas */
    if (requestData.type_report === "reserve_list") {
      const filter = JSON.parse(requestData.filter);
      const sortBy = requestData.sort_by;
      const sortOrder = requestData.sort_order;
      reportData = await PrinterReportService.reserveListReport(
        JSON.parse(requestData.filter),
        sortBy,
        sortOrder
      );

      viewPath = "RegisterSector.Reserve.reserveList";

      if (!filter.init_date || !filter.end_date) {
        period = "GERAL";
      } else {
        period = `${filter.init_date} a ${filter.end_date}`;
      }
    }

    /** Reservas canceladas */
    if (requestData.type_report === "reserve_canceled") {
      const filter = JSON.parse(requestData.filter);
      const sortBy = requestData.sort_by;
      const sortOrder = requestData.sort_order;
      reportData = await PrinterReportService.reserveCanceledReport(
        JSON.parse(requestData.filter),
        sortBy,
        sortOrder
      );

      /** Motivos para o cancelamento da reserva */
      reasonsCancel = await PrinterReportService.reasonsCancel(reportData);

      viewPath = "RegisterSector.Reserve.reserveCanceled";

      if (!filter.init_date || !filter.end_date) {
        period = "GERAL";
      } else {
        period = `${filter.init_date} a ${filter.end_date}`;
      }

      median = await PrinterReportService.medianDaysReserveCanceled(reportData);
    }

    const dataForPrint = {
      data: reportData,
      extra_data: {
        period,
        date_print: moment().format("DD/MM/YYYY HH:mm:ss"),
        month_name: getMonthName(requestData.month),
        year: requestData.year,
        report_quantity: await PrinterReportService.reportQuantity(reportData),
        report_quantity_per_user: await PrinterReportService.reportQuantityPerUser(
          reportData
        ),
        date_extense: dateExtense(moment().format("YYYY-MM-DD")),
        median,
        reasons_cancel: reasonsCancel
      }
    };

    return await ServicePrinter.generatePrint(
      dataForPrint,
      viewPath,
      optionsPrint
    );
  }
}
module.exports = PrinterReportController;
