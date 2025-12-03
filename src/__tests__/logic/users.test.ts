import { seed } from '../../../seeds/seed_name';
import DB from '../../config/knex';
import {
  CreateUser,
  GetUserByID,
  GetUserByName,
  DeleteUserByID,
  DeleteUserByName,
  User,
} from '../../logic/users';

// Use a random suffix so we don’t conflict with real DB data
const testUser: User = {
  id: 3, // comment so it would let me commit
  username: `testuser`,
  first_name: 'test',
  last_name: 'user',
  email: `test@example.com`,
  password: 'secret123',
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

afterAll(() => {
  // Final cleanup once after all tests run
});

describe('User Logic Tests', () => {
  // ---- CreateUser ----
  test('should create a new user successfully', async () => {
    const id = await CreateUser(
      testUser.username,
      testUser.first_name,
      testUser.last_name,
      testUser.email,
      testUser.password
    );
    expect(typeof id).toBe('number');
  });

  // ---- GetUserByID ----
  test('should retrieve user by ID', async () => {
    const user = await GetUserByID(1);
    expect(user).toBeDefined();
    expect(user?.username).toBe('Testy McTestFace');
    expect(user?.email).toBe('tmctestface@yahoo.com');
  });

  // ---- GetUserByName ----
  test('should retrieve user by username', async () => {
    const user = await GetUserByName('Testy McTestFace');
    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
  });

  // ---- DeleteUserByID ----
  test('should delete user by ID', async () => {
    const result = await DeleteUserByID(1);
    expect(result).toBeGreaterThanOrEqual(1);

    // Ensure user no longer exists
    const user = await GetUserByID(1);
    expect(user).toBeUndefined();
  });

  // ---- DeleteUserByName ----
  test('should handle deletion by username gracefully (no error)', async () => {
    // Create a temp user to delete
    const tempRand = Math.floor(Math.random() * 10000);
    const tempName = `tempuser_${tempRand}`;
    await CreateUser(
      tempName,
      'first',
      'last',
      `temp_${tempRand}@example.com`,
      'temp'
    );
    const result = await DeleteUserByName(tempName as any); // code uses number type for username
    expect(result).toBeGreaterThanOrEqual(1);
  });
});
