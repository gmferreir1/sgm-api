"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TypesImmobilesSchema extends Schema {
  static get connection() {
    return "mysql_api_connection";
  }

  up() {
    this.create("types_immobiles", table => {
      table.increments();
      table.integer("value").notNullable();
      table.string("name").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("types_immobiles");
  }
}

module.exports = TypesImmobilesSchema;
