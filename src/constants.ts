import dotenv from 'dotenv';

dotenv.config();

// Statuses
export const OK_STATUS = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const INTERNAL_ERROR = 500;
export const NOT_IMPLEMENTED = 501;

export const DEIDENTIFIABLE_MIN = 100;

// Networking configuration
export const BACKEND_PORT = Number(process.env.PORT) || 8000;

// DB Connection
export const DB_HOST = process.env.DB_HOST ?? 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USER = process.env.DB_USER ?? 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? '123abc456efg';
export const DB_DATABASE = process.env.DB_DATABASE ?? 'cyclepaths_db';

export const CONNECTION_STRING =
  process.env.DATABASE_URL ??
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// Authentication.
export const DEV = process.env.DEV ?? false;

export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'dev-access-secret';
export const JWT_REFRESH_SECRET =
  process.env.JWT_ACCESS_SECRET ?? 'dev-refresh-secret';

export const ACCESS_TTL: number = Number(process.env.ACCESS_TTL) || 60 * 15;
export const REFRESH_TTL: number =
  Number(process.env.REFRESH_TTL) || 60 * 60 * 24 * 14;
export const API_KEYS = process.env.API_KEYS;
