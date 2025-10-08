import type { Knex } from 'knex';
import dotenv from 'dotenv';

// Get env variables
dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
export const CONNECTION_STRING = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

const MIGRATION_TABLE_NAME = 'knex_migrations'; // Be lazy

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: CONNECTION_STRING,
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: MIGRATION_TABLE_NAME,
    },
  },
  staging: {
    client: 'postgresql',
    connection: CONNECTION_STRING,
    debug: true,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: MIGRATION_TABLE_NAME,
    },
  },
  production: {
    client: 'postgresql',
    connection: CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: MIGRATION_TABLE_NAME,
    },
  },
};

export default config;
