exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('phone').notNullable().unique();
    table.string('email').notNullable().unique();
    table.string('password_hash').notNullable();
    table.enum('role', ['CLIENT', 'DRIVER', 'ADMIN']).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_verified').defaultTo(false);
    table.string('verification_token');
    table.timestamps(true, true);
    
    table.index(['phone']);
    table.index(['email']);
    table.index(['role']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};