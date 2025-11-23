import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Supports multiple comma-separated keys
const VALID_KEYS = new Set(
  (process.env.API_KEYS || '')
    .split(',')
    .map((key) => key.trim())
    .filter(Boolean)
);

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.header('X-API-Key');
  if (!key || !VALID_KEYS.has(key)) {
    return res.status(403).json({ error: 'Invalid or missing API key' });
  }
  next();
}
