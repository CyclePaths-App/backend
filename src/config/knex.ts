import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;

const DB: any = knex({
  client: 'postgresql',
  connection: {
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
  },
  pool: { min: 0, max: 10 },
});

export default DB;

export const onDatabaseConnect = async () => {
  await DB.raw('SELECT 1');
};
