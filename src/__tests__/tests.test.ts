import { app } from '..';
import DB from '../config/knex';
import request from 'supertest';
import { OK_STATUS } from '../constants';
import { seed } from '../../seeds/deidentifiableTest';

describe('Example test suite', () => {
  beforeAll(() => {
    // Initial setup once before any tests run
  });

  beforeEach(() => {
    // Setup before each individual test
  });

  afterEach(() => {
    // Cleanup after each individual test
  });

  afterAll(() => {
    // Final cleanup once after all tests run
  });

  test('run deidentifiable seed', async () => {
    seed(DB);
  });

  test('Testing testing suite', () => {
    expect(true).toBe(true);
  });

  test('API should be up', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(OK_STATUS);
    expect(res.text).toBe('Hello World!');
  });

  test('DB should be up', async () => {
    const res = await DB.select(1).first();
    expect(res).toBeDefined();
  });
});
