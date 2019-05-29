"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class SystemActionsSchema extends Schema {
  up() {
    this.create("system_actions", table => {
      table.increments();
      table.text("text").notNullable();
      table.string("type_action").default("system_action").comment("historic or system_action");
      table.string("module_name").nullable();
      table.integer("responsible").notNullable();
      table.integer("id_register").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("system_actions");
  }
}

module.exports = SystemActionsSchema;
