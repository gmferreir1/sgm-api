'use strict'

const Env = use("Env");
const Logger = use("App/Helpers/Logger");
const { toLowerCase } = use("App/Helpers/String");
const Hash = use("Hash");
const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);
const UserQueryService = use(`${Env.get("ADMIN_MODULE")}/User/Services/UserQueryService`);


class UserController {

  async queryEmailExists({ request, response }) {
    const requestData = toLowerCase(request.only("email"));
    const check = await UserQueryService.queryEmailExists(requestData.email);
    if (check) {
      return response.dispatch(400, check);
    }
  }

  /**
   * Cria um usuário no sistema
   * @param {*} param0 
   */
  async create({ request, response }) {
    const requestData = toLowerCase(request.all());
    delete requestData.password_confirm;

    try {
      const dataCreated = await UserModel.create(requestData);
      return {
        id: dataCreated.id,
        name: dataCreated.name
      }
    } catch (error) {
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   * Atualiza dados de um usuário
   * @param {*} param0 
   */
  async update({ request, response, auth }) {
    let requestData = request.all();
    const password = requestData.password;
    requestData = toLowerCase(requestData);

    delete requestData.email;
    delete requestData.password_confirm;

    // verifica se o usuário alterou a senha
    if (password !== "no_change_password") {
      requestData.password = await Hash.make(password);
    } else {
      delete requestData.password;
    }

    try {
      const dataUpdated = await UserModel.query()
        .where({ id: requestData.id })
        .update(requestData);
      return {
        id: dataUpdated.id,
        name: dataUpdated.name
      }
    } catch (error) {
      Logger.create(error);
      return response.dispatch(500, "error: check system log");
    }
  }

  /**
   * Lista todos os usuários do sistema
   * @param {*} param0 
   */
  async all({ request }) {
    const requestData = request.all();
    let status = true;

    // se o usuário não passar o status do usuário  sistema lista somente os ativos
    if (requestData.status) {
      status = requestData.status;
    }

    return await UserModel.query()
      .where({ status })
      .where("name", "like", "%" + requestData.input + "%")
      .orWhere("last_name", "like", "%" + requestData.input + "%")
      .orWhere("email", "like", "%" + requestData.input + "%")
      .select("id", "email", "name", "last_name", "status", "admin")
      .orderBy("name", "asc")
      .fetch();
  }

  /**
   * Lista apenas um usuário do sistema pelo ID
   * @param {*} param0 
   */
  async find({ params }) {
    const id = params.id;
    const data = await UserModel.query()
      .where({ id })
      .select("id", "name", "last_name", "email", "admin", "status")
      .first();
    
    let json = data.toJSON();
    json.password = "no_change_password";
    json.password_confirm = "no_change_password";
    return json;
  }

}

module.exports = UserController
