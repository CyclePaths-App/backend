import { app } from '../..';
import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import { BAD_REQUEST, NOT_FOUND, OK_STATUS } from '../../constants';
import request from 'supertest';
import { GetUserByID, GetUserByName } from '../../logic/users';

describe('Users controllers tests', () => {
  const URL = '/users/';

  // #region Setup
  beforeAll(async () => {
    // Initial setup once before any tests run
  });

  beforeEach(async () => {
    await seed(DB); // Reset database before each test
  });

  afterEach(() => {
    // Cleanup after each individual test if needed
  });

  afterAll(() => {
    // Final cleanup once after all tests run
  });
  // #endregion

  /**
   * POST /users testing
   */
  describe('POST /users', () => {
    test('should create user and return new user id', async () => {
      const res = await request(app).post(URL).send({
        username: 'Alice',
        first_name: 'Alice',
        last_name: 'Anderson',
        email: 'alice@test.com',
        password: 'pass123',
      });

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.id).toBeDefined();
    });

    test('should return 400 on missing username', async () => {
      const res = await request(app)
        .post(URL)
        .send({ email: 'bob@test.com', password: 'pass123' });

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 400 on missing email', async () => {
      const res = await request(app)
        .post(URL)
        .send({ username: 'Bob', password: 'pass123' });

      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 400 on missing password', async () => {
      const res = await request(app)
        .post(URL)
        .send({ username: 'Bob', email: 'bob@test.com' });

      expect(res.status).toBe(BAD_REQUEST);
    });
  });

  /**
   * GET /users/:id
   */
  describe('GET /users/:id', () => {
    test('should fetch user by ID', async () => {
      const res = await request(app).get(URL + '1');

      expect(res.status).toBe(OK_STATUS);
      expect(res.body.id).toBe(1);
      expect(res.body.username).toBeDefined();
      expect(res.body.email).toBeDefined();
    });

    test('should return 404 on nonexistent user', async () => {
      const res = await request(app).get(URL + '404');
      expect(res.status).toBe(NOT_FOUND);
    });

    test('should return 400 on invalid ID', async () => {
      const res = await request(app).get(URL + 'invalid');
      expect(res.status).toBe(BAD_REQUEST);
    });
  });

  /**
   * GET /users/username/:username
   */
  // describe('GET /users/username/:username', () => {
  //   test('should fetch user by username', async () => {
  //     const res = await request(app).get(URL + 'username/Testy McTestFace');

  //     expect(res.status).toBe(OK_STATUS);
  //     expect(res.body.username).toBe('Testy McTestFace');
  //     expect(res.body.id).toBeDefined();
  //   });

  //   test('should return 404 on nonexistent username', async () => {
  //     const res = await request(app).get(URL + 'username/NonexistentUser');
  //     expect(res.status).toBe(NOT_FOUND);
  //   });

  //   test('should return 400 on missing username', async () => {
  //     const res = await request(app).get(URL + 'username/');
  //     expect(res.status).toBe(BAD_REQUEST);
  //   });
  // });

  /**
   * DELETE /users/:id testing.
   */
  describe('DELETE /users/:id', () => {
    test('should delete user by ID', async () => {
      const res = await request(app).delete(URL + '1');

      expect(res.status).toBe(OK_STATUS);

      const check = await GetUserByID(1);
      expect(check).toBeUndefined();
    });

    test('should return 400 on invalid ID', async () => {
      const res = await request(app).delete(URL + 'invalid');
      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 404 on nonexistent user', async () => {
      const res = await request(app).delete(URL + '404');
      expect(res.status).toBe(NOT_FOUND);
    });
  });

  /**
   * DELETE /users/username/:username testing.
   */
  describe('DELETE /users/username/:username', () => {
    test('should delete user by username', async () => {
      const res = await request(app).delete(URL + 'username/Testy McTestFace');

      expect(res.status).toBe(OK_STATUS);

      //I'll fix this, I changed the method parameters that's why it's bugging out
      const check = await GetUserByName('User1');
      expect(check).toBeUndefined();
    });

    test('should return 400 on missing username', async () => {
      const res = await request(app).delete(URL + 'username/');
      expect(res.status).toBe(BAD_REQUEST);
    });

    test('should return 404 on nonexistent username', async () => {
      const res = await request(app).delete(URL + 'username/NonexistentUser');
      expect(res.status).toBe(NOT_FOUND);
    });
  });
});
