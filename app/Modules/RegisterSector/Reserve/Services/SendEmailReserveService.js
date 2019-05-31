"use strict";

const Env = use("Env");
const Promise = use("bluebird");
const { moneyFormat } = use("App/Helpers/String");
const { dateFormat } = use("App/Helpers/DateTime");

const LetterAndDocumentsService = use(
  `${Env.get(
    "ADMIN_MODULE"
  )}/LetterAndDocuments/Services/LetterAndDocumentsService`
);

class SendEmailReserveService {
  /**
   * Retorna o texto para a notificação ao proprietário
   * @param {*} data
   */
  static async textOwnerNotification(data) {
    const defaultText = await LetterAndDocumentsService.ownerNewLocationText(
      "owner_notification_new_location"
    );

    const search = [
      "@@_NOME_PROPRIETARIO",
      "@@_CONTRATO",
      "@@_ENDERECO_IMOVEL",
      "@@_BAIRRO_IMOVEL",
      "@@_CEP",
      "@@_CIDADE",
      "@@_ESTADO",
      "@@_VALOR_ALUGUEL",
      "@@_PRAZO_CONTRATO",
      "@@_DATA_INICIO_CONTRATO",
      "@@_DATA_FIM_CONTRATO",
      "@@_DATA_PRIMEIRO_ALUGUEL",
      "@@_CLAUSULA_ISENCAO"
    ];

    const replace = [
      data.owner_name ? data.owner_name.toUpperCase() : "",
      data.contract ? data.contract.toUpperCase() : "",
      data.address ? data.address.toUpperCase() : "",
      data.neighborhood ? data.neighborhood.toUpperCase() : "",
      data.zip_code,
      data.city ? data.city.toUpperCase() : "",
      data.state ? data.state.toUpperCase() : "",
      moneyFormat(data.value_negotiated),
      data.deadline,
      dateFormat(data.date_init_contract),
      dateFormat(data.date_end_contract),
      dateFormat(data.date_primary_rent),
      data.isent_clause
    ];

    
    let text = defaultText;

    await Promise.each(search, async (value, index) => {
      if (replace[index]) {
        if (typeof replace[index] === "string") {
          text = text.replace(value, replace[index].trim());
        } else {
          text = text.replace(value, replace[index]);
        }
      }
    });

    return text;
  }
}

module.exports = SendEmailReserveService;
