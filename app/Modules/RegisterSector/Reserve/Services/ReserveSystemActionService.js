"use strict";

const Env = use("Env");
const moment = use("moment");
const { moneyFormat } = use("App/Helpers/String");

const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);
const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);

class ReserveSystemActionService {
  /**
   * Retorna a mensagem de criação
   * @param {*} userId
   * @param {*} idRegister
   */
  static async getCreatedMessage(userId, idRegister) {
    const userName = await this.getUser(userId);
    return {
      type_action: "system_action",
      text: `O usuário ${userName} abriu a reserva`,
      module_name: "register_reserve",
      responsible: userId,
      id_register: idRegister
    };
  }

  /**
   * Retorna as mensagens quando o usuário faz alguma alteração nos campos monitorados
   * @param {*} dataBeforeUpdate
   * @param {*} dataToUpdate
   * @param {*} responsible
   */
  static async getUpdateMessages(
    dataBeforeUpdate,
    dataToUpdate,
    responsibleId,
    idRegister
  ) {
    const responsible = await this.getUser(responsibleId);
    const messages = [];
    let message;

    /** alteração do codigo do CRM */
    if (dataToUpdate.crm_code !== dataBeforeUpdate.crm_code) {
      if (!dataBeforeUpdate.crm_code) {
        message = `O usuário ${responsible} definiu o código do CRM para ${dataToUpdate.crm_code.toUpperCase()}`;
      } else {
        if (!dataToUpdate.crm_code) {
          message = `O usuário ${responsible} removeu o código do CRM ${dataBeforeUpdate.crm_code.toUpperCase()}`;
        } else {
          message = `O usuário ${responsible} alterou o código do CRM de ${dataBeforeUpdate.crm_code.toUpperCase()} para ${dataToUpdate.crm_code.toUpperCase()}`;
        }
      }

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** valor anunciado */
    if (dataToUpdate.value !== dataBeforeUpdate.value) {
      message = `O usuário ${responsible} alterou o valor anunciado de R$ ${moneyFormat(
        dataBeforeUpdate.value
      )} para R$ ${moneyFormat(dataToUpdate.value)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** valor negociado */
    if (dataToUpdate.value_negotiated !== dataBeforeUpdate.value_negotiated) {
      const message = `O usuário ${responsible} alterou o valor negociado de R$ ${moneyFormat(
        dataBeforeUpdate.value_negotiated
      )} para R$ ${moneyFormat(dataToUpdate.value_negotiated)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** data de previsão */
    if (!moment(dataToUpdate.prevision).isSame(dataBeforeUpdate.prevision)) {
      const date01 = moment(dataBeforeUpdate.prevision).format("DD/MM/YYYY");
      const date02 = moment(dataToUpdate.prevision).format("DD/MM/YYYY");
      message = `O usuário ${responsible} alterou a data de previsão da reserva de ${date01} para ${date02}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** alteração do status */
    if (dataToUpdate.status !== dataBeforeUpdate.status) {
      message = `O usuário ${responsible} alterou o status da reserva de ${this.getStatus(
        dataBeforeUpdate.status
      )} para ${this.getStatus(dataToUpdate.status)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** alteração do tip de cliente */
    if (dataToUpdate.type_client !== dataBeforeUpdate.type_client) {
      message = `O usuário ${responsible} alterou o tipo de cliente de ${this.getTypeClient(
        dataBeforeUpdate.type_client
      )} para ${this.getTypeClient(dataToUpdate.type_client)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** responsável setor de cadastro */
    if (
      dataToUpdate.attendant_register !== dataBeforeUpdate.attendant_register
    ) {
      message = `O usuário ${responsible} alterou o responsável do cadastro de ${await this.getUser(
        dataBeforeUpdate.attendant_register
      )} para ${await this.getUser(dataToUpdate.attendant_register)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** responsável setor da recepção */
    if (
      dataToUpdate.attendant_reception !== dataBeforeUpdate.attendant_reception
    ) {
      message = `O usuário ${responsible} alterou o responsável da recepção de ${await this.getUser(
        dataBeforeUpdate.attendant_reception
      )} para ${await this.getUser(dataToUpdate.attendant_reception)}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    return messages;
  }

  /**
   * Mensagem de reserva assinada
   * @param {*} userId
   * @param {*} idRegister
   */
  static async getMessageAssignedReserve(
    dataBeforeUpdate,
    dataToUpdate,
    responsibleId,
    idRegister
  ) {
    const responsible = await this.getUser(responsibleId);
    const messages = [];
    let message;

    message = `O usuário ${responsible} alterou o status da reserva de ${this.getStatus(
      dataBeforeUpdate.status
    )} para ${this.getStatus(dataToUpdate.status)}`;

    const objectMessage = this.getObjectMessage(
      "system_action",
      message,
      responsibleId,
      idRegister
    );

    messages.push(objectMessage);
    return messages;
  }

  /**
   * Retorna a mensagem de cancelamento da reserva
   * @param {*} userId
   * @param {*} idRegister
   * @param {*} idReasonCancel
   * @param {*} observation
   */
  static async getCancelMessage(
    userId,
    idRegister,
    idReasonCancel,
    observation = null
  ) {
    const userName = await this.getUser(userId);
    const reasonData = await ReasonModel.query()
      .where({ id: idReasonCancel })
      .first();
    let message = `O usuário ${userName} CANCELOU a reserva motivo: ${reasonData.reason.toUpperCase()}`;

    return {
      type_action: "system_action",
      text: observation
        ? ` ${message} - OBSERVAÇÃO ADICIONAL: ${observation}`
        : message,
      module_name: "register_reserve",
      responsible: userId,
      id_register: idRegister
    };
  }

  /**
   * Retorna os status disponiveis
   * @param {*} status
   */
  static getStatus(status) {
    if (status === "r") return "RESERVA";
    if (status === "d") return "DOCUMENTAÇÃO";
    if (status === "a") return "ANALISE";
    if (status === "cd") return "CADASTRO";
    if (status === "p") return "PENDENTE";
    if (status === "as") return "ASSINADO";
    if (status === "ap") return "ASSINADO C/ PEND";
    if (status === "af") return "ATIV. FINAIS";
    if (status === "c") return "CANCELADO";
  }

  /**
   * Retorna o nome do tipo de cliente
   * @param {*} typeClient
   */
  static getTypeClient(typeClient) {
    if (typeClient === "pf") return "PESSOA FÍSICA";
    if (typeClient === "pj") return "PESSOA JURÍDICA";
  }

  /**
   * Retorna objeto da mensagem.
   * @param {*} type_action = historic or system_action
   * @param {*} text
   * @param {*} responsible
   * @param {*} idRegister
   */
  static getObjectMessage(type_action, text, responsible, idRegister) {
    return {
      type_action,
      text,
      module_name: "register_reserve",
      responsible,
      id_register: idRegister
    };
  }

  /**
   * Retorna o nome do usuário
   * @param {*} userId
   */
  static async getUser(userId) {
    const userData = await UserModel.query()
      .where({ id: userId })
      .first();
    return `${userData.name} ${userData.last_name}`.toUpperCase();
  }
}

module.exports = ReserveSystemActionService;
