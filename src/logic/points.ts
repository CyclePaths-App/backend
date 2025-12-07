import { Knex } from 'knex';
import DB from '../config/knex';
import { TripType } from './trips';
import { DEIDENTIFIABLE_MIN } from '../constants';

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

export async function getPointsByTrip(trip_id: number): Promise<Point[]> {
  try {
    const rows = await DB.select('*')
      .from('points')
      .where({ trip_id })
      .orderBy('time', 'asc');

    const points: Point[] = rows.map((row) => ({
      trip_id: Number(row.trip_id),
      longitude: Number(row.longitude),
      latitude: Number(row.latitude),
      time: row.time,
      speed: Number(row.speed_mps),
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

/**
 * getPoints(): Gets the points in a specified area to be displayed to the screen.
 *
 * @param northLat The northern bound of the window to be displayed.
 * @param southLat The southern bound of the window to be displayed.
 * @param eastLong The eastern bound of the window to be displayed.
 * @param westLong The western bound of the window to be displayed.
 * @param options Options to modify which points get presented.
 *
 * @returns An array of points following the above parameters, or NULL if there are not
 * enough users in the window to be deidentifiable.
 */
export async function getPoints(
  northLat: number,
  southLat: number,
  eastLong: number,
  westLong: number,
  options?: WindowOptions
): Promise<Partial<Point>[] | null> {
  try {
    const userCount = await DB.raw(
      `SELECT COUNT(user_id) ` +
        `FROM (SELECT DISTINCT trip_id ` +
        `FROM points ` +
        `WHERE latitude BETWEEN ${southLat} AND ${northLat} ` +
        `AND longitude BETWEEN ${eastLong} AND ${westLong}) ` +
        `AS p JOIN trips AS t ON p.trip_id = t.id`
    );

    if (userCount.rows[0].count < DEIDENTIFIABLE_MIN) {
      return null;
    }

    const query = DB.select('*').from('points as p1');

    // If destinations is defined and true
    if (options?.justDestinations) {
      query.where(
        DB.raw(
          // Only accept the earliest and latest point in each trip.
          '(time = ' +
            '(SELECT MAX(time)' + // where the point has the same time as the latest time in each trip
            ' FROM points p2' +
            ' WHERE p1.trip_id = p2.trip_id' +
            ') OR time = (' +
            'SELECT MIN(time)' + // OR where the point has the earliest time in each trip.
            ' FROM points p2' +
            ' WHERE p1.trip_id = p2.trip_id)' +
            ')'
        )
      );
    }
    // Only choose the points inside the window.
    query
      .andWhereBetween('longitude', [eastLong, westLong])
      .andWhereBetween('latitude', [southLat, northLat]);

    // If a type is selected, only return points of the selected type.
    if (options?.type) {
      query.where(
        'trip_id',
        'in',
        DB.select('id').from('trips').where('trip_type', options.type)
      );
    }

    const rows = await query;

    const points: Partial<Point>[] = rows.map((row) => ({
      longitude: Number(row.longitude),
      latitude: Number(row.latitude),
      time: row.time,
      speed: Number(row.speed_mps),
    }));
    return points;
  } catch (error) {
    console.error(error);
    throw error;
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

export type Point = {
  trip_id: number;
  longitude: number;
  latitude: number;
  time: Date;
  speed: number;
};

export type WindowOptions = {
  type?: TripType;
  justDestinations?: Boolean;
};
