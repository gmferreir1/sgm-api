'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TerminationContractRentAccessoriesSchema extends Schema {
  up() {
    this.create("termination_contract_rent_accessories", (table) => {
      table.increments();
      table.text("fine_termination").nullable();
      table.string("fine_termination_type_debit", 10).nullable();
      table.decimal("fine_termination_value_debit", 15, 2).nullable();
      table.text("condominium").nullable();
      table.string("condominium_type_debit", 10).nullable();
      table.decimal("condominium_value_debit", 15, 2).nullable();
      table.text("copasa").nullable();
      table.decimal("copasa_value_debit", 15, 2).nullable();
      table.text("cemig").nullable();
      table.decimal("cemig_value_debit", 15, 2).nullable();
      table.text("iptu").nullable();
      table.string("iptu_type_debit", 10).nullable();
      table.decimal("iptu_value_debit", 15, 2).nullable();
      table.text("garbage_rate").nullable();
      table.string("garbage_rate_type_debit", 10).nullable();
      table.decimal("garbage_rate_value_debit", 15, 2);
      table.text("pendencies").nullable();
      table.string("pendencies_type_debit", 10).nullable();
      table.decimal("pendencies_value_debit", 15, 2).nullable();
      table.text("paint").nullable();
      table.string("paint_type_debit", 5).nullable();
      table.decimal("paint_value_debit", 15, 2).nullable();
      table.text("value_rent").nullable();
      table.string("value_rent_type_debit", 10).nullable();
      table.decimal("value_rent_value_debit", 15, 2).nullable();
      table.integer("keys_delivery").nullable();
      table.integer("control_gate").nullable();
      table.integer("control_alarm").nullable();
      table.integer("key_manual_gate").nullable();
      table.integer("fair_card").nullable();
      table.string("new_address").nullable();
      table.string("new_neighborhood").nullable();
      table.string("new_city").nullable();
      table.string("new_state", 10).nullable();
      table.string("new_zip_code", 150).nullable();
      table.integer("termination_id");
      table.integer("rp_last_action");
      table.timestamps();
    })
  }

  down() {
    this.drop("termination_contract_rent_accessories");
  }
}

module.exports = TerminationContractRentAccessoriesSchema
