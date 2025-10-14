import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import { createTrip, getTrip, getTripByUserId, Trip } from '../../logic/trips';

describe('Trips logic tests', () => {
  const STANDARD_TRIP = [
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
  ];

  beforeAll(async () => {
    // Initial setup once before any tests run
  });

  beforeEach(async () => {
    await seed(DB);
  });

  afterEach(() => {
    // Cleanup after each individual test
  });

  afterAll(() => {
    // Final cleanup once after all tests run
  });

  describe('createTrip()', () => {
    test('should create trip', async () => {
      const trip_id = await createTrip(1, STANDARD_TRIP, 'bike');
      expect(trip_id).toBe(3);

      const db_entry: Trip = (
        await DB.select('*').from('trips').where({ id: 3 })
      )[0];

      expect(db_entry.user_id).toBe(1);
      expect(db_entry.distance).toBe(154);
      expect(db_entry.trip_type).toBe('bike');
    });

    test('should fail on nonexistent user_id', async () => {
      expect(async () => {
        await createTrip(404, STANDARD_TRIP, 'bike');
      }).rejects.toThrow();
    });

    test('should fail on empty trip', async () => {
      expect(async () => {
        await createTrip(1, [], 'bike');
      }).rejects.toThrow();
    });
  });

  describe('getTrip()', () => {
    test('should get trip', async () => {
      const trip = await getTrip(1);

      expect(trip.id).toBe(1);
      expect(trip.user_id).toBe(1);
      expect(trip.distance).toBe(69);
      expect(trip.trip_type).toBe('walk');
    });

    test('should throw error on nonexistent id', async () => {
      expect(async () => {
        await getTrip(404);
      }).rejects.toThrow();
    });
  });

  describe('getTripsByUserId', () => {
    test('should get trips', async () => {
      const trips = await getTripByUserId(1);

      expect(trips.length).toBe(1);
    });

    test('should return empty on nonexistent user_id', async () => {
      const trips = await getTripByUserId(404);

      expect(trips.length).toBe(0);
    });
  });
});
