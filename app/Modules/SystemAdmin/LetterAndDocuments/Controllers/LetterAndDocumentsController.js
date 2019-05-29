"use strict";

const Env = use("Env");
const Logger = use("App/Helpers/Logger");

const LetterModel = use(
  `${Env.get("ADMIN_MODULE")}/LetterAndDocuments/Models/Letter`
);

const LetterAndDocumentsService = use(
  `${Env.get(
    "ADMIN_MODULE"
  )}/LetterAndDocuments/Services/LetterAndDocumentsService`
);

class LetterAndDocumentsController {
  /**
   * Retorna o texto das cartas
   * @param {*} param0
   */
  async getTextLetter({ request }) {
    const requestData = request.all();
    if (requestData.type_document === "owner_notification_new_location") {
      return await LetterAndDocumentsService.ownerNewLocationText(
        requestData.type_document
      );
    }
  }

  /**
   * Faz a atualização do texto da carta
   * @param {*} param0
   */
  async updateTextLetter({ request, response, auth }) {
    const requestData = request.all();
    const userId = auth.user.id;

    /** verifica se a carta esta gravada na base de dados */
    const checkLetter = await LetterModel.query()
      .where({ type_letter: requestData.type_letter })
      .first();

    /** create */
    if (!checkLetter) {
      const dataCreated = {
        type_letter: requestData.type_letter,
        text: requestData.text,
        responsible: userId
      };

      try {
        await LetterModel.create(dataCreated);
      } catch (error) {
        Logger.create(error);
        return response.dispatch(500, "error: check system log");
      }
    }
    /** update */
    try {
      await LetterModel.query()
        .where({ type_letter: requestData.type_letter })
        .update({ text: requestData.text, responsible: userId });
      return response.dispatch(200, "success");
    } catch (error) {
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   * Define o texto da carta como padrão
   * @param {*} param0
   */
  async setDefaultTextLetter({ request, response }) {
    const requestData = request.all();
    const type_letter = requestData.type_document;

    try {
      await LetterModel.query()
        .where({ type_letter })
        .delete();
      return response.dispatch(200, "success");
    } catch (error) {
      console.log(error);
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }
}

module.exports = LetterAndDocumentsController;
