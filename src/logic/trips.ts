import DB from '../config/knex';
import { createPoint, Point } from './points';
import * as turf from '@turf/turf';

//#region Create

/**
 * Creates a trip, and populates the points that make up said trip.
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

  const { points, distance } = preprocessTrip(trip);

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
        point.speed,
        trx
      );
    });

    return id;
  }).catch((err) => {
    console.error(`createTrip(): ${err}`);
    throw err;
  });
}

//#endregion

//#region Read

/**
 * Gets the requested trip. Throws error if the trip doesn't exist.
 *
 * @param trip_id The ID of the desired trip.
 * @returns The requested trip.
 */
export async function getTrip(trip_id: number): Promise<Trip | undefined> {
  try {
    const row = await DB.select('*')
      .from('trips')
      .where({ id: trip_id })
      .first();

    if (!row) {
      return undefined;
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

/**
 * Gets all trips associated with a user. Returns an empty array if the user doesn't
 * exist, or if there are no trips associated with the user.
 *
 * @param user_id The user_id associated with the desired trips.
 * @returns An Array of Trips associated with the passed user_id.
 */
export async function getTripsByUserId(user_id: number): Promise<Trip[]> {
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

//#endregion

//#region Update

/**
 * Updates the distance and type of the specified trip.
 *
 * @param id The TripID of the trip to be updated.
 * @param _user_id The user_id of the trip to be updated. Not currently in use, but it
 * could be useful for authorization.
 * @param distance The new distance of the trip.
 * @param trip_type The new type of the trip.
 * @returns True if the trip is updated successfully, false otherwise.
 */
export async function updateTrip(
  id: number,
  _user_id: number,
  distance: number,
  trip_type: TripType
): Promise<boolean> {
  try {
    const amount_updated = await DB('trips')
      .update({ distance: distance, trip_type: trip_type })
      .where({ id: id });

    if (amount_updated > 1) {
      throw Error(
        `updateTrip(): Multiple entries were updated after changing one trip ID. Gods help us if this ever happens.`
      );
    }

    return amount_updated == 1;
  } catch (err) {
    throw Error(`updateTrip(): Unexpected error: ${err}`);
  }
}

//#endregion

//#region Delete.

/**
 * Deletes the trip with the passed trip_id.
 *
 * @param id The trip_id of the trip to be deleted.
 * @returns True if the trip is deleted successfully. False othewise.
 */
export async function deleteTrip(id: number): Promise<boolean> {
  try {
    const amount_deleted = await DB('trips').delete().where({ id: id });

    if (amount_deleted > 1) {
      throw Error('deleteTrip(): Something really wrong has happened.');
    }

    return amount_deleted == 1;
  } catch (err) {
    throw Error(`deleteTrip(): Unexpected error: ${err}`);
  }
}

/**
 * Deletes all trips associated with a user_id.
 *
 * @param user_id The user_id associated with the trips to be deleted.
 * @returns The amount of trips deleted.
 */
export async function deleteTripsByUserId(user_id: number): Promise<number> {
  try {
    const amount_deleted = await DB('trips')
      .delete()
      .where({ user_id: user_id });

    return amount_deleted;
  } catch (err) {
    throw Error(`deleteTrip(): Unexpected error: ${err}`);
  }
}

//#endregion

//#region Utility Functions

/**
 * Process the trip by calculating the total distance and the speed at each point in the trip.
 *
 * @param trip The sequence of Locations from the tracked trip.
 * @returns Points with the estimated speed, and the overall distance of the trip.
 */
function preprocessTrip(trip: Location[]): {
  points: Point[];
  distance: number;
} {
  let distance = 0;
  const points: Point[] = [];

  // Sort by time, so we can easily compare each point to it's neighbor.
  trip.sort((a, b) => a.time.getTime() - b.time.getTime());

  if (trip[0])
    // Only checking to make TS happy. Should be defined.
    points.push({
      trip_id: -1, // Scrub out until we get the trip_id
      longitude: trip[0].longitude,
      latitude: trip[0].latitude,
      time: trip[0].time,
      speed: 0,
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

    // Create Line with Turf
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
      trip_id: -1, // Scrub out until we get the trip_id.
      longitude: current_point.longitude,
      latitude: current_point.latitude,
      time: current_point.time,
      speed: speed,
    });
  }

  return { points, distance };
}

//#endregion

//#region Types

export type Trip = {
  id: number;
  user_id: number;
  distance: number;
  trip_type: TripType; // TS enum Declaration
};

export type TripType = 'bike' | 'walk';

export function isTripType(obj: any): obj is TripType {
  return obj === 'bike' || obj === 'walk';
}

export type Location = {
  latitude: number;
  longitude: number;
  time: Date;
};

export function isLocation(obj: any): obj is Location {
  return 'latitude' in obj && 'longitude' in obj && 'time' in obj;
}

//#endregion
