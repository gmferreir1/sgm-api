'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RegisterTransferSchema extends Schema {
  up() {
    this.create('register_transfers', (table) => {
      table.increments();
      table.string("contract");
      table.string("immobile_code");
      table.string("address");
      table.string("neighborhood");
      table.decimal("value", 15, 2);
      table.string("owner_name");
      table.string("owner_phone_01", 50);
      table.string("owner_phone_02", 50).nullable();
      table.string("owner_phone_03", 50).nullable();
      table.string("owner_email").nullable();
      table.date("transfer_date");
      table.integer("reason_id");
      table.string("status", 10).default("p");
      table.integer("responsible_transfer");
      table.string("requester_name");
      table.string("requester_phone_01", 50);
      table.string("requester_phone_02", 50).nullable();
      table.string("requester_phone_03", 50).nullable();
      table.string("requester_email").nullable();
      table.string("new_contract").nullable();
      table.date("end_process").nullable();
      table.integer("responsible");
      table.timestamps()
    })
  }

  down() {
    this.drop('register_transfers')
  }
}

module.exports = RegisterTransferSchema
