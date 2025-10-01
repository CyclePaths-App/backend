import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('users', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
  });

  knex.schema.raw(`
CREATE TABLE records (
    id SERIAL PRIMARY KEY,
    
)`);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
