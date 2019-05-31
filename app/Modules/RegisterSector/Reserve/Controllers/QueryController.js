"use strict";

const Env = use("Env");
const fs = require("fs");
const Helpers = use("Helpers");
const collect = use("collect.js");
const moment = use("moment");
const Promise = use("bluebird");
const { toLowerCase } = use("App/Helpers/String");

const TypeImmobileModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/TypeImmobile`
);

const ReserveModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/Reserve`
);

const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);

const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);

const FluxAttendance = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Models/FluxAttendance`
);

const ImoviewAPIDataService = use(
  `${Env.get("API_EXTERNAL_MODULE")}/Services/ImoviewAPIDataService`
);

const ReserveService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ReserveService`
);

const SendEmailReserveService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/Reserve/Services/SendEmailReserveService`
);

class QueryController {
  constructor() {
    this.API = new ImoviewAPIDataService();
  }

  /**
   * Consulta os tipos de imoveis disponíveis
   */
  async getTypesImmobile() {
    return await TypeImmobileModel.query()
      .select("value", "name")
      .fetch();
  }

  /**
   * Consulta os dados do imovel pelo código
   * @param {*} param0
   */
  async getImmobileData({ request, response }) {
    const requestData = toLowerCase(request.all());

    /** Verifica se ja existe uma reserva em aberto para o imovel selecionado */
    const immobileIsReleased = await ReserveService.immobileIsReleased(
      requestData.immobile_code
    );
    if (
      immobileIsReleased &&
      immobileIsReleased.error &&
      immobileIsReleased.error_code === 400
    )
      return response.dispatch(400, immobileIsReleased.message);

    //const API = new ImoviewAPIDataService();
    const result = await this.API.getImmobileData(requestData.immobile_code);

    if (result.error) {
      return response.dispatch(result.error_code, result.error_message);
    }

    return result;
  }

  /**
   * Consulta os dados do cliente(propretário ou inquilino) pelo código
   * @param {*} param0
   */
  async getClientData({ request, response }) {
    const requestData = toLowerCase(request.all());

    //const API = new ImoviewAPIDataService();
    const result = await this.API.getClientData(requestData.code);

    if (result.error) {
      return response.dispatch(result.error_code, result.error_message);
    }

    return result;
  }

  /**
   * Retorna os motivo para o cancelamento da reserva
   */
  async getReasonsCancel({ response }) {
    const data = await ReasonModel.query()
      .where({
        module_name: "register_reserve",
        type_reason: "reason_cancel_contract"
      })
      .orderBy("reason", "ASC")
      .fetch();

    if (!data.rows.length) {
      return response.dispatch(
        400,
        "Nenhum motivo para o cancelamento encontrado"
      );
    }
    return data;
  }

  /**
   * Retorna os atendentes para o filtro
   */
  async getAttendandtsForFilter() {
    const results = await ReserveModel.query()
      .select("attendant_register", "attendant_reception")
      .fetch();

    const users_register = [];
    const users_reception = [];

    const collection = collect(results.rows);

    const uniqueAttendantRegister = collection
      .unique("attendant_register")
      .pluck("attendant_register")
      .all();
    const uniqueAttendantReception = collection
      .unique("attendant_reception")
      .pluck("attendant_reception")
      .all();

    await Promise.each(uniqueAttendantRegister, async attendant => {
      const user = await UserModel.query()
        .where({ id: attendant })
        .first();

      users_register.push({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        full_name: `${user.name} ${user.last_name}`
      });
    });

    await Promise.each(uniqueAttendantReception, async attendant => {
      const user = await UserModel.query()
        .where({ id: attendant })
        .first();

      users_reception.push({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        full_name: `${user.name} ${user.last_name}`
      });
    });

    return {
      users_register,
      users_reception
    };
  }

  /**
   * Retorna os anos disponíveis para o relatorio
   */
  async getYearsAvailableToReport() {
    const results = await ReserveModel.query()
      .select("year_reserve")
      .fetch();
    const collection = collect(results.toJSON());
    return collection
      .unique("year_reserve")
      .sortBy("year_reserve")
      .pluck("year_reserve")
      .all();
  }

  /**
   * Retorna o score do modulo
   */
  async getModuleScore() {
    return await FluxAttendance.query()
      .where({ module_name: "register_reserve" })
      .with("userData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .orderBy("score", "asc")
      .fetch();
  }

  /**
   * Retorna os dados do email escolhido pelo usuário
   * @param {*} param0
   */
  async getEmailData({ request, response }) {
    const requestData = request.all();
    let dataEmail;

    if (!requestData.type_email) {
      return response.dispatch(400, "Informe o tipo de email");
    }

    /** dados da reserva */
    const reserveData = await ReserveModel.query()
      .where({ id: requestData.reserve_id })
      .first();

    /** verifica se a reserva esta finalizada para liberar os dados do email */
    if (
      reserveData.status !== "as" &&
      reserveData.status !== "ap" &&
      reserveData.status !== "af"
    ) {
      return response.dispatch(
        400,
        "Status da reserva não permite o envio de email"
      );
    }

    if (requestData.type_email === "owner_notification_new_location") {
      const data = reserveData.toJSON();
      data.owner_name = requestData.client_name;
      data.zip_code = "";
      data.city = "montes claros";
      data.state = "mg";
      data.date_end_contract = moment(data.date_init_contract)
        .add(data.deadline, "months")
        .format("YYYY-MM-DD");
      data.date_primary_rent = moment(data.conclusion)
        .add(1, "months")
        .format("YYYY-MM-DD");

      dataEmail = await SendEmailReserveService.textOwnerNotification(data);
    }

    if (requestData.type_email === "welcome_tenant") {
      return Promise.try(() => {
        const file = fs.readFileSync(Helpers.resourcesPath("images/welcome.png"));
        var buf = Buffer.from(file);
        var base64 = buf.toString("base64");
        //console.log('Base64 of ddr.jpg :' + base64);
        return JSON.stringify({base_64_image: base64});
      });
    }

    return dataEmail;
  }
}

module.exports = QueryController;
