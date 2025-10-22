import { app } from '../..';
import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import { BAD_REQUEST, NOT_FOUND, OK_STATUS } from '../../constants';
import request from 'supertest';

describe('Trips controllers tests', () => {
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
  const URL = '/trips/';

  // #region Setup

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

  // #endregion

  describe('POST /trips/', () => {
    test('should create trip and return new trip id.', async () => {
      const res = await request(app)
        .post(URL)
        .send({ user_id: 1, trip: STANDARD_TRIP, trip_type: 'walk' });

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.id).toBe(3);
    });

    test('should return 400 on missing user_id', async () => {
      const res = await request(app)
        .post(URL)
        .send({ trip: STANDARD_TRIP, trip_type: 'walk' });

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 400 on empty trip', async () => {
      const res = await request(app)
        .post(URL)
        .send({ user_id: 1, trip: [], trip_type: 'walk' });

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 400 on invalid trip_type', async () => {
      const res = await request(app)
        .post(URL)
        .send({ user_id: 1, trip: STANDARD_TRIP, trip_type: 'swim' });

      expect(res.status).toBe(BAD_REQUEST);
    });
  });

  describe('GET /trips/:id', () => {
    test('should get trip', async () => {
      const res = await request(app).get(URL + '1');

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.user_id).toBe(1);
      expect(res.body.distance).toBe(69);
      expect(res.body.trip_type).toBe('walk');
    });

    test('should return 404 on nonexistent trip', async () => {
      const res = await request(app).get(URL + '404');
      expect(res.status).toBe(NOT_FOUND);
    });

    test('should return 400 on invalid trip id', async () => {
      const res = await request(app).get(URL + 'Hi');
      expect(res.status).toBe(BAD_REQUEST);
    });
  });

  describe('GET /trips/userid/', () => {
    const BASE_URL = URL + 'userid/';
    test('should get trips', async () => {
      const res = await request(app).get(BASE_URL + '1');

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.length).toBe(1);
    });

    test('should return empty array on nonexistent user', async () => {
      const res = await request(app).get(BASE_URL + '404');
      expect(res.body.length).toBe(0);
    });

    test('should return 400 on invalid user id', async () => {
      const res = await request(app).get(BASE_URL + 'Hi');
      expect(res.status).toBe(BAD_REQUEST);
    });
  });
});
