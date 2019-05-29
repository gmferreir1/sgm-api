"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LettersSchema extends Schema {
  up() {
    this.create("letters", table => {
      table.increments();
      table.string("type_letter");
      table.text("text");
      table.integer("responsible");
      table.timestamps();
    });
  }

  down() {
    this.drop("letters");
  }
}

module.exports = LettersSchema;
