"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddFieldsRegisterTransferSchema extends Schema {
  up() {
    this.table("register_transfers", table => {
      table
        .integer("owner_code")
        .after("value")
        .notNullable();
      table
        .integer("requester_code")
        .after("responsible_transfer")
        .nullable();
    });
  }

  down() {
    this.table("register_transfers", table => {
      table.dropColumn(["owner_code", "requester_code"]);
    });
  }
}

module.exports = AddFieldsRegisterTransferSchema;
