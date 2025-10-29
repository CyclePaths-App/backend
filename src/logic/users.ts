import DB from '../config/knex';

/**
 * TASK LIST:
 * Ye, make the DB table in the users migration file (in ./migration/). Make the DB calls in the ./src/logic/ folder, make the
 * controller (the thing that checks input and decides status codes) in ./src/controller/, then define the routes in ./src/routes/
 */

/**
 * Create a user in the database.
 * @param userID 
 * @param username 
 * @param email 
 * @param password 
 */
export async function CreateUser(userID: number, username: string, email: string, password: string): Promise<number> {
    
    // Check if userID already exists in the database (userID must be unique).
    if ((await DB.from(`users`)).entries.arguments == userID) {
        throw Error(`${userID} already exists in the database.`);
    }
    // Check if username already exists in the database (username must be unique?).
    if ((await DB.from(`users`)).entries.arguments == username) {
        throw Error(`${username} already exists in the database.`);
    }

    return await DB.transaction(async (trx) => {
        // Create an object that holds the userID, username, email, password.
        const dbUser = {
            userID: userID,
            username: username,
            emai: email,
            password: password
        };

        // Create the user by inserting it into the users table in the DB.
        const res: { id: number }[] = await trx('users')
        .insert(dbUser)
        .returning('id')
        .catch((err) => {
            const err_mes: string = err.message;
            if (err_mes.includes('trips_user_id_foreign'))
            throw Error(`CreateUser(): User_id ${userID} does not exist.`);
            else throw Error(`CreateUser(): Uncaught error: ${err_mes}`);
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
            .where({ userID: userID })
            .first();

        if (!row) {
            return undefined;
        }

        const user: User = {
            userID: row.userID,
            username: row.username,
            email: row.email,
            password: row.passwords,
        };

        return user;
    } catch (err) {
        console.error(err);
        throw Error(`GetUserByID(): Unknown Error: ${err}`);
    }
}

/**
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
            userID: row.userID,
            username: row.username,
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
 * Delete user by ID, the user should not be in the users database.
 * @param userID 
 */
export async function DeleteUserByID(userID: number) {
    try {
        const deleteResult = await DB('users')
        .delete()
        .where({ userID: userID });

        return deleteResult;
    } catch (err) {
        throw Error(`DeleteUserByID(): Unexpected error: ${err}`);
    }
}

/**
 * Delete user by username, the user should not be in the users database.
 * @param username 
 */
export async function DeleteUserByName(username: number) {
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
    userID: number;
    username: string;
    email: string;
    password: string;
};