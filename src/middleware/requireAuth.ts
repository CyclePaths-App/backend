import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DEV, UNAUTHORIZED } from '../constants';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'dev-access-secret';

export default function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (DEV) {
    return next();
  } else {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (!token || scheme !== 'Bearer') {
      return res
        .status(UNAUTHORIZED)
        .json({ error: 'Missing or invalid Authorization header' });
    }

    try {
      const payload = jwt.verify(token, ACCESS_SECRET);
      (req as any).user = payload;
      return next();
    } catch {
      return res
        .status(UNAUTHORIZED)
        .json({ error: 'Invalid or expired token' });
    }
  }
}
