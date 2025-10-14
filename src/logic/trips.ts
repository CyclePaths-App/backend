import DB from '../config/knex';
import { createPoint } from './points';
import * as turf from '@turf/turf';

/**
 *
 * @param user_id
 * @param trip
 * @param trip_type
 * @returns
 */
export async function createTrip(
  user_id: number,
  trip: Location[],
  trip_type: TripType
): Promise<number> {
  // Check that there are enough points for a trip.
  if (trip.length < 2) {
    throw Error('createTrip(): Trip must have points');
  }

  // Setup trip preprocessing.
  let distance = 0;
  trip.sort((a, b) => a.time.getTime() - b.time.getTime());
  const points: {
    longitude: number;
    latitude: number;
    time: Date;
    speed_mps: number;
  }[] = [];

  if (trip[0])
    // Only checking to make TS happy. Should be defined.
    points.push({
      longitude: trip[0].longitude,
      latitude: trip[0].latitude,
      time: trip[0].time,
      speed_mps: 0,
    });

  // Get each location's speed and wrap into a nice array.
  for (let i = 1; i < trip.length; i++) {
    // Unwrap points because TS gets upset when you access an object array.
    const previous_point: Location = {
      latitude: trip[i - 1]?.latitude ?? -1,
      longitude: trip[i - 1]?.longitude ?? -1,
      time: trip[i - 1]?.time ?? new Date(1969, 12, 31, 23, 59, 60, 9999),
    };
    const current_point: Location = {
      latitude: trip[i]?.latitude ?? -1,
      longitude: trip[i]?.longitude ?? -1,
      time: trip[i]?.time ?? new Date(1969, 12, 31, 23, 59, 60, 9999),
    };

    // Create Turf Line
    let line = turf.lineString([
      [previous_point.longitude, previous_point.latitude],
      [current_point.longitude, current_point.latitude],
    ]);

    // Calculate distance and speed
    const point_distance = turf.length(line, { units: 'meters' });
    const time_difference =
      (previous_point.time.getTime() - current_point.time.getTime()) * 1000; // Time in seconds.
    distance += point_distance;
    const speed = time_difference == 0 ? 0 : point_distance / time_difference; // If the time difference is 0, set speed to 0 instead of infinity.

    points.push({
      longitude: current_point.longitude,
      latitude: current_point.latitude,
      time: current_point.time,
      speed_mps: speed,
    });
  }

  // Transaction, because if one point fails, we need to undo everything.
  return await DB.transaction(async (trx) => {
    const db_trip = {
      user_id: user_id,
      distance: distance.toFixed(),
      trip_type: trip_type,
    };

    const res: { id: number }[] = await trx('trips')
      .insert(db_trip)
      .returning('id')
      .catch((err) => {
        const err_mes: string = err.message;
        if (err_mes.includes('trips_user_id_foreign'))
          throw Error(`createTrip(): User_id ${user_id} does not exist.`);
        else throw Error(`createTrip(): Uncaught error: ${err_mes}`);
      });
    if (!res[0]) {
      // Really shouldn't happen, but checking to appease TS.
      throw Error(`createTrip(): Error creating trip, got ${res.length} IDs.`);
    }
    const id = res[0].id;

    // Add each point.
    points.forEach((point) => {
      createPoint(
        id,
        point.longitude,
        point.latitude,
        point.time,
        point.speed_mps,
        trx
      );
    });

    return id;
  }).catch((err) => {
    console.error(`createTrip(): ${err}`);
    throw err;
  });
}

export async function getTrip(trip_id: number): Promise<Trip> {
  try {
    const row = await DB.select('*')
      .from('trips')
      .where({ id: trip_id })
      .first();

    if (!row) {
      throw Error(`getTrip(): No such trip.`);
    }

    const trip: Trip = {
      id: row.id,
      user_id: row.user_id,
      distance: row.distance,
      trip_type: row.trip_type,
    };

    return trip;
  } catch (err) {
    console.error(err);
    throw Error(`getTrip(): Unknown Error: ${err}`);
  }
}

export async function getTripByUserId(user_id: number): Promise<Trip[]> {
  try {
    const rows = await DB.select('*').from('trips').where({ user_id: user_id });

    const trips: Trip[] = rows.map((row) => {
      return {
        id: row.id,
        user_id: row.user_id,
        distance: row.distance,
        trip_type: row.trip_type,
      };
    });

    return trips;
  } catch (err) {
    console.error(err);
    throw Error(`getTrip(): Unknown Error: ${err}`);
  }
}

// export async function updateTrip(
//   id: number,
//   user_id: number,
//   distance: number,
//   trip_type: TripType
// ): Promise<boolean> {

// }

/*
| Column   | Type     | Comments                                      |
| -------- | -------- | --------------------------------------------- |
| id       | serial   | Primary key                                   |
| user_id  | int      | Foreign key from users                        |
| distance | float    | needs to handle decimals, measured in meters? |
| type     | enum     | walking or cycling?                           |
*/

export type Trip = {
  id: number;
  user_id: number;
  distance: number;
  trip_type: TripType; // TS enum Declaration
};

export type TripType = 'bike' | 'walk';

export type Location = {
  latitude: number;
  longitude: number;
  time: Date;
};
