"use strict";

const Env = use("Env");
const { toLowerCase } = use("App/Helpers/String");
const Logger = use("App/Helpers/Logger");
const Promise = use("bluebird");
const Database = use("Database");

const ContractCelebratedModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/ContractCelebrated`
);

const ContractCelebratedService = use(
  `${Env.get(
    "FINANCE_MODULE"
  )}/ContractCelebrated/Services/ContractCelebratedService`
);

class ContractCelebratedController {
  /**
   *
   * @param {*} param0
   */
  async all({ request, response }) {
    const requestData = request.all();
    const filter = JSON.parse(requestData.filter);
    const page = requestData.page;
    //const sort = JSON.parse(requestData.sort);

    let query = ContractCelebratedModel.query();

    query = ContractCelebratedService.queryFilter(filter, query);

    query.where(function() {
      this.orWhere("contract", "like", "%" + filter.input + "%");
      this.orWhere("address", "like", "%" + filter.input + "%");
      this.orWhere("neighborhood", "like", "%" + filter.input + "%");
      this.orWhere("immobile_code", "like", "%" + filter.input + "%");
    });

    const results = await query.paginate(
      page,
      !filter.per_page ? 100 : filter.per_page
    );

    return results;
  }

  /**
   *
   * @param {*} param0
   */
  async find({ params }) {
    const id = params.id;

    /** marca como lida o contrato celebrado */
    await ContractCelebratedModel.query()
      .where({ id })
      .update({ opened: true });

    return ContractCelebratedModel.query()
      .where({ id })
      .with("responsibleReleaseReserve", builder => {
        builder.setVisible(["name", "last_name"]);
      })
      .first();
  }

  /**
   *
   * @param {*} param0
   */
  async update({ params, request, response, auth }) {
    let requestData = request.all();
    const observation = requestData.observation;
    requestData = toLowerCase(requestData);
    const id = params.id;

    const contractCelebratedData = await ContractCelebratedModel.query()
      .where({ id })
      .first();

    if (
      contractCelebratedData.status_general !== "p" &&
      contractCelebratedData.status_iptu !== "p" &&
      contractCelebratedData.status_tcrs !== "p"
    ) {
      return response.dispatch(400, "Status atual não permite alteração");
    }
    /** verifico os status */

    const dataToUpdate = {
      status_general: requestData.status_general ? "r" : "p",
      status_iptu: requestData.status_iptu ? "r" : "p",
      status_tcrs: requestData.status_tcrs ? "r" : "p",
      responsible: auth.user.id,
      observation: observation
    };

    await ContractCelebratedModel.query()
      .where({ id })
      .update(dataToUpdate);

    return response.dispatch(200, "success");
  }

  /**
   * Atualização multipla de status
   * @param {*} param0
   */
  async updateMultipleStatus({ request, response }) {
    const requestData = request.all();
    const dataChecked = requestData.data_checked;
    const status = requestData.status_selected;
    const trx = await Database.beginTransaction();

    const data_status = {
      status_general: status.status_general ? "r" : "p",
      status_iptu: status.status_iptu ? "r" : "p",
      status_tcrs: status.status_tcrs ? "r" : "p",
      opened: true
    };

    try {
      await Promise.each(dataChecked, async id => {
        await trx
          .where({ id })
          .update(data_status)
          .into("register_reserve_contract_celebrateds");
      });
      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      console.log(error)
      Logger.create(error);
      trx.rollback();
      return response.dispatch(500, "error: check system log");
    }
  }
}

module.exports = ContractCelebratedController;
