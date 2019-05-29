"use strict";

const moment = use("moment");
const ServicePrinter = use("App/Helpers/ServicePrinter");
use("App/Helpers/Edge");
const { setMask } = use("App/Helpers/String");
const { dateExtense } = use("App/Helpers/DateTime");

class ReservePrintService {
  /**
   * Imprime a ficha de reserva
   * @param {*} reserveData
   */
  static async printReserveRecord(reserveData) {
    reserveData.client_email = !reserveData.client_email
      ? ""
      : reserveData.client_email;

    if (reserveData.client_phone_01) {
      reserveData.client_phone_01 =
        reserveData.client_phone_01.length === 10
          ? setMask("(XX) XXXX-XXXX", reserveData.client_phone_01)
          : setMask("(XX) XXXXX-XXXX", reserveData.client_phone_01);
    } else {
      reserveData.client_phone_01 = "";
    }

    if (reserveData.client_phone_02) {
      reserveData.client_phone_02 =
        reserveData.client_phone_02.length === 10
          ? setMask("(XX) XXXX-XXXX", reserveData.client_phone_02)
          : setMask("(XX) XXXXX-XXXX", reserveData.client_phone_02);
    } else {
      reserveData.client_phone_02 = "";
    }

    if (reserveData.client_phone_03) {
      reserveData.client_phone_03 =
        reserveData.client_phone_03.length === 10
          ? setMask("(XX) XXXX-XXXX", reserveData.client_phone_03)
          : setMask("(XX) XXXXX-XXXX", reserveData.client_phone_03);
    } else {
      reserveData.client_phone_03 = "";
    }

    const dataForPrint = {
      data: reserveData,
      extra_data: {
        date_print: moment().format("DD/MM/YYYY HH:mm:ss"),
        date_extense: dateExtense(moment().format("YYYY-MM-DD"))
      }
    };

    let viewPath = "";

    if (reserveData.type_location === "c") {
      viewPath = "RegisterSector.Reserve.recordReserveCommercial";
    } else {
      viewPath = "RegisterSector.Reserve.recordReserveResidential";
    }

    const optionsPrint = {
      pageSize: "a4",
      dpi: 72,
      orientation: "portrait",
      "margin-top": 5,
      "margin-left": 5,
      "margin-right": 5
    };

    return await ServicePrinter.generatePrint(
      dataForPrint,
      viewPath,
      optionsPrint
    );
  }
}

module.exports = ReservePrintService;
