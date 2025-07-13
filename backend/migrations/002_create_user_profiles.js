exports.up = function(knex) {
  return knex.schema.createTable('user_profiles', (table) => {
    table.string('id').primary();
    table.string('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('photo_url');
    table.decimal('wallet_balance', 10, 2).defaultTo(0);
    table.decimal('latitude', 10, 8);
    table.decimal('longitude', 11, 8);
    table.string('address');
    table.timestamps(true, true);
    
    table.index(['user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('user_profiles');
};