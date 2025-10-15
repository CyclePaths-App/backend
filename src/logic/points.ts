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

export async function getPointsByTrip(trip_id: number): Promise<Point[]> {
  try {
    const rows = await DB.select('*')
      .from('points')
      .where({ trip_id })
      .orderBy('time', 'asc');

    const points: Point[] = rows.map((row) => ({
      trip_id: row.trip_id,
      longitude: row.longitude,
      latitude: row.latitude,
      time: row.time,
      speed: row.speed_mps,
    }));

    return points ?? [];
  } catch (err: any) {
    console.error(err);
    throw Error(`getPointsByTrip(): ${err.message}`);
  }
}

export async function getPoint(trip_id: number, time: Date): Promise<Point> {
  try {
    const row = await DB.select('*')
      .from('points')
      .where({ trip_id, time })
      .first();

    if (!row) {
      throw Error(
        `getPoint(): No point found for trip_id ${trip_id} at ${time.toISOString()}`
      );
    }
    const point: Point = {
      trip_id: row.trip_id,
      longitude: Number.parseFloat(row.longitude),
      latitude: Number.parseFloat(row.latitude),
      time: row.time,
      speed: Number.parseFloat(row.speed_mps),
    };

    return point;
  } catch (err: any) {
    console.error(err);
    throw Error(`getPoint(): ${err.message}`);
  }
}
export async function updatePoint(
  trip_id: number,
  time: Date,
  data: Partial<Point>
): Promise<boolean> {
  try {
    const res = await DB('points').where({ trip_id, time }).update({
      longitude: data.longitude,
      latitude: data.latitude,
      speed_mps: data.speed,
    });

    if (res === 0) {
      throw Error(
        `updatePoint(): No point found to update for trip_id ${trip_id} at ${time.toISOString()}`
      );
    }

    return true;
  } catch (err: any) {
    console.error(err);
    throw Error(`updatePoint(): ${err.message}`);
  }
}

export async function deletePoint(
  trip_id: number,
  time: Date
): Promise<boolean> {
  try {
    const res = await DB('points').where({ trip_id, time }).delete();

    if (res === 0) {
      throw Error(
        `deletePoint(): No point found to delete for trip_id ${trip_id} at ${time.toISOString()}`
      );
    }

    return true;
  } catch (err: any) {
    console.error(err);
    throw Error(`deletePoint(): ${err.message}`);
  }
}
