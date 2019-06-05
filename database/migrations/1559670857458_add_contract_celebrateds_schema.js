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
    });
  }

  down() {
    this.table("register_reserve_contract_celebrateds", table => {
      table.dropColumn(["opened", "observation"]);
    });
  }
}

module.exports = AddContractCelebratedsSchema;
