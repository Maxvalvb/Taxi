import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('chat_messages', (table) => {
    table.string('id').primary();
    table.string('ride_id').notNullable().references('id').inTable('rides').onDelete('CASCADE');
    table.string('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.enum('sender_type', ['client', 'driver']).notNullable();
    table.text('message').notNullable();
    table.timestamps(true, true);
    
    table.index(['ride_id']);
    table.index(['sender_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('chat_messages');
}