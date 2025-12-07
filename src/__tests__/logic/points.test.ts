import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import {
  createPoint,
  getPointsByTrip,
  getPoint,
  updatePoint,
  deletePoint,
  Point,
  getPoints,
  WindowOptions,
} from '../../logic/points';
import { createTrip, TripType } from '../../logic/trips';
import { CreateUser } from '../../logic/users';

export async function addPoints(count: number, type?: TripType) {
  // Create a temp user to delete
  for (let i = 0; i < count; i++) {
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
          latitude: 55.5,
          longitude: 12.5,
          time: new Date(2025, 9, 20, 18, 5, 30),
        },
        {
          latitude: 55.5,
          longitude: 12.5,
          time: new Date(2025, 9, 20, 18, 5, 31),
        },
      ],
      type ?? 'bike'
    );
  }
}

describe('Points logic tests', () => {
  const TEST_POINT = {
    trip_id: 1,
    longitude: -73.82802,
    latitude: 42.68626,
    time: new Date(2025, 9, 20, 18, 5, 0),
    speed: 4.5,
  };

  beforeAll(async () => {
    // Initial setup once before any tests run
  });

  beforeEach(async () => {
    await seed(DB);
  });

  afterEach(() => {
    // Cleanup after each individual test
  });

  afterAll(async () => {
    // After all tests
  });

  describe('createPoint()', () => {
    test('should create point', async () => {
      await createPoint(
        TEST_POINT.trip_id,
        TEST_POINT.longitude,
        TEST_POINT.latitude,
        TEST_POINT.time,
        TEST_POINT.speed,
        undefined
      );

      const db_entry: Point = (
        await DB.select('*')
          .from('points')
          .where({ trip_id: TEST_POINT.trip_id })
          .orderBy('trip_id')
          .orderBy('time')
      )[0];

      expect(db_entry.trip_id).toBe(TEST_POINT.trip_id);
      expect(db_entry.longitude).toBe(TEST_POINT.longitude.toString()); // TS is dumb and for some reason is treating the result as a string.
    });
  });

  describe('getPoint()', () => {
    test('should get point', async () => {
      await createPoint(
        TEST_POINT.trip_id,
        TEST_POINT.longitude,
        TEST_POINT.latitude,
        TEST_POINT.time,
        TEST_POINT.speed,
        undefined
      );

      const point: Point = await getPoint(TEST_POINT.trip_id, TEST_POINT.time);
      expect(point.trip_id).toBe(TEST_POINT.trip_id);
      expect(point.speed).toBe(TEST_POINT.speed);
    });
  });

  describe('getPoints()', () => {
    test('should get trip points', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const points = await getPoints(56, 55, 12, 13);

      expect(points !== null);
      expect(points?.length).toBe(addedUserCount * 2 + 3);
    });

    test('should not get trip points if not enough users are represented', async () => {
      const points = await getPoints(56, 55, 12, 13);

      expect(points).toBeNull();
    });

    test('should get first and last point from db regardless of trip type', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const options: WindowOptions = { justDestinations: true };
      const points = await getPoints(56, 55, 12, 13, options);

      expect(points?.length).toBe(addedUserCount * 2 + 2);
    });

    test('should get destination points from bike trips', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const options: WindowOptions = {
        justDestinations: true,
        type: 'bike',
      };
      const points = await getPoints(56, 55, 12, 13, options);

      expect(points?.length).toBe(addedUserCount * 2 + 2);
    });

    test('should get destination points from walking trips', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount, 'walk');

      const options: WindowOptions = {
        justDestinations: true,
        type: 'walk',
      };
      const points = await getPoints(56, 55, 12, 13, options);

      expect(points?.length).toBe(addedUserCount * 2);
    });

    test('should accept larger latitudes', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const options: WindowOptions = {
        justDestinations: true,
        type: 'bike',
      };
      const points = await getPoints(91, 55, 12, 13, options);

      expect(points?.length).toBe(addedUserCount * 2 + 2);
    });
  });

  describe('updatePoint()', () => {
    test('should update point', async () => {
      await createPoint(
        TEST_POINT.trip_id,
        TEST_POINT.longitude,
        TEST_POINT.latitude,
        TEST_POINT.time,
        TEST_POINT.speed,
        undefined
      );

      const newSpeed = 6.8;
      const updated = await updatePoint(TEST_POINT.trip_id, TEST_POINT.time, {
        speed: newSpeed,
      });

      expect(updated).toBe(true);

      const updatedPoint = await getPoint(TEST_POINT.trip_id, TEST_POINT.time);
      expect(updatedPoint.speed).toBeCloseTo(newSpeed);
    });
  });

  describe('deletePoint()', () => {
    test('should delete point', async () => {
      await createPoint(
        TEST_POINT.trip_id,
        TEST_POINT.longitude,
        TEST_POINT.latitude,
        TEST_POINT.time,
        TEST_POINT.speed,
        undefined
      );

      const deleted = await deletePoint(TEST_POINT.trip_id, TEST_POINT.time);
      expect(deleted).toBe(true);
    });
  });

  describe('getPointsByTrip()', () => {
    test('should get points', async () => {
      const points = await getPointsByTrip(TEST_POINT.trip_id);
      expect(points.length).toBe(3);
      expect(points.length).toBeGreaterThan(0);
      expect(points[0]!.trip_id).toBe(TEST_POINT.trip_id);
    });
  });
});
