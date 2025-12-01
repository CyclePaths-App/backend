import type { Knex } from 'knex';
import dotenv from 'dotenv';

// Load env variables
dotenv.config();

// Use DATABASE_URL from .env
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env');
}

const MIGRATION_TABLE_NAME = 'knex_migrations';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: DATABASE_URL,
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
    connection: DATABASE_URL,
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
    connection: DATABASE_URL,
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

