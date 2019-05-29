"use strict";

const Model = use("Model");

class TypeImmobile extends Model {
  static get connection() {
    return "mysql_api_connection";
  }

  static get table() {
    return "types_immobiles";
  }
}

module.exports = TypeImmobile;
