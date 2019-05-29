"use strict";

const Env = use("Env");
const Promise = use("bluebird");
const { toLowerCase } = use("App/Helpers/String");
const Logger = use("App/Helpers/Logger");
const Database = use("Database");
const moment = use("moment");

const ValidadeService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ValidadeService`
);

const ReserveSystemActionService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/Reserve/Services/ReserveSystemActionService`
);

const ContractCelebratedService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/Reserve/Services/ContractCelebratedService`
);

const ReservePrintService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ReservePrintService`
);

const ReserveService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ReserveService`
);

const ReserveModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/Reserve`
);

const ContractCelebratedModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/ContractCelebrated`
);

const SystemActionModel = use(
  `${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`
);

const FluxAttendanceService = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Services/FluxAttendanceService`
);

class ReserveController {
  constructor() {
    this.validadeService = new ValidadeService();
  }

  /**
   * Cria uma nova reserva
   * @param {*} param0
   */
  async create({ request, response, auth }) {
    let requestData = toLowerCase(request.all());
    const userId = auth.user.id;

    /** Valida os dados para a criação da reserva */
    requestData = await this.validadeService.toValidade("create", requestData);

    if (requestData.error) {
      return response.dispatch(requestData.error_code, requestData.message);
    }

    const trx = await Database.beginTransaction();

    try {
      /** Grava os dados da reserva */
      const created = await ReserveModel.create(requestData, trx);
      /** Gera o código da reserva */
      await trx
        .where({ id: created.id })
        .update({
          code_reserve: created.id,
          year_reserve: moment(created.date_reserve).format("YYYY")
        })
        .into("register_reserves");

      /** mensagem de criação */
      const actionMessage = await ReserveSystemActionService.getCreatedMessage(
        userId,
        created.id
      );
      await SystemActionModel.create(actionMessage, trx);

      /** Grava um novo fluxo de atendimento */
      const flux = FluxAttendanceService.addScore(
        "register_reserve",
        requestData.attendant_register,
        auth
      );
      if (!flux) {
        throw new Error("error add flux attendance");
      }

      trx.commit();
      return created.id;
    } catch (error) {
      console.log(error);
      trx.rollback();
      Logger.create(error);
      return response.dispatch(500, "check system log");
    }
  }

  /**
   * Atualiza dados da reserva
   * @param {*} param0
   */
  async update({ params, request, response, auth }) {
    const id = params.id;
    const userId = auth.user.id;
    let requestData = toLowerCase(request.all());
    let actionMessage;

    /** Valida os dados para a edição da reserva */
    requestData = await this.validadeService.toValidade("update", requestData);
    if (requestData.error) {
      return response.dispatch(requestData.error_code, requestData.message);
    }

    const reserveData = await ReserveModel.query()
      .where({ id })
      .first();

    let contractData = requestData.contract_data;

    const trx = await Database.beginTransaction();
    try {
      /** verifica se o usuário esta finalizando a reserva */
      if (
        requestData.status === "as" ||
        requestData.status === "ap" ||
        requestData.status === "af"
      ) {
        if (
          reserveData.status !== "as" &&
          reserveData.status !== "ap" &&
          reserveData.status !== "af"
        ) {
          /** grava os dados do contrato */
          contractData = ContractCelebratedService.mountObject(
            requestData,
            contractData,
            userId
          );

          await ContractCelebratedModel.create(contractData, trx);

          /** Dados extra do contrato */
          requestData.contract = contractData.contract;
          requestData.deadline = contractData.period_contract;
          requestData.taxa = requestData.contract_data.taxa;
          requestData.observation = requestData.contract_data.observation;
          requestData.origin_city = requestData.contract_data.origin_city
            ? requestData.contract_data.origin_city.toLowerCase()
            : "";
          requestData.origin_state = requestData.contract_data.origin_state;
          requestData.finality = requestData.contract_data.finality;
          requestData.date_init_contract = contractData.delivery_key;
          requestData.end_process = moment().format("YYYY-MM-DD");
        }
      }

      /** remove os dados de contrato */
      delete requestData.contract_data;

      if (
        reserveData.status === "af" ||
        (reserveData.status === "ap" && requestData.status === "as")
      ) {
        /** pega somente a mensagem de que o usuário finalizou a reserva */
        actionMessage = await ReserveSystemActionService.getMessageAssignedReserve(
          reserveData,
          requestData,
          userId,
          id
        );
      } else {
        /** mensagem do sistema de ação que informa as alterações do usuário */
        actionMessage = await ReserveSystemActionService.getUpdateMessages(
          reserveData,
          requestData,
          userId,
          id
        );
      }

      if (actionMessage.length) {
        await Promise.each(actionMessage, async message => {
          await SystemActionModel.create(message, trx);
        });
      }

      /** update dados da reserva */
      await trx
        .where({ id })
        .update(requestData)
        .into("register_reserves");

      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      console.log(error);
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   * Cancelamento da reserva
   * @param {*} param0
   */
  async cancelReserve({ params, request, response, auth }) {
    const id = params.id;
    const requestData = toLowerCase(request.all());

    /** verifica se a reserva já não esta cancelada */
    const reserveData = await ReserveModel.query()
      .where({ id })
      .first();

    if (reserveData.status === "c") {
      return response.dispatch(400, "Reserva já cancelada no sistema");
    }

    const trx = await Database.beginTransaction();

    try {
      await trx
        .where({ id })
        .update({
          id_reason_cancel: requestData.id_reason_cancel,
          status: "c",
          end_process: moment().format("YYYY-MM-DD"),
          conclusion: moment().format("YYYY-MM-DD")
        })
        .into("register_reserves");

      const actionMessage = await ReserveSystemActionService.getCancelMessage(
        auth.user.id,
        id,
        requestData.id_reason_cancel,
        requestData.observation
      );

      await SystemActionModel.create(actionMessage, trx);

      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      Logger.create(error);
      trx.rollback();
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   * Retorna os dados de uma reserve pelo ID
   * @param {*} param0
   */
  async find({ params, request }) {
    const id = params.id;
    const requestData = request.all();

    const reserveData = await ReserveModel.query()
      .with("attendantRegisterData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .with("attendantReceptionData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .where({ id })
      .first();

    const contractCelebratedData = await ContractCelebratedService.contractCelebratedData(
      reserveData
    );
    reserveData.contract_data = contractCelebratedData;

    if (requestData && requestData.print === "true") {
      return await ReservePrintService.printReserveRecord(reserveData.toJSON());
    }

    return reserveData;
  }

  /**
   * Retorna todas as reservas de acordo com o filtro informado.
   * @param {*} param0
   */
  async all({ request }) {
    const requestData = request.all();
    const filter = JSON.parse(requestData.filter);
    const page = requestData.page;

    let query = ReserveModel.query();
    query = ReserveService.queryFilter(filter, query);
    query
      .with("attendantRegisterData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .with("attendantReceptionData", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .orderBy("id", "DESC")
      .where(function() {
        this.orWhere("client_name", "like", "%" + filter.input + "%");
        this.orWhere("address", "like", "%" + filter.input + "%");
        this.orWhere("neighborhood", "like", "%" + filter.input + "%");
        this.orWhere("immobile_code", "like", "%" + filter.input + "%");
        this.orWhere("contract", "like", "%" + filter.input + "%");
      });

    const totalData = await query.fetch();
    const results = await query.paginate(
      page,
      !filter.per_page ? 100 : filter.per_page
    );

    return {
      list: results,
      quantity: await ReserveService.quantityReserves(totalData.toJSON())
    };
  }
}

module.exports = ReserveController;
