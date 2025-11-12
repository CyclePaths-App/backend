import dotenv from 'dotenv';
dotenv.config();


export const OK_STATUS = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const INTERNAL_ERROR = 500;
export const NOT_IMPLEMENTED = 501;


export const BACKEND_PORT = Number(process.env.PORT) || 8000;

export const DB_HOST = process.env.DB_HOST ?? 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USER = process.env.DB_USER ?? 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD ?? '123abc456efg';
export const DB_DATABASE = process.env.DB_DATABASE ?? 'cyclepaths_db';


export const CONNECTION_STRING =
  process.env.DATABASE_URL ??
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
