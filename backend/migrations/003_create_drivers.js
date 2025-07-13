exports.up = function(knex) {
  return knex.schema.createTable('drivers', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('car_model').notNullable();
    table.string('license_plate').notNullable();
    table.decimal('rating', 3, 2).defaultTo(5.0);
    table.enum('state', ['OFFLINE', 'ONLINE', 'INCOMING_RIDE', 'TO_PICKUP', 'TRIP_IN_PROGRESS']).defaultTo('OFFLINE');
    table.boolean('is_approved').defaultTo(false);
    table.boolean('documents_verified').defaultTo(false);
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.decimal('earnings_today', 10, 2).defaultTo(0);
    table.integer('total_trips').defaultTo(0);
    table.timestamps(true, true);
    
    table.index(['user_id']);
    table.index(['state']);
    table.index(['is_approved']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('drivers');
};