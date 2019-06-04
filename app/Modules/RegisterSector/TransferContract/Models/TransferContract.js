"use strict";

const Env = use("Env");

const Model = use("Model");

class TransferContract extends Model {
  static get table() {
    return "register_transfers";
  }

  reasonTransfer() {
    return this.hasOne(`${Env.get("ADMIN_MODULE")}/Reason/Models/Reason`, "reason_id", "id")
      .where({ module_name: "transfer_contract", type_reason: "transfer_contract" });
  }

  responsibleTransfer() {
    return this.hasOne(`${Env.get("ADMIN_MODULE")}/User/Models/User`, "responsible_transfer", "id");
  }
}

module.exports = TransferContract;
