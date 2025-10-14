import { Knex } from 'knex';
import DB from '../config/knex';

export async function createPoint(
  trip_id: number,
  longitude: number,
  latitude: number,
  time: Date,
  speed: number,
  trx: Knex.Transaction<any, any[]> | undefined
) {
  const db = trx ?? DB; // Lets us use the function as part of a transaction.
  const newPoint = { trip_id, longitude, latitude, time, speed_mps: speed };

  await db
    .insert(newPoint)
    .into('points')
    .catch((err) => {
      throw err;
    });
}

export type Point = {
  trip_id: number;
  longitude: number;
  latitude: number;
  time: Date;
  speed: number;
};
