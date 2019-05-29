"use strict";

const Model = use("Model");

class Letter extends Model {
  static get table() {
    return "letters";
  }
}

module.exports = Letter;
