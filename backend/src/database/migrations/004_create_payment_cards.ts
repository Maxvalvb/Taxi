import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('payment_cards', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('last4').notNullable();
    table.enum('brand', ['mastercard', 'visa', 'unknown']).defaultTo('unknown');
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);
    
    table.index(['user_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('payment_cards');
}