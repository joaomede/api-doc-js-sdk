import * as Knex from 'knex'

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('paths', table => {
    table.json('query').notNullable()
  })
}

export async function down (knex: Knex): Promise<void> {
  return knex.schema.table('paths', table => {
    table.dropColumn('query')
  })
}
