"use strict";

class Create {
  get rules() {
    return {
      crm_code: "required",
      owner_code: "required",
      owner_name: "required",
      immobile_code: "required",
      address: "required",
      neighborhood: "required",
      type_location: "required",
      immobile_type: "required",
      value_negotiated: "required",
      value: "required",
      date_reserve: "required",
      prevision: "required",
      status: "required",
      type_client: "required",
      client_name: "required",
      client_phone_01: "required",
      attendant_register: "required",
      attendant_reception: "required"
    };
  }

  get messages() {
    return {
      "crm_code.required": "Informe o código do CRM",
      "owner_code.required": "Informe o código do proprietário",
      "owner_name.required": "Informe o nome do proprietário",
      "immobile_code.required": "Informe o código do imóvel",
      "address.required": "Informe o endereço",
      "neighborhood.required": "Informe o bairro",
      "type_location.required": "Informe o tipo de locação",
      "immobile_type.required": "Informe o tipo de imóvel",
      "value_negotiated.required": "Informe o valor negociado",
      "value.required": "Informe o valor",
      "date_reserve.required": "Informe a data da reserva",
      "prevision.required": "Informe a data da previsão",
      "status.required": "Informe o status",
      "type_client.required": "Informe o tipo de cliente",
      "client_name.required": "Informe o nome do cliente",
      "client_phone_01.required": "Informe o telefone do cliente",
      "attendant_register.required":
        "Informe o responsável do setor de cadastro",
      "attendant_reception.required":
        "Informe o responsável do setor da recepção"
    };
  }
}

module.exports = Create;
