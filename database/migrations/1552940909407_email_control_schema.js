'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema")

class EmailControlSchema extends Schema {
  up() {
    this.create("email_controls", (table) => {
      table.increments();
      table.string("type_email");
      table.string("type_email_for_search").nullable();
      table.integer("responsible");
      table.string("module_name");
      table.integer("id_register");
      table.timestamps();
    })
  }

  down() {
    this.drop("email_controls")
  }
}

module.exports = EmailControlSchema
