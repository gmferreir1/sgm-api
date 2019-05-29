"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddFieldsRegisterReserveSchema extends Schema {
  up() {
    this.table("register_reserves", table => {
      table.string("owner_code").nullable();
      table.string("owner_name").nullable();
      table.string("tenant_code").nullable();
      table.string("tenant_name").nullable();
      table.string("subscription_iptu").nullable();
    });
  }

  down() {
    this.table("register_reserves", table => {
      this.dropColumn([
        "owner_code",
        "owner_name",
        "tenant_code",
        "tenant_name",
        "subscription_iptu"
      ]);
    });
  }
}

module.exports = AddFieldsRegisterReserveSchema;
