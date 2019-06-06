"use strict";

const Env = use("Env");
const Helpers = use("Helpers");
const Promise = use("bluebird");
const Mail = use("Mail");
const Logger = use("App/Helpers/Logger");
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

  /**
   * Envia um email para o financeiro e o apoio informando de que o contrato foi celebrado
   * @param {*} reserveData
   */
  static sendEmailEndReserve(reserveData) {
    let subject;
    let view;

    subject = "Novo contrato celebrado";
    view = "RegisterSector.Email.new_contract_celebrated";

    console.log(Env.get("FINANCE_EMAIL"))

    try {
      Mail.send(view, { data: reserveData }, message => {
        message.embed(Helpers.resourcesPath("images/logo.png"), "logo");

        message
          .to(Env.get("FINANCE_EMAIL"))
          .cc(Env.get("APOIO_EMAIL"))
          .cc(Env.get("FINANCE_EMAIL_2"))
          .from("sigem@masterimoveis.com.br")
          .subject(subject);
      });
    } catch (error) {
      console.log(error)
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }
}

module.exports = SendEmailReserveService;
