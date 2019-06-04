"use strict";

class CreateHistoric {
  get rules() {
    return {
      text: "required",
      id_register: "required"
    };
  }

  get messages() {
    return {
      "text.required": "Informe o histórico",
      "id_register.required": "Identificador da reserva não encontrado"
    };
  }
}

module.exports = CreateHistoric;
