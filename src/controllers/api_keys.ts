import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { FORBIDDEN } from '../constants';
dotenv.config();

const keysEnv = (process.env.API_KEYS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const VALID_KEYS = new Set(keysEnv);

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.header('X-API-Key');
  if (!key || !VALID_KEYS.has(key)) {
    return res.status(FORBIDDEN).json({ error: 'Invalid or missing API key' });
  }
  return next();
}
