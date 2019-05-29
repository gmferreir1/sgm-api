"use strict";

const Schema = use("Schema");

class ControlUpdateSchema extends Schema {
  up() {
    this.create("control_updates", table => {
      table.increments();
      table.string("table_name").notNullable();
      table.datetime("date").notNullable();
      table.string("status").default("updating").comment("updating; updated; fail");
      table.integer("responsible").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("control_updates");
  }
}

module.exports = ControlUpdateSchema;
