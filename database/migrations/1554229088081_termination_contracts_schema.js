'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TerminationContractsSchema extends Schema {
  up() {
    this.create('termination_contracts', (table) => {
      table.increments();
      table.string("contract").notNullable();
      table.string("immobile_code").notNullable();
      table.string("address").notNullable();
      table.string("neighborhood").notNullable();
      table.decimal("value", 12, 2).notNullable();
      table.integer("type_immobile").notNullable();
      table.string("type_location", 10).notNullable();
      table.string("owner_name").notNullable();
      table.string("owner_phone_01", 55).notNullable();
      table.string("owner_phone_02", 55).nullable();
      table.string("owner_phone_03", 55).nullable();
      table.string("owner_email").nullable();
      table.string("tenant_name").notNullable();
      table.string("tenant_phone_01", 55).notNullable();
      table.string("tenant_phone_02", 55).nullable();
      table.string("tenant_phone_03", 55).nullable();
      table.string("tenant_email").nullable();
      table.string("type_register").notNullable();
      table.integer("rp_register_sector").nullable();
      table.string("new_contract_code").nullable();
      table.integer("reason").notNullable();
      table.string("rent_again", 10).notNullable();
      table.integer("destination").nullable();
      table.string("caveat", 10).notNullable();
      table.integer("surveyor").nullable();
      table.boolean("release_survey").default(false);
      table.integer("rp_per_inactive").notNullable();
      table.string("status").notNullable();
      table.date("termination_date").notNullable();
      table.date("end_process").nullable();
      table.text("observation").nullable();
      table.integer("rp_last_action").notNullable();
      table.timestamps();
    })
  }

  down() {
    this.drop('termination_contracts')
  }
}

module.exports = TerminationContractsSchema
