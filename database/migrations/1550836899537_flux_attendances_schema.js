"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class FluxAttendancesSchema extends Schema {
  up() {
    this.create("flux_attendances", table => {
      table.increments();
      table.integer("user").notNullable();
      table.integer("score").notNullable();
      table.string("module_name").notNullable();
      table.integer("rp_last_action").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("flux_attendances");
  }
}

module.exports = FluxAttendancesSchema;
