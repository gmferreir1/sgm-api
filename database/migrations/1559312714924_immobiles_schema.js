"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ImmobilesSchema extends Schema {
  static get connection() {
    return "mysql_api_connection";
  }

  up() {
    this.create("immobiles", table => {
      table.increments();
      table.integer("immobile_code");
      table.string("immobile_code_extra").nullable();
      table.string("type_location", 10);
      table.integer("immobile_type");
      table.string("indicator_key").nullable();
      table.integer("number_keys").nullable();
      table.integer("number_controls").nullable();
      table.decimal("value_rent", 15, 2);
      table.decimal("value_condominium", 15, 2).nullable();
      table.decimal("value_iptu", 15, 2).nullable();
      table.string("index_iptu").nullable();
      table.integer("tx_administration").nullable();
      table.integer("tx_intermediation").nullable();
      table.string("zip_code").nullable();
      table.string("address");
      table.string("neighborhood");
      table.string("city");
      table.string("state");
      table.timestamps();
    });
  }

  down() {
    this.drop("immobiles");
  }
}

module.exports = ImmobilesSchema;
