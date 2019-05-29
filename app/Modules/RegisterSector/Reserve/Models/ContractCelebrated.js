"use strict";
const Model = use("Model");

class Reserve extends Model {
  static get table() {
    return "register_reserve_contract_celebrateds";
  }
}

module.exports = Reserve;
