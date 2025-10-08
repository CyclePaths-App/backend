import type { Knex } from 'knex';
import { CONNECTION_STRING } from './src/constants';

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
      tableName: 'knex_migrations',
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
      tableName: 'knex_migrations',
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
      tableName: 'knex_migrations',
    },
  },
};

export default config;
