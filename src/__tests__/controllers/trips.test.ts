import axios from 'axios';
import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import {
  BACKEND_PORT,
  BAD_REQUEST,
  NOT_FOUND,
  OK_STATUS,
} from '../../constants';

describe('Trips controllers tests', () => {
  const BASE_URL = `http://localhost:${BACKEND_PORT}/trips`;

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

  describe('POST /', () => {
    const URL = BASE_URL;

    test('should create trip and return new trip id.', async () => {
      const res = await axios.post(URL, {
        user_id: 1,
        trip: STANDARD_TRIP,
        trip_type: 'walk',
      });

      expect(res.status).toBe(OK_STATUS);
      expect(res.data).toBe({ id: 3 });
    });

    test('should return 400 on invalid user_id', async () => {
      const res = await axios.post(URL, {
        user_id: 'this is not a number',
        trip: STANDARD_TRIP,
        trip_type: 'walk',
      });

      expect(res.status).toBe(BAD_REQUEST);
    });
  });

  describe('GET /:id', () => {
    const URL = BASE_URL;

    test('should get trip', async () => {
      const res = await axios.get(URL + '/1');

      expect(res.status).toBe(OK_STATUS);
      expect(res.data.user_id).toBe(1);
      expect(res.data.distance).toBe(69);
      expect(res.data.trip_type).toBe('walk');
    });

    test('should return 404 on nonexistent trip', async () => {
      const res = await axios.get(URL + '/404');

      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
