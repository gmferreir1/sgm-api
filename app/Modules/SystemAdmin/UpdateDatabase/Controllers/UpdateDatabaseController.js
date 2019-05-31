"use strict";

const Env = use("Env");
const Helpers = use("Helpers");
const fs = use("fs");
const Logger = use("App/Helpers/Logger");
const Promise = use("bluebird");

const ImoviewAPIDataService = use(
  `${Env.get("API_EXTERNAL_MODULE")}/Services/ImoviewAPIDataService`
);

const TypesImmobileModel = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Models/TypeImmobile`
);

const UpdateDatabaseService = use(
  `${Env.get("ADMIN_MODULE")}/UpdateDatabase/Services/UpdateDatabaseService`
);

class UpdateDatabaseController {
  constructor() {
    this.serviceAPI = new ImoviewAPIDataService();
  }

  /**
   * Atualiza a base de dados de acordo com a seleção do usuário
   * @param {*} param0
   */
  async updateDatabase({ request, response }) {
    const requestData = request.all();

    /** Tipos de imovel */
    if (requestData && requestData.type_update === "types_immobile") {
      const typesImmobileData = await this.serviceAPI.getTypesImmobile();
      if (typesImmobileData.lista.length) {
        const data = typesImmobileData.lista;
        try {
          await TypesImmobileModel.truncate();

          await Promise.each(data, async value => {
            await TypesImmobileModel.create({
              value: value.codigo,
              name: value.nome.toLowerCase()
            });
          });
        } catch (error) {
          Logger.create(error);
          return response.dispatch(500, "error: check system log");
        }
      }
    }
  }

  /**
   * Envia o arquivo excel para a base de dados
   * @param {*} param0
   */
  async fileUpload({ request, response, auth }) {
    const path = Helpers.appRoot("files-uploaded/");

    /** verifica se o diretorio existe para criar */
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, "777");
    }

    const validationOptions = {
      extnames: ["xlsx"]
    };

    const dataFile = request.file("attachment", validationOptions);
    const extension = dataFile.extname;

    const fullFileName = dataFile.clientName.split(".");
    const fileName = `${fullFileName[0]}.${fullFileName[1]}`;

    const fileAndPath = `${path}${fileName}`;

    await dataFile.move(path, {
      overwrite: true
    });

    if (!dataFile.moved()) {
      const error = dataFile.error();
      if (error.type === "extname") {
        return response
          .status(400)
          .json([{ message: "Tipo de arquivo não permitido" }]);
      }
    }
    /** define permissões do arquivo **/
    fs.chmodSync(`${path}${fullFileName[0]}.${extension}`, "777");

    const readFile = await UpdateDatabaseService.readExcelFile(fileAndPath);
    if (readFile.error) {
      return response.dispatch(500, "error: check system log");
    }
    return response.dispatch(200, "success");
  }
}

module.exports = UpdateDatabaseController;
