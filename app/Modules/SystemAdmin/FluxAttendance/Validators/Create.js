"use strict";

class Create {
  get rules() {
    return {
      user: "required",
      score: "required",
      module_name: "required"
    };
  }

  get messages() {
    return {
      "user.required": "Informe o usuário",
      "score.required": "Informe o score",
      "module_name.required": "Informe o nome do modulo"
    };
  }
}

module.exports = Create;
