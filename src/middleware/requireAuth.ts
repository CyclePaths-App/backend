import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DEV, UNAUTHORIZED } from '../constants';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';

export interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

export default function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // In dev mode, skip auth completely
  if (DEV) {
    return next();
  }

  const header = req.headers.authorization;

  // No header at all
  if (!header) {
    return res
      .status(UNAUTHORIZED)
      .json({ error: 'Missing Authorization header' });
  }

  const [scheme, token] = header.split(' ');

  // Wrong format or missing token
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
    return res
      .status(UNAUTHORIZED)
      .json({ error: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    // Attach user payload for later handlers
    req.user = payload;
    return next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res
      .status(UNAUTHORIZED)
      .json({ error: 'Invalid or expired token' });
  }
}

