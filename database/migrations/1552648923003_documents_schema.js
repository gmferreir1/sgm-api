'use strict'

/** @type {import("@adonisjs/lucid/src/Schema")} */
const Schema = use("Schema")

class DocumentsSchema extends Schema {
  up() {
    this.create("documents", (table) => {
      table.increments()
      table.string("type_document");
      table.text("text");
      table.integer("responsible");
      table.timestamps()
    })
  }

  down() {
    this.drop("documents")
  }
}

module.exports = DocumentsSchema
