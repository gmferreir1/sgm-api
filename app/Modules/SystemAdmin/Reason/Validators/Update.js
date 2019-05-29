"use strict";

class Update {
  get rules() {
    return {
      id: "required",
      reason: "required | max: 150",
      type_reason: "required",
      module_name: "required"
    };
  }

  get messages() {
    return {
      "id.required": "Informe o identificador do motivo",
      "reason.required": "Informe o motivo",
      "type_reason.required": "Informe o tipo de motivo",
      "reason.max": "Motivo máximo de 150 caracteres"
    };
  }
}

module.exports = Update;
