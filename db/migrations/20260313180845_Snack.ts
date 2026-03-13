import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('snacks', (table) => {
    table.uuid('id').primary()
    table.uuid('userId').notNullable()
    table.foreign('userId').references('id').inTable('users')
    table.string('name').notNullable()
    table.text('description')
    table.datetime('dateTime')
    table.enum('diet', [true, false])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('snacks')
}
