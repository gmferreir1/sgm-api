"use strict";

class AuthController {
  /**
   * Faz a autenticação
   * @param request
   * @param auth
   * @returns {Promise<*>}
   */
  async authenticate({ request, auth }) {
    const { login, password } = request.all();
    const userLogin = login.split("@");
    let finalLogin = null;

    if (userLogin.length > 1) {
      finalLogin = login;
    } else {
      finalLogin = `${userLogin[0]}@masterimoveis.com.br`;
    }

    return await auth.attempt(finalLogin, password);
  }

  /**
   * Retorna os dados do usuário logado
   * @param auth
   * @returns {Promise<*>}
   */
  async dataUserLogged({ auth }) {
    return await auth.user;
  }
}

module.exports = AuthController;
