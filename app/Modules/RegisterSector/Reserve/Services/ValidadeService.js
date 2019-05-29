"use strict";

const Env = use("Env");
const { dateFormat } = use("App/Helpers/DateTime");

const ReserveModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/Reserve`
);

const ReserveService = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Services/ReserveService`
);

const ContractCelebratedService = use(
  `${Env.get(
    "REGISTER_SECTOR_MODULE"
  )}/Reserve/Services/ContractCelebratedService`
);

class ValidadeService {
  /**
   * Verifica e valida os dados de acordo com a ação
   * @param {*} action = create or update
   * @param {*} data
   */
  async toValidade(action, data) {
    if (action === "create") {
      return await this.validCreate(data);
    }

    if (action === "update") {
      return await this.validUpdate(data);
    }

    return {
      error: true,
      error_code: 400,
      message: "Tipo de ação não definido na validação"
    };
  }

  /**
   * Validação de dados na criação
   * @param {*} data
   */
  async validCreate(data) {
    /** converte as datas */
    data = this.converteDates(data);

    /** verifica se o código do imovel esta em uso no sistema */
    const check = await ReserveService.immobileIsReleased(data.immobile_code);
    if (check) return check;

    /** remove campos não utilizados na criação */
    delete data.contract_data;
    delete data.historic;

    return data;
  }

  /**
   * Validação de dados na atualização
   * @param {*} data
   */
  async validUpdate(data) {
    const reserveData = await ReserveModel.query()
      .where({ id: data.id })
      .first();

    /** converte as datas */
    data = this.converteDates(data);

    delete data.attendantReceptionData;
    delete data.attendantRegisterData;

    /**
     * verifica se o status atual da reserve permite alterações
     */
    /** so permite alterções do status */
    if (reserveData.status === "ap" || reserveData.status === "af") {
      return {
        status: data.status
      };
    }
    /** não permite alteração pois o status esta assinado ou cancelado */
    if (reserveData.status === "as" || reserveData.status === "c") {
      return {
        error: true,
        error_code: 400,
        message: "O status atual da reserva não permite alterações"
      };
    }

    /** verifica os dados do inquilino */
    if (
      reserveData.status === "as" ||
      reserveData.status === "ap" ||
      reserveData === "af"
    ) {
      if (
        reserveData.crm_code &&
        !reserveData.tenant_code &&
        !reserveData.tenant_name
      ) {
        return {
          error: true,
          error_code: 400,
          message: "Informe os dados do inquilino"
        };
      }
    }

    /** se o usuário estiver finalizando a reserva */
    if (data.status === "as") {
      /** verifica os dados do contrato */
      const checkFieldsContractCelebrated = ContractCelebratedService.checkContractCelebratedFields(
        data.contract_data
      );

      if (!checkFieldsContractCelebrated) {
        return {
          error: true,
          error_code: 400,
          message: "Verifique os dados do contrato celebrado"
        };
      }

      /** verifica se o contrato ja esta cadastrado */
      const checkContract = await ReserveModel.query()
        .where({ contract: data.contract_data.contract })
        .whereNotIn("status", ["c"])
        .first();
      
      if (checkContract) {
        return {
          error: true,
          error_code: 400,
          message: "Contrato já cadastrado no sistema"
        };
      }
    }

    return data;
  }

  /**
   * Retorna os dados com as datas convertidas
   * @param {*} data
   */
  converteDates(data) {
    data.date_reserve = dateFormat(data.date_reserve, "YYYY-MM-DD");
    data.prevision = dateFormat(data.prevision, "YYYY-MM-DD");
    return data;
  }
}

module.exports = ValidadeService;
