"use strict";

class Create {
  get rules() {
    return {
      email: "required|email|unique:users",
      name: "required",
      last_name: "required",
      password: "required|min:6",
      password_confirm: "required|same:password",
      status: "required",
      admin: "required"
    };
  }

  get messages() {
    return {
      "email.required": "Informe o email",
      "email.unique": "Email em uso no sistema",
      "email.unique": "Email em uso no sistema",
      "name.required": "Informe o nome",
      "last_name.required": "Informe o sobrenome",
      "status.required": "Informe o status do usuário",
      "admin.required": "Informe o tipo de usuário",
      "password.required": "Informe a senha",
      "password_confirm.required": "Confirme a senha",
      "password_confirm.same": "Senhas não combinam"
    };
  }
}

module.exports = Create;
