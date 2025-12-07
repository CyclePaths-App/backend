import { app } from '../..';
import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import { BAD_REQUEST, FORBIDDEN, OK_STATUS } from '../../constants';
import request from 'supertest';
import { addPoints } from '../logic/points.test';

describe('Points controller tests', () => {
  const URL = '/points';

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

  describe(`GET ${URL}/:north/:south/:east/:west?type=TripType&justDestinations=boolean`, () => {
    it('should get all points in specified area.', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const res = await request(app).get(`${URL}/${56}/${55}/${12}/${13}`);

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.length).toBe(addedUserCount * 2 + 3);
    });

    it('should return FORBIDDEN if not enough users to be deidentifyable', async () => {
      const res = await request(app).get(`${URL}/${56}/${55}/${12}/${13}`);

      expect(res.status).toBe(FORBIDDEN);
    });

    it('should get all destinations in specified area.', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const res = await request(app).get(
        `${URL}/${56}/${55}/${12}/${13}?justDestinations=${true}`
      );

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.length).toBe(addedUserCount * 2 + 2);
    });

    it('should get all walking trips in specified area.', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount, 'walk');
      const res = await request(app).get(
        `${URL}/${56}/${55}/${12}/${13}?type=${'walk'}&`
      );

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.length).toBe(addedUserCount * 2);
    });

    it('should get all biking destinations in specified area.', async () => {
      // Add more users to make the data deidentifiable.
      const addedUserCount = 100;
      await addPoints(addedUserCount);

      const res = await request(app).get(
        `${URL}/${56}/${55}/${12}/${13}?type=${'bike'}&justDestinations=${true}`
      );

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.length).toBe(addedUserCount * 2 + 2);
    });

    test('invalid latitude/longitude', async () => {
      const res = await request(app).get(
        `${URL}/${'invalid'}/${55}/${12}/${13}`
      );

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('invalid type', async () => {
      const res = await request(app).get(
        `${URL}/${56}/${55}/${12}/${13}?type=${'run'}`
      );

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('invalid justDestinations', async () => {
      const res = await request(app).get(
        `${URL}/${56}/${55}/${12}/${13}?justDestinations=${'invalid'}`
      );

      expect(res.status).toBe(BAD_REQUEST);
    });
  });
});
