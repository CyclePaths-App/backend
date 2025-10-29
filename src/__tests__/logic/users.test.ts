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
const rand = Math.floor(Math.random() * 10000);
const testUser: User = {
  userID: rand,
  username: `testuser_${rand}`,
  email: `test_${rand}@example.com`,
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
      testUser.userID,
      testUser.username,
      testUser.email,
      testUser.password
    );
    expect(typeof id).toBe('number');
  });

  // ---- GetUserByID ----
  test('should retrieve user by ID', async () => {
    const user = await GetUserByID(testUser.userID);
    expect(user).toBeDefined();
    expect(user?.username).toBe(testUser.username);
    expect(user?.email).toBe(testUser.email);
  });

  // ---- GetUserByName ----
  test('should retrieve user by username', async () => {
    const user = await GetUserByName(testUser.username);
    expect(user).toBeDefined();
    expect(user?.userID).toBe(testUser.userID);
  });

  // ---- DeleteUserByID ----
  test('should delete user by ID', async () => {
    const result = await DeleteUserByID(testUser.userID);
    expect(result).toBeGreaterThanOrEqual(1);

    // Ensure user no longer exists
    const user = await GetUserByID(testUser.userID);
    expect(user).toBeUndefined();
  });

  // ---- DeleteUserByName ----
  test('should handle deletion by username gracefully (no error)', async () => {
    // Create a temp user to delete
    const tempRand = Math.floor(Math.random() * 10000);
    const tempName = `tempuser_${tempRand}`;
    await CreateUser(tempRand, tempName, `temp_${tempRand}@example.com`, 'temp');
    const result = await DeleteUserByName(tempName as any); // code uses number type for username
    expect(result).toBeGreaterThanOrEqual(1);
  });

  // ---- Error Tests ----
  test('should throw error when creating a duplicate userID', async () => {
    await expect(
      CreateUser(testUser.userID, `duplicate_${rand}`, `dup_${rand}@ex.com`, 'dup')
    ).rejects.toThrow();
  });
});