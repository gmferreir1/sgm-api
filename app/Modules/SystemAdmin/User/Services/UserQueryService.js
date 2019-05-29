"use strict";

const Env = use("Env");
const UserModel = use(`${Env.get("ADMIN_MODULE")}/User/Models/User`);

class UserQueryService {

  /**
   * Verifica se o email ja esta cadastrado para algum usuário
   * @param {*} email 
   */
  static async queryEmailExists(email) {
    const check = await UserModel.query().where({ email }).first();
    if (check) {
      return "Email em uso no sistema";
    }
  }

}

module.exports = UserQueryService;