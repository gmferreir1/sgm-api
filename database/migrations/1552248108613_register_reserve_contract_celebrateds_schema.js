"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RegisterReserveContractCelebratedsSchema extends Schema {
  up() {
    this.create("register_reserve_contract_celebrateds", table => {
      table.increments();
      table.integer("reserve_id").notNullable();
      table.string("contract");
      table.string("immobile_code");
      table.string("address");
      table.string("neighborhood");
      table.string("owner_name");
      table.date("conclusion");
      table.string("ticket", 10);
      table.string("tx_contract", 10);
      table.string("bank_expense", 10);
      table.string("subscription_iptu");
      table.integer("period_contract");
      table.date("delivery_key").comment("conclusão do processo");
      table.integer("responsible");
      table.string("status_general", 10).default("p").comment("(p) pending, (r) release");
      table.string("status_iptu", 10).default("p").comment("(p) pending, (r) release");
      table.string("status_tcrs", 10).default("p").comment("(p) pending, (r) release");
      table.date("date_init_contract");
      table.date("due_date_rent");
      table.string("loyalty_discount", 10);
      table.integer("rp_release_reserve");
      table.timestamps();
    });
  }

  down() {
    this.drop("register_reserve_contract_celebrateds");
  }
}

module.exports = RegisterReserveContractCelebratedsSchema;
