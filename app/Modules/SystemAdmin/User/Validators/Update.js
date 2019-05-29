"use strict";

class Update {
  get rules() {
    return {
      name: "required",
      last_name: "required",
      password: "required|min:6",
      password_confirm: "required|same:password",
      admin: "required"
    };
  }

  get messages() {
    return {
      "name.required": "Informe o nome",
      "last_name.required": "Informe o sobrenome",
      "admin.required": "Informe o tipo de usuário",
      "password.required": "Informe a senha",
      "password_confirm.required": "Confirme a senha",
      "password_confirm.same": "Senhas não combinam"
    };
  }
}

module.exports = Update;
