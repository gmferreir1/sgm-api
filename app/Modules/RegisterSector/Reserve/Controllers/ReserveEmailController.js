"use strict";

const Env = use("Env");
const Mail = use("Mail");
const Helpers = use("Helpers");
const Logger = use("App/Helpers/Logger");
const Database = use("Database");

const SystemActionModel = use(
  `${Env.get("ADMIN_MODULE")}/SystemAction/Models/SystemAction`
);

class ReserveEmailController {
  /**
   * Faz o envio do email
   * @param {*} param0
   */
  async sendEmail({ request, response, auth }) {
    const requestData = request.all();
    const dataForMail = JSON.parse(requestData.data);
    let subject;
    let view;
    let dataEmail;

    const signature = `Atenciosamente, 
      <p style='font-weight: bold'>${auth.user.name.toUpperCase()} ${auth.user.last_name.toUpperCase()}</p>
    `;

    if (dataForMail.type_email === "owner_notification_new_location") {
      subject = "Aviso de Locação";
      view = "RegisterSector.Email.owner_notification_new_location";

      dataEmail = {
        text: dataForMail.text_email,
        signature
      };
    }

    if (dataForMail.type_email === "welcome_tenant") {
      subject = "Bem Vindo a Master netimóveis";
      view = "RegisterSector.Email.welcome_tenant";

      dataEmail = {
        client_name: dataForMail.client_name,
        signature
      };
    }

    const trx = await Database.beginTransaction();

    try {
      Mail.send(view, { data: dataEmail }, message => {

        if (dataForMail.type_email === "owner_notification_new_location") {
          message.embed(Helpers.resourcesPath("images/logo.png"), "logo");
        }

        if (dataForMail.type_email === "welcome_tenant") {
          message.embed(Helpers.resourcesPath('images/welcome.png'), 'welcome');
          message.attach(Helpers.resourcesPath('attachment/manual_locatario.pdf'))
        }

        message
          .to(dataForMail.client_email)
          .bcc(auth.user.email)
          .from("sigem@masterimoveis.com.br")
          .subject(subject);
      });

      const typeEmail =
        dataForMail.type_email === "owner_notification_new_location"
          ? "Notificação ao proprietário da nova locação"
          : "Boas vindas ao inquilino";

      /** Gravar no historico o envio do email */
      const dataHistoric = {
        text: `O usuário ${auth.user.name.toUpperCase()} ${auth.user.last_name.toUpperCase()} enviou o email de ${typeEmail}`,
        type_action: "system_action",
        module_name: "register_reserve",
        responsible: auth.user.id,
        id_register: dataForMail.reserve_id
      };

      await SystemActionModel.create(dataHistoric, trx);

      trx.commit();
      return response.dispatch(200, "success");
    } catch (error) {
      trx.rollback();
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }
}

module.exports = ReserveEmailController;
