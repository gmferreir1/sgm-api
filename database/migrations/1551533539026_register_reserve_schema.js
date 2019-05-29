"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RegisterReserveSchema extends Schema {
  up() {
    this.create("register_reserves", table => {
      table.increments();
      table.string("crm_code").nullable();
      table.string("immobile_code");
      table.string("address");
      table.string("neighborhood");
      table.decimal("value", 15, 2);
      table.decimal("value_negotiated", 15, 2);
      table.string("type_location", 10);
      table.integer("immobile_type").nullable();
      table.integer("code_reserve").nullable();
      table.integer("year_reserve").nullable();
      table.date("date_reserve");
      table.date("prevision");
      table
        .date("conclusion")
        .nullable()
        .comment("data da entrega das chaves");
      table
        .string("status")
        .comment(
          "r = reserva, d = documentação, a = analise, cd = cadastro, p = pendente, as = assinado, ap = assinado com pendencias, af = atividades finais, c = cancelado"
        );
      table.string("contract").nullable();
      table
        .integer("deadline")
        .nullable()
        .comment("prazo de contrato");
      table.integer("taxa").nullable();
      table.string("observation").nullable();
      table.string("origin_city").nullable();
      table.string("origin_state").nullable();
      table.string("finality").nullable();
      table.string("type_client");
      table.string("client_name");
      table.string("client_cpf").nullable();
      table.string("client_cnpj").nullable();
      table.string("client_rg").nullable();
      table.string("client_profession").nullable();
      table.string("client_company").nullable();
      table.string("client_address").nullable();
      table.string("client_zip_code").nullable();
      table.string("client_neighborhood").nullable();
      table.string("client_city").nullable();
      table.string("client_state").nullable();
      table.string("client_phone_01").nullable();
      table.string("client_phone_02").nullable();
      table.string("client_phone_03").nullable();
      table.string("client_email").nullable();
      table.integer("attendant_register");
      table.integer("attendant_reception");
      table.date("date_init_contract").nullable();
      table
        .date("end_process")
        .nullable()
        .comment("data da finalização do processo");
      table.integer("id_reason_cancel").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("register_reserves");
  }
}

module.exports = RegisterReserveSchema;
