'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsReserveSchema extends Schema {
  up () {
    this.table('register_reserves', (table) => {
      table.string("client_cnpj").after("client_cpf").nullable();
    })
  }

  down () {
    this.table('register_reserves', (table) => {
      table.dropColumns(["client_cnpj"]);
    })
  }
}

module.exports = AddFieldsReserveSchema
