import knex from 'knex';
import { CONNECTION_STRING } from '../constants';

const DB = knex({
  client: 'postgresql',
  connection: CONNECTION_STRING,
  debug: true,
  pool: { min: 0, max: 10 },
});

export const onDatabaseConnect = async () => {
  await DB.raw('SELECT 1');
};

export default DB;
