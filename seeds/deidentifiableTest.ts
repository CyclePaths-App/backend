import { Knex } from 'knex';
import { CreateUser } from '../src/logic/users';
import { createTrip } from '../src/logic/trips';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('points').del();
  await knex('trips').del();
  await knex('users').del();

  await knex.raw('ALTER SEQUENCE users_id_seq RESTART WITH 1');

  for (let i = 0; i < 100; i++) {
    const tempName = `tempuser_${i}`;
    const userID = await CreateUser(
      tempName,
      'first',
      'last',
      `temp_${i}@example.com`,
      'temp'
    );

    await createTrip(
      userID,
      [
        {
          latitude: 42.686261,
          longitude: -73.828025,
          time: new Date(2025, 9, 20, 18, 5, 0),
        },
        {
          latitude: 42.686945,
          longitude: -73.827349,
          time: new Date(2025, 9, 20, 18, 5, 15),
        },
        {
          latitude: 42.687378,
          longitude: -73.826919,
          time: new Date(2025, 9, 20, 18, 5, 30),
        },
        {
          latitude: 42.68751,
          longitude: -73.82717,
          time: new Date(2025, 9, 20, 18, 5, 40),
        },
        {
          latitude: 42.68786,
          longitude: -73.82723,
          time: new Date(2025, 9, 20, 18, 5, 50),
        },
        {
          latitude: 42.68814,
          longitude: -73.82742,
          time: new Date(2025, 9, 20, 18, 6, 0),
        },
        {
          latitude: 42.68843,
          longitude: -73.82721,
          time: new Date(2025, 9, 20, 18, 6, 10),
        },
        {
          latitude: 42.68867,
          longitude: -73.82704,
          time: new Date(2025, 9, 20, 18, 6, 20),
        },
        {
          latitude: 42.68886,
          longitude: -73.82676,
          time: new Date(2025, 9, 20, 18, 6, 30),
        },
        {
          latitude: 42.68868,
          longitude: -73.82636,
          time: new Date(2025, 9, 20, 18, 6, 40),
        },
        {
          latitude: 42.68846,
          longitude: -73.82599,
          time: new Date(2025, 9, 20, 18, 6, 50),
        },
        {
          latitude: 42.68823,
          longitude: -73.82561,
          time: new Date(2025, 9, 20, 18, 7, 0),
        },
        {
          latitude: 42.68804,
          longitude: -73.82525,
          time: new Date(2025, 9, 20, 18, 7, 10),
        },
        {
          latitude: 42.68783,
          longitude: -73.82489,
          time: new Date(2025, 9, 20, 18, 7, 20),
        },
        {
          latitude: 42.68741,
          longitude: -73.82422,
          time: new Date(2025, 9, 20, 18, 7, 30),
        },
        {
          latitude: 42.68713,
          longitude: -73.82373,
          time: new Date(2025, 9, 20, 18, 7, 40),
        },
        {
          latitude: 42.68694,
          longitude: -73.82347,
          time: new Date(2025, 9, 20, 18, 7, 50),
        },
        {
          latitude: 42.68689,
          longitude: -73.82372,
          time: new Date(2025, 9, 20, 18, 8, 0),
        },
      ],
      'bike'
    );
  }
}
