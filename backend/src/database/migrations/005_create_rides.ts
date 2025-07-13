import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('rides', (table) => {
    table.string('id').primary();
    table.string('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('driver_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('pickup').notNullable();
    table.string('destination').notNullable();
    table.decimal('pickup_lat', 10, 8).notNullable();
    table.decimal('pickup_lng', 11, 8).notNullable();
    table.decimal('destination_lat', 10, 8).notNullable();
    table.decimal('destination_lng', 11, 8).notNullable();
    table.decimal('fare', 10, 2).notNullable();
    table.enum('ride_type', ['Эконом', 'Комфорт', 'Бизнес']).notNullable();
    table.enum('payment_method', ['CARD', 'CASH']).notNullable();
    table.enum('status', ['PENDING', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).defaultTo('PENDING');
    table.integer('estimated_duration');
    table.integer('actual_duration');
    table.decimal('distance', 8, 2);
    table.timestamp('scheduled_for');
    table.timestamp('started_at');
    table.timestamp('completed_at');
    table.timestamp('cancelled_at');
    table.string('cancel_reason');
    table.timestamps(true, true);
    
    table.index(['client_id']);
    table.index(['driver_id']);
    table.index(['status']);
    table.index(['scheduled_for']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('rides');
}