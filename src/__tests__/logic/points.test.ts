import DB from '../../config/knex';
import {
  createPoint,
  getPointsByTrip,
  getPoint,
  updatePoint,
  deletePoint,
  Point,
} from '../../logic/points';

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
    await DB('points').where({ trip_id: TEST_POINT.trip_id }).delete();
  });

  afterEach(() => {
    // Cleanup after each individual test
  });

  afterAll(async () => {
    await DB('points').where({ trip_id: TEST_POINT.trip_id }).delete();
    await DB.destroy();
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
      await createPoint(
        TEST_POINT.trip_id,
        TEST_POINT.longitude,
        TEST_POINT.latitude,
        TEST_POINT.time,
        TEST_POINT.speed,
        undefined
      );

      const points = await getPointsByTrip(TEST_POINT.trip_id);
      expect(points.length).toBe(1);
      expect(points.length).toBeGreaterThan(0);
      expect(points[0]!.trip_id).toBe(TEST_POINT.trip_id);
    });
  });
});
