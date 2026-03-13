import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table.dropColumn('diet')
  })

  await knex.schema.alterTable('snacks', (table) => {
    table.boolean('diet').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table.dropColumn('diet')
  })

  await knex.schema.alterTable('snacks', (table) => {
    table.enum('diet', ['true', 'false']).notNullable()
  })
}
