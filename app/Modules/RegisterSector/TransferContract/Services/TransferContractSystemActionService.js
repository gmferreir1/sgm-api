"use strict";

const Env = use("Env");
const moment = use("moment");
const { moneyFormat } = use("App/Helpers/String");

const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);
const ReasonModel = use(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`);

class TransferContractSystemActionService {
  /**
   * Retorna a mensagem de criação
   * @param {*} userId
   * @param {*} idRegister
   */
  static async getCreatedMessage(userId, idRegister) {
    const userName = await this.getUser(userId);
    return {
      type_action: "system_action",
      text: `O usuário ${userName} abriu a transferência`,
      module_name: "register_transfer",
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

    /** contrato */
    if (dataToUpdate.contract !== dataBeforeUpdate.contract) {
      const message = `O usuário ${responsible} alterou o contrato de ${
        dataBeforeUpdate.contract
      } para ${dataToUpdate.contract}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** codigo do imovel */
    if (dataToUpdate.immobile_code !== dataBeforeUpdate.immobile_code) {
      const message = `O usuário ${responsible} alterou o código do imóvel de ${
        dataBeforeUpdate.immobile_code
      } para ${dataToUpdate.immobile_code}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** endereço do imovel */
    if (dataToUpdate.address !== dataBeforeUpdate.address) {
      const message = `O usuário ${responsible} alterou o endereço do imóvel de ${
        dataBeforeUpdate.address
      } para ${dataToUpdate.address}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** bairro do imovel */
    if (dataToUpdate.neighborhood !== dataBeforeUpdate.neighborhood) {
      const message = `O usuário ${responsible} alterou o bairro do imóvel de ${
        dataBeforeUpdate.neighborhood
      } para ${dataToUpdate.neighborhood}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** valor aluguel */
    if (dataToUpdate.value !== dataBeforeUpdate.value) {
      const message = `O usuário ${responsible} alterou o valor do aluguel de R$ ${moneyFormat(
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

    /** código do proprietário */
    if (dataToUpdate.owner_code !== dataBeforeUpdate.owner_code) {
      const message = `O usuário ${responsible} alterou o código do proprietário de ${
        dataBeforeUpdate.owner_code
      } para ${dataToUpdate.owner_code}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** nome do proprietário */
    if (dataToUpdate.owner_name !== dataBeforeUpdate.owner_name) {
      const message = `O usuário ${responsible} alterou o nome do proprietário de ${
        dataBeforeUpdate.owner_name
      } para ${dataToUpdate.owner_name}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** código do solicitante */
    if (dataToUpdate.requester_code !== dataBeforeUpdate.requester_code) {
      const message = `O usuário ${responsible} alterou o código do solicitante de ${
        dataBeforeUpdate.requester_code
      } para ${dataToUpdate.requester_code}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** nome do solicitante */
    if (dataToUpdate.requester_name !== dataBeforeUpdate.requester_name) {
      const message = `O usuário ${responsible} alterou o nome do solicitante de ${dataBeforeUpdate.requester_name.toUpperCase()} para ${dataToUpdate.requester_name.toUpperCase()}`;

      const objectMessage = this.getObjectMessage(
        "system_action",
        message,
        responsibleId,
        idRegister
      );

      messages.push(objectMessage);
    }

    /** motivo da transferencia */
    if (dataToUpdate.reason_id !== dataBeforeUpdate.reason_id) {
      const message = `O usuário ${responsible} alterou o motivo da transferência de ${await this.getReasonName(
        dataBeforeUpdate.reason_id
      )} para ${await this.getReasonName(dataToUpdate.reason_id)}`;

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

    /** responsável */
    if (
      dataToUpdate.responsible_transfer !==
      dataBeforeUpdate.responsible_transfer
    ) {
      message = `O usuário ${responsible} alterou o responsável da transferência de ${await this.getUser(
        dataBeforeUpdate.responsible_transfer
      )} para ${await this.getUser(dataToUpdate.responsible_transfer)}`;

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
   * Retorna a mensagem de cancelamento da reserva
   * @param {*} userId
   * @param {*} idRegister
   * @param {*} idReasonCancel
   * @param {*} observation
   */
  static async getCancelMessage(userId, idRegister, observation = null) {
    const userName = await this.getUser(userId);

    let message = `O usuário ${userName} CANCELOU a transferência`;

    return {
      type_action: "system_action",
      text: observation
        ? ` ${message} - OBSERVAÇÃO ADICIONAL: ${observation}`
        : message,
      module_name: "register_transfer",
      responsible: userId,
      id_register: idRegister
    };
  }

  /**
   * Retorna os status disponiveis
   * @param {*} status
   */
  static getStatus(status) {
    if (status === "p") return "PENDENTE";
    if (status === "r") return "RESOLVIDO";
    if (status === "c") return "CANCELADO";
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
      module_name: "register_transfer",
      responsible,
      id_register: idRegister
    };
  }

  /**
   * Retorna o nome do motivo
   * @param {*} idReason
   */
  static async getReasonName(idReason) {
    const reasonData = await ReasonModel.query()
      .where({ id: idReason })
      .first();

    return reasonData.reason.toUpperCase();
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

module.exports = TransferContractSystemActionService;
