"use strict";

class Update {
  get rules() {
    return {
      id: "required",
      user: "required",
      score: "required",
      module_name: "required"
    };
  }

  get messages() {
    return {
      "id.required": "Informe o identificador do usuário",
      "score.required": "Informe o score",
      "module_name.required": "Informe o nome do modulo"
    };
  }
}

module.exports = Update;
