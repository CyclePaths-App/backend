import { Request, Response } from 'express';
import {
  CreateUser,
  GetUserByID,
  GetUserByName,
  DeleteUserByID,
  DeleteUserByName,
  User,
} from '../logic/users';
import {
  BAD_REQUEST,
  INTERNAL_ERROR,
  NOT_FOUND,
  OK_STATUS,
} from '../constants';

/**
 * Create a new user.
 */
export async function postUser(req: Request, res: Response): Promise<void> {
  const { username, first_name, last_name, email, password } = req.body;

    // Input validation
    if (!username || typeof username !== 'string') {
        res.status(BAD_REQUEST).send({
        message: `postUser(): username must be a string. Received: ${username}`,
        });
    }
    
    if (!email || typeof email !== 'string') {
        res.status(BAD_REQUEST).send({
        message: `postUser(): email must be a string. Received: ${email}`,
        });
    }

    if (!password || typeof password !== 'string') {
        res.status(BAD_REQUEST).send({
        message: `postUser(): password must be a string.`,
        });
    }

    try {
        const id = await CreateUser(username, first_name, last_name, email, password);
        res.status(OK_STATUS).send({ id });
    } catch (err) {
        console.error(err);
        res.status(INTERNAL_ERROR).send({ message: `postUser(): ${err}` });
    }
}

/**
 * Fetch a user by ID.
 */
export async function fetchUserByID(req: Request, res: Response) {
  const { id: userID } = req.params;

  if (!userID || isNaN(+userID)) {
    res
      .status(BAD_REQUEST)
      .send(`fetchUserByID(): userID must be a number. Received: ${userID}`);
    return;
  }

  try {
    const user: User | undefined = await GetUserByID(+userID);

    if (!user) {
      res.status(NOT_FOUND).send(`fetchUserByID(): User not found.`);
      return;
    }

    res.status(OK_STATUS).send(user);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`fetchUserByID(): ${err}`);
  }
}

/**
 * GET /users/username/:username
 * Fetch a user by username.
 */
export async function fetchUserByName(req: Request, res: Response) {
  const { username } = req.params;

  if (!username || typeof username !== 'string') {
    res
      .status(BAD_REQUEST)
      .send(`fetchUserByName(): username must be a string. Received: ${username}`);
  }

  try {
    const user: User | undefined = await GetUserByName(username as string);

    if (!user) {
      res.status(NOT_FOUND).send(`fetchUserByName(): User not found.`);
    }

    res.status(OK_STATUS).send(user);
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`fetchUserByName(): ${err}`);
  }
}

/**
 * Delete a user by ID.
 */
export async function delUserByID(req: Request, res: Response) {
  const { id: userID } = req.params;

  if (!userID || isNaN(+userID)) {
    res
      .status(BAD_REQUEST)
      .send(`delUserByID(): userID must be a number. Received: ${userID}`);
    return;
  }

  try {
    const result = await DeleteUserByID(+userID);
    if (result) {
      res.status(OK_STATUS).send();
    } else {
      res.status(NOT_FOUND).send(`delUserByID(): User not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`delUserByID(): ${err}`);
  }
}

/**
 * Delete a user by username.
 */
export async function delUserByName(req: Request, res: Response) {
  const { username } = req.params;

  if (!username || typeof username !== 'string') {
    res
      .status(BAD_REQUEST)
      .send(`delUserByName(): username must be a string. Received: ${username}`);
    return;
  }

  try {
    const result = await DeleteUserByName(username);
    if (result) {
      res.status(OK_STATUS).send();
    } else {
      res.status(NOT_FOUND).send(`delUserByName(): User not found.`);
    }
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`delUserByName(): ${err}`);
  }
}
