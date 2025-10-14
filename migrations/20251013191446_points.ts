import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTableIfNotExists('points', (table) => {
    table.integer('trip_id').references('trips.id').onDelete('CASCADE');
    /**
     * Latitude and longitude need 5 digits behind the  decimal to have a maximum error of <1 m.
     */
    // Longitude can be in the range of (180.00000, -180.00000]
    table.decimal('longitude', 3 + 5, 5).notNullable();
    // Latitude can be in the range of (90.00000, -90.00000)
    table.decimal('latitude', 2 + 5, 5).notNullable();
    table.timestamp('time').notNullable();
    table.decimal('speed_mps').notNullable(); // Stored in meters per second.
    table.primary(['trip_id', 'time']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('points');
}
