"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddContractCelebratedsSchema extends Schema {
  up() {
    this.table("register_reserve_contract_celebrateds", table => {
      table
        .boolean("opened")
        .default(false)
        .after("rp_release_reserve");
      table
        .text("observation")
        .nullable()
        .after("rp_release_reserve");
      table.boolean("low_ticket").default(false);
      table.boolean("low_tx_contract").default(false);
      table.boolean("low_bank_expense").default(false);
    });
  }

  down() {
    this.table("register_reserve_contract_celebrateds", table => {
      table.dropColumn([
        "opened",
        "observation",
        "low_ticket",
        "low_tx_contract",
        "low_bank_expense"
      ]);
    });
  }
}

module.exports = AddContractCelebratedsSchema;
