"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ReasonSchema extends Schema {
  up() {
    this.create("reasons", table => {
      table.increments();
      table.string("reason");
      table.string("module_name").comment("nome do modulo que o cancelamento pertence");
      table.string("type_reason").comment("tipo do motivo cadastrado: ex, cancel, transfer ...")
      table.integer("responsible");
      table.timestamps();
    });
  }

  down() {
    this.drop("reasons");
  }
}

module.exports = ReasonSchema;
