import { Request, Response, NextFunction } from 'express';

const UNAUTHORIZED = 401;

export default function requireApiKey(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const expectedKey = process.env.API_KEY;

  if (!expectedKey) {
    console.error('API_KEY is not set in environment');
    return res.status(500).json({ error: 'Server misconfigured: API key missing' });
  }

  const clientKey = req.header('x-api-key');

  if (!clientKey || clientKey !== expectedKey) {
    return res.status(UNAUTHORIZED).json({ error: 'Invalid API key' });
  }

  return next();
}

