import { Request, Response } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import DB from '../config/knex';
import {
  ACCESS_TTL,
  BAD_REQUEST,
  CONFLICT,
  JWT_ACCESS_SECRET,
  OK_STATUS,
  UNAUTHORIZED,
} from '../constants';

// Use JWT secret + TTL from env (with defaults for dev)
const ACCESS_SECRET = JWT_ACCESS_SECRET;
function signAccess(userId: number) {
  return jwt.sign({ uid: userId }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}

// POST /auth/register
export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ error: 'Email and password are required' });
  }

  try {
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    // ⚠️ VERY IMPORTANT: only email + password (no username)
    const [user] = await DB('users')
      .insert({ email, password: hash }) // DB column is "password"
      .returning(['id', 'email']);

    return res.status(OK_STATUS).json({
      id: user.id,
      email: user.email,
    });
  } catch (err: any) {
    console.error('register error:', err);
    // likely a duplicate email (unique constraint on email)
    return res
      .status(CONFLICT)
      .json({ error: 'Email already exists or DB error' });
  }
}

// POST /auth/login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .json({ error: 'Email and password are required' });
  }

  const user = await DB('users').where({ email }).first();

  if (!user) {
    return res.status(UNAUTHORIZED).json({ error: 'Invalid credentials' });
  }

  // DB column is "password" (hashed)
  const ok = await argon2.verify(user.password, password);
  if (!ok) {
    return res.status(UNAUTHORIZED).json({ error: 'Invalid credentials' });
  }

  const accessToken = signAccess(user.id);

  return res.json({
    accessToken,
    user: {
      id: user.id,
      email: user.email,
    },
  });
}

// GET /auth/me (protected)
export async function me(req: Request, res: Response) {
  // requireAuth middleware puts decoded token on req.user
  const user = (req as any).user;
  return res.json({ user });
}
