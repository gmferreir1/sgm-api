"use strict";

const Env = use("Env");
const { dateFormat, datesDefaultSystem } = use("App/Helpers/DateTime");

const TransferContractModel = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/TransferContract/Models/TransferContract`
);

class TransferContractService {
  /**
   * Verifica se o contrato esta lançado no sistema
   * @param {*} contract
   */
  static async checkContractIsReleased(contract) {
    if (!contract) {
      return {
        error: true,
        error_code: 400,
        error_message: "Informe o número do contrato"
      };
    }

    const check = await TransferContractModel.query()
      .where({ contract })
      .whereNotIn("status", ["c"])
      .first();

    if (check) {
      return {
        error: true,
        error_code: 400,
        error_message: "Contrato já lançado no sistema"
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

    if (filter.responsible.length) {
      query.whereIn("responsible_transfer", filter.responsible);
    }

    if (filter.status.length) {
      query.whereIn("status", filter.status);
    }

    if (filter.type_date === "transfer_date") {
      query.whereBetween("transfer_date", [filter.init_date, filter.end_date]);
    }

    if (filter.type_date === "conclusion_date") {
      query.whereBetween("end_process", [filter.init_date, filter.end_date]);
    }
    

    return query;
  }

  /**
   * Validação
   * @param {*} requestData 
   * @param {*} transferData 
   */
  static async validade(requestData, transferData) {
    /** verifica se o status da transferencia permite alterações */
    if (transferData.status !== "p") {
      return {
        error: true,
        error_code: 400,
        error_message: "Status atual da transferência não permite alterações"
      };
    }

    /** verifica se o usuário esta finalizando a transferencia para verificar os dados do novo contrato */
    if (requestData.status === "r") {
      /** verifica se o usuário informou o novo contrato */
      if (!requestData.new_contract) {
        return {
          error: true,
          error_code: 400,
          error_message: "Informe o novo contrato"
        };
      }

      /** verifica se o novo contrato informado ja não esta cadastrado */
      const checkContract = await TransferContractModel.query()
        .where({ new_contract: requestData.new_contract })
        .whereNotIn("status", ["c"])
        .first();

      if (checkContract) {
        return {
          error: true,
          error_code: 400,
          error_message: "O novo contrato informado esta em uso no sistema"
        };
      }
    }
  }
}

module.exports = TransferContractService;
