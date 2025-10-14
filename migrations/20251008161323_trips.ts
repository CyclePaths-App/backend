import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('trips', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('users.id');

    // Holds distance in meters. If someone is complaining about a few missed centimeters, that's a them issue.
    table.integer('distance').notNullable();

    table
      .enu('trip_type', ['walk', 'bike'], {
        useNative: true,
        enumName: 'trip_types',
      })
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('points');
  await knex.schema.dropTableIfExists('trips');
  await knex.raw('DROP TYPE IF EXISTS trip_types');
}
