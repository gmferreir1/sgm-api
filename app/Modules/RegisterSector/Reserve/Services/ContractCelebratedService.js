"use strict";
const Env = use("Env");
const _ = use("lodash");
const { dateFormat } = use("App/Helpers/DateTime");

const ContractCelebratedModel = use(
  `${Env.get("REGISTER_SECTOR_MODULE")}/Reserve/Models/ContractCelebrated`
);

class ContractCelebratedService {
  /**
   * Monta os dados do contrato celebrado
   * @param {*} reserveData
   */
  static async contractCelebratedData(reserveData) {
    const contractData = await ContractCelebratedModel.query()
      .where({ reserve_id: reserveData.id })
      .first();

    if (contractData) {
      const fields = ["1º aluguel", "master", "master + 1", "particular"];

      const check = _.find(fields, value => value === reserveData.observation);

      if (!check) {
        contractData.other_observation = reserveData.observation;
        contractData.observation = "other";
      } else {
        contractData.other_observation = "";
        contractData.observation = reserveData.observation;
      }

      return {
        contract: contractData.contract,
        delivery_key: contractData.delivery_key,
        deadline: reserveData.deadline,
        taxa: !reserveData.taxa ? "" : reserveData.taxa,
        deadline: contractData.period_contract,
        observation: contractData.observation,
        other_observation: contractData.other_observation
          ? contractData.other_observation
          : "",
        origin_city: !reserveData.origin_city ? "" : reserveData.origin_city,
        origin_state: !reserveData.origin_state ? "" : reserveData.origin_state,
        finality: !reserveData.finality ? "" : reserveData.finality,
        ticket: contractData.ticket,
        tx_contract: contractData.tx_contract,
        bank_expense: contractData.bank_expense,
        due_date_rent: contractData.due_date_rent,
        loyalty_discount: contractData.loyalty_discount,
        date_init_contract: contractData.date_init_contract
      };
    }

    return {
      contract: "",
      delivery_key: "", // entrega das chaves
      deadline: "",
      taxa: "",
      other_observation: "",
      observation: "",
      origin_city: "",
      origin_state: "",
      finality: "",
      ticket: "",
      tx_contract: "",
      bank_expense: "",
      due_date_rent: "",
      loyalty_discount: "",
      date_init_contract: ""
    };
  }

  /**
   * Verifica os campos do contrato assinado
   * @param {*} data
   */
  static checkContractCelebratedFields(data) {
    if (
      !data.contract ||
      !data.taxa ||
      !data.delivery_key ||
      !data.deadline ||
      !data.observation ||
      !data.origin_city ||
      !data.origin_state ||
      !data.finality ||
      !data.ticket ||
      !data.tx_contract ||
      !data.bank_expense ||
      !data.due_date_rent ||
      !data.loyalty_discount ||
      !data.date_init_contract ||
      !data.observation ||
      !data
    ) {
      return false;
    }
    return true;
  }

  /**
   * Monta o objeto com os dados do contrato celebrado
   * @param {*} reserveData
   * @param {*} contractCelebratedData
   * @param {*} responsible
   */
  static mountObject(reserveData, contractCelebratedData, responsible) {
    return {
      reserve_id: reserveData.id,
      contract: contractCelebratedData.contract,
      immobile_code: reserveData.immobile_code,
      address: reserveData.address,
      neighborhood: reserveData.neighborhood,
      conclusion: dateFormat(contractCelebratedData.delivery_key, "YYYY-MM-DD"),
      ticket: contractCelebratedData.ticket,
      ticket: contractCelebratedData.ticket,
      tx_contract: contractCelebratedData.tx_contract,
      bank_expense: contractCelebratedData.bank_expense,
      period_contract: contractCelebratedData.deadline,
      delivery_key: dateFormat(contractCelebratedData.delivery_key, "YYYY-MM-DD"),
      date_init_contract: dateFormat(contractCelebratedData.date_init_contract, "YYYY-MM-DD"),
      due_date_rent: dateFormat(contractCelebratedData.due_date_rent, "YYYY-MM-DD"),
      loyalty_discount: contractCelebratedData.loyalty_discount,
      rp_release_reserve: reserveData.attendant_register,
      responsible,
      subscription_iptu: reserveData.subscription_iptu,
      owner_name: reserveData.owner_name,
    };
  }
}

module.exports = ContractCelebratedService;
