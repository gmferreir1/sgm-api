'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerminationDeadFilesSchema extends Schema {
  up() {
    this.create("termination_dead_files", (table) => {
      table.increments();
      table.integer("termination_id").notNullable();
      table.string("contract").notNullable();
      table.date("termination_date").notNullable();
      table.string("cashier").notNullable();
      table.string("file").notNullable();
      table.integer("year_release").notNullable();
      table.string("type_release").notNullable();
      table.boolean("status").default(1);
      table.integer("responsible_action").notNullable();
      table.timestamps();
    })
  }

  down() {
    this.drop("termination_dead_files")
  }
}

module.exports = TerminationDeadFilesSchema
