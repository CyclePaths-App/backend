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
    const time_difference = // Need time in seconds
      (previous_point.time.getTime() - current_point.time.getTime()) * 1000;
    distance += point_distance;
    const speed = time_difference == 0 ? 0 : point_distance / time_difference;

    points.push({
      longitude: current_point.longitude,
      latitude: current_point.latitude,
      time: current_point.time,
      speed_mps: speed,
    });
  }

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
      throw Error(`createTrip(): Error creating trip, got ${res.length} IDs.`);
    }
    const id = res[0].id;

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

    return id ?? -1;
  }).catch((err) => {
    console.error(`createTrip(): ${err}`);
    throw err;
  });
}

/*
| Column   | Type     | Comments                                      |
| -------- | -------- | --------------------------------------------- |
| id       | serial   | Primary key                                   |
| user_id  | int      | Foreign key from users                        |
| distance | float    | needs to handle decimals, measured in meters? |
| start    | lat/long | needs to handle decimals to 5 decimal points  |
| end      | lat/long | needs to handle decimals to 5 decimal points  |
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
