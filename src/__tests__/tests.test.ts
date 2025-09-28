import DB from '../config/knex';

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

  test('Testing the tests', () => {
    expect(true).toBe(true);
  });

  test('DB Should be up', async () => {
    const res = await DB.select(1);
    expect(res[0]).toBeDefined();
  });
});
