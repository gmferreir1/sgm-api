"use strict";

const Env = use("Env");
const collect = use("collect.js");
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
        builder.setVisible(["name", "last_name"])
      })
      .orderBy("score", "asc")
      .fetch();
  }
}

module.exports = QueryController;
