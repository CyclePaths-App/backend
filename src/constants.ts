import dotenv from 'dotenv';

// HTTP Codes
export const OK_STATUS = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const NOT_FOUND = 404;
export const INTERNAL_ERROR = 500;
export const NOT_IMPLEMENTED = 501;

// DB Config
dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
export const CONNECTION_STRING = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
