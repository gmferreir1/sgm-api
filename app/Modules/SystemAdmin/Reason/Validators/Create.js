"use strict";

class Create {
  get rules() {
    return {
      reason: "required | max: 150",
      type_reason: "required",
      module_name: "required"
    };
  }

  get messages() {
    return {
      "reason.required": "Informe o motivo",
      "type_reason.required": "Informe o tipo de motivo",
      "reason.max": "Motivo máximo de 150 caracteres"
    };
  }
}

module.exports = Create;
