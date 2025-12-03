import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('points').del();
  await knex('trips').del();
  await knex('users').del();

  // Seed users
  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');
  await knex('users').insert([
    {
      username: 'Testy McTestFace',
      first_name: 'Testy',
      last_name: 'McTestFace',
      email: 'tmctestface@yahoo.com',
      password: 'securePassword123',
    },
    {
      username: 'Tester Testerson',
      first_name: 'Tester',
      last_name: 'Testerson',
      email: 'testertesterson@gmail.com',
      password: 'insecure',
    },
  ]);

  // Seed trips
  await knex.raw('ALTER SEQUENCE trips_id_seq RESTART WITH 1');
  await knex('trips').insert([
    {
      user_id: 1,
      distance: 69,
      trip_type: 'walk',
    },
    {
      user_id: 2,
      distance: 420,
      trip_type: 'bike',
    },
  ]);

  // Seed points
  await knex('points').insert([
    {
      trip_id: 1,
      longitude: 0,
      latitude: 0,
      time: new Date(2025, 10, 13, 15, 5, 0),
      speed_mps: 0,
    },
    {
      trip_id: 1,
      longitude: 1,
      latitude: 0,
      time: new Date(2025, 10, 13, 15, 5, 30),
      speed_mps: 0,
    },
    {
      trip_id: 1,
      longitude: 1,
      latitude: 1,
      time: new Date(2025, 10, 13, 15, 6, 0),
      speed_mps: 0,
    },
    {
      trip_id: 2,
      longitude: 12.590932,
      latitude: 55.674221,
      time: new Date(2025, 8, 13, 15, 5, 0),
      speed_mps: 0,
    },
    {
      trip_id: 2,
      longitude: 12.594269,
      latitude: 55.672387,
      time: new Date(2025, 8, 13, 15, 5, 30),
      speed_mps: 0,
    },
    {
      trip_id: 2,
      longitude: 12.595868,
      latitude: 55.673378,
      time: new Date(2025, 10, 13, 15, 6, 0),
      speed_mps: 0,
    },
  ]);
}
