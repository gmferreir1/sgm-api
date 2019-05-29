"use strict";

class Login {
  get rules() {
    return {
      login: 'required',
      password: 'required|min:6'
    };
  }

  get messages() {
    return {
      "login.required": "Informe o usuário",
      "password.required": "Informe a senha",
      "password.min": "Senha menor do que 6 caracteres"
    };
  }
}

module.exports = Login;
