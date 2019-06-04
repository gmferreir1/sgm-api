"use strict";

const Env = use("Env");
const Promise = use("bluebird");
const { toLowerCase } = use("App/Helpers/String");
const { dateFormat } = use("App/Helpers/DateTime");
const moment = use("moment");
const Database = use("Database");
const ServicePrinter = use("App/Helpers/ServicePrinter");

const TransferContractModel = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/TransferContract/Models/TransferContract`
);

const SystemActionModel = use(
  `${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`
);

const TransferContractService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/TransferContract/Services/TransferContractService`
);

const TransferContractSystemActionService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/TransferContract/Services/TransferContractSystemActionService`
);

const TransferContractReportService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/TransferContract/Services/TransferContractReportService`
);

const FluxAttendanceService = use(
  `${Env.get("ADMIN_MODULE")}/FluxAttendance/Services/FluxAttendanceService`
);

class TransferContractController {
  /**
   * Cadastra uma nova transferencia no sistema
   * @param {*} param0
   */
  async create({ request, response, auth }) {
    const requestData = toLowerCase(request.all());
    const userId = auth.user.id;
    requestData.responsible = userId;

    /** converte a data da transferencia */
    requestData.transfer_date = dateFormat(
      requestData.transfer_date,
      "YYYY-MM-DD"
    );

    /** verifica se o contrato esta lançado no sistema */
    const checkContractIsReleased = await TransferContractService.checkContractIsReleased(
      requestData.contract
    );
    if (checkContractIsReleased && checkContractIsReleased.error) {
      return response.dispatch(
        checkContractIsReleased.error_code,
        checkContractIsReleased.error_message
      );
    }

    const trx = await Database.beginTransaction();

    try {
      /** transferencia de contrato */
      const dataCreated = await TransferContractModel.create(requestData, trx);
      /** mensagem do sistema */
      const systemMessage = await TransferContractSystemActionService.getCreatedMessage(
        userId,
        dataCreated.id
      );
      await SystemActionModel.create(systemMessage, trx);

      /** Grava um novo fluxo de atendimento */
      const flux = FluxAttendanceService.addScore(
        "register_transfer",
        requestData.responsible_transfer,
        auth
      );
      if (!flux) {
        throw new Error("error add flux attendance");
      }

      trx.commit();
      return dataCreated.id;
    } catch (error) {
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   *
   * @param {*} param0
   */
  async update({ params, request, response, auth }) {
    const requestData = toLowerCase(request.all());
    requestData.responsible = auth.user.id;
    const id = params.id;

    delete requestData.transfer_date;

    let transferData = await TransferContractModel.query()
      .where({ id: params.id })
      .first();

    transferData = transferData.toJSON();

    /** validação */
    const validate = await TransferContractService.validade(
      requestData,
      transferData
    );

    if (validate && validate.error) {
      return response.dispatch(validate.error_code, validate.error_message);
    }
    /** data do fim do processo */
    requestData.end_process =
      requestData.status !== "p" ? moment().format("YYYY-MM-DD") : null;

    const actionMessages = await TransferContractSystemActionService.getUpdateMessages(
      transferData,
      requestData,
      auth.user.id,
      id
    );

    const trx = await Database.beginTransaction();

    try {
      await trx
        .where({ id })
        .update(requestData)
        .into("register_transfers");

      if (actionMessages.length) {
        await Promise.each(actionMessages, async message => {
          await SystemActionModel.create(message, trx);
        });
      }

      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      trx.rollback();
      Logger.create();
      return response.dispatch(500, "check system log");
    }
  }

  /**
   *
   * @param {*} param0
   */
  async all({ request, response }) {
    const requestData = request.all();
    const filter = JSON.parse(requestData.filter);
    const sort = requestData.sort ? JSON.parse(requestData.sort) : null;
    const page = requestData.page;
    let results;

    let query = TransferContractModel.query();

    query = TransferContractService.queryFilter(filter, query);

    if (!sort) {
      query.orderBy("transfer_date", "desc");
    } else {
      query.orderBy(sort.sort_by, sort.sort_order);
    }

    query
      .with("reasonTransfer", query => {
        query.setVisible(["reason"]);
      })
      .with("responsibleTransfer", query => {
        query.setVisible(["name", "last_name"]);
      });

    if (!filter.print) {
      return await query.paginate(
        page,
        !filter.per_page ? 100 : filter.per_page
      );
    } else {
      results = await query.fetch();
    }

    const transferData = results.toJSON();

    /** impressão do relatório */
    const viewPath = "RegisterSector.Transfer.transferList";
    let period;

    if (!requestData.init_date || !requestData.end_date) {
      period = "GERAL";
    } else {
      period = `${requestData.init_date} a ${requestData.end_date}`;
    }

    const dataForPrint = {
      extra_data: {
        period,
        date_print: moment().format("DD/MM/YYYY HH:mm:ss"),
        report_quantity: await TransferContractReportService.mountReportQt(
          transferData
        )
      },
      data: transferData
    };

    const optionsPrint = {
      pageSize: "a4",
      dpi: 72,
      orientation: "landscape",
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

  /**
   *
   * @param {*} param0
   */
  async find({ params }) {
    const id = params.id;

    return await TransferContractModel.query()
      .where({ id })
      .first();
  }

  /**
   *
   * @param {*} param0
   */
  async cancelTransfer({ params, request, response, auth }) {
    const id = params.id;
    const requestData = request.all();
    const trx = await Database.beginTransaction();

    try {
      await trx
        .where({ id })
        .update({
          status: "c",
          end_process: moment().format("YYYY-MM-DD"),
          responsible: auth.user.id
        })
        .into("register_transfers");

      const cancelMessage = await TransferContractSystemActionService.getCancelMessage(
        auth.user.id,
        id,
        requestData.observation
      );

      await SystemActionModel.create(cancelMessage, trx);

      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      Logger.create(Error);
      trx.rollback();
      return response.dispatch(500, "error: check system log");
    }
  }
}
module.exports = TransferContractController;
