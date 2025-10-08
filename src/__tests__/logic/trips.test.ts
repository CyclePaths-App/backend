import DB from '../../config/knex';
import { createTrip } from '../../logic/trips';

describe('Trips logic tests', () => {
  beforeAll(() => {
    // Initial setup once before any tests run
  });

  beforeEach(() => {
    // Setup before each individual test
    DB.raw('SELECT 1');
  });

  afterEach(() => {
    // Cleanup after each individual test
  });

  afterAll(() => {
    // Final cleanup once after all tests run
  });

  describe('createTrip()', () => {
    test('should create trip', async () => {
      const result = await createTrip(0, [], 'walk');
      expect(result).toBe(-1);
    });
  });
});
