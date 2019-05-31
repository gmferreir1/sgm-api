"use strict";

const Model = use("Model");

class Immobile extends Model {

  static get connection() {
    return "mysql_api_connection";
  }

  static get table() {
    return "immobiles";
  }

}

module.exports = Immobile;
