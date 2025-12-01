import DB from '../config/knex';

/**
 * Create a user in the database.
 * @param userID
 * @param username
 * @param email
 * @param password
 */
export async function CreateUser(
  username: string,
  first_name: string,
  last_name: string,
  email: string,
  password: string
): Promise<number> {
  return await DB.transaction(async (trx) => {
    // Create an object that holds the userID, username, email, password.
    const dbUser = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
    };

    // Create the user by inserting it into the users table in the DB.
    const res: { id: number }[] = await trx('users')
      .insert(dbUser)
      .returning('id')
      .catch((err) => {
        const err_mes: string = err.message;
        throw Error(`CreateUser(): Uncaught error: ${err_mes}`);
      });
    if (!res[0]) {
      throw Error(`createUser(): Error creating user, got ${res.length} IDs.`);
    }
    const id = res[0].id;
    return id;
  }).catch((err) => {
    console.error(`CreateUser(): ${err}`);
    throw err;
  });
}

/**
 * Return the user information using the userID.
 * @param userID
 */
export async function GetUserByID(userID: number) {
  try {
    const row = await DB.select('*')
      .from('users')
      .where({ id: userID })
      .first();

    if (!row) {
      return undefined;
    }

    const user: User = {
      id: row.id,
      username: row.username,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      password: row.passwords,
    };

    return user;
  } catch (err) {
    console.error(err);
    throw Error(`GetUserByID(): Unknown Error: ${err}`);
  }
}

/** NOT SURE IF THIS WILL BE USEFUL ANYMORE BUT I'LL KEEP IT JUST IN CASE
 * Return the user information using the username.
 * @param username
 */
export async function GetUserByName(username: string) {
  try {
    const row = await DB.select('*')
      .from('users')
      .where({ username: username })
      .first();

    if (!row) {
      return undefined;
    }

    const user: User = {
     id: row.id,
      username: row.username,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      password: row.passwords,
    };

    return user;
  } catch (err) {
    console.error(err);
    throw Error(`GetUserByName(): Unknown Error: ${err}`);
  }
}

/**
 * Return the user information using the username.
 * @param username
 */
export async function GetUserByNameAndPassword(username: string, password: string) {
  try {
    const row = await DB.select('*')
      .from('users')
      .where({ username: username, password: password})
      .first();

    if (!row) {
      return undefined;
    }

    const user: User = {
      id: row.id,
      username: row.username,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      password: row.password,
    };

    return user;
  } catch (err) {
    console.error(err);
    throw Error(`GetUserByName(): Unknown Error: ${err}`);
  }
}

/**
 * Delete user by ID, the user should not be in the users database.
 * @param userID
 */
export async function DeleteUserByID(userID: number) {
  try {
    const deleteResult = await DB('users').delete().where({ id: userID });

    return deleteResult;
  } catch (err) {
    throw Error(`DeleteUserByID(): Unexpected error: ${err}`);
  }
}

/**
 * Delete user by username, the user should not be in the users database.
 * @param username // QUESTION: Why was this a number?
 */
export async function DeleteUserByName(username: string) {
  try {
    const deleteResult = await DB('users')
      .delete()
      .where({ username: username });

    return deleteResult;
  } catch (err) {
    throw Error(`DeleteUserByName(): Unexpected error: ${err}`);
  }
}

// Define user variable(s)' types.
export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
