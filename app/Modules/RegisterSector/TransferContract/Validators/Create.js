"use strict";

class Create {
  get rules() {
    return {
      contract: "required",
      immobile_code: "required",
      address: "required",
      neighborhood: "required",
      value: "required",
      owner_code: "required",
      owner_name: "required",
      owner_phone_01: "required",
      transfer_date: "required",
      reason_id: "required",
      responsible_transfer: "required",
      requester_name: "required",
      requester_phone_01: "required"
    };
  }

  get messages() {
    return {
      "contract.required": "Informe o contrato",
      "immobile_code.required": "Informe o código do imóvel",
      "address.required": "Informe o endereço",
      "neighborhood.required": "Informe o bairro",
      "value.required": "Informe o valor do aluguel",
      "owner_code.required": "Informe o código do proprietário",
      "owner_name.required": "Informe o nome do proprietário",
      "owner_phone_01.required": "Informe o telefone do proprietário",
      "transfer_date.required": "Informe a data da transferência",
      "reason_id.required": "Informe o motivo da transferência",
      "responsible_transfer.required": "Informe o responsavel da transferência",
      "requester_name.required": "Informe o solicitante",
      "requester_phone_01.required": "Informe o telefone do solicitante"
    };
  }
}

module.exports = Create;
