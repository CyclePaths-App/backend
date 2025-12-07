import { Request, Response } from 'express';
import {
  createPoint,
  deletePoint,
  getPoint,
  getPoints,
  getPointsByTrip,
  updatePoint,
  WindowOptions,
} from '../logic/points';
import DB from '../config/knex';
import {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_ERROR,
  NOT_FOUND,
  OK_STATUS,
} from '../constants';
import { isTripType, TripType } from '../logic/trips';

/**
 * POST /api/points
 * Create a new point for a trip.
 */
export async function postPoint(req: Request, res: Response): Promise<void> {
  const { trip_id, longitude, latitude, time, speed } = req.body;

  // Check trip_id
  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(`createPoint(): trip_id must be a number. Received: ${trip_id}`);
    return;
  }

  // Check coordinates
  if (
    longitude === undefined ||
    latitude === undefined ||
    isNaN(+longitude) ||
    isNaN(+latitude)
  ) {
    res.status(BAD_REQUEST).send(
      `createPoint(): longitude and latitude must be numbers. 
       Received: longitude=${longitude}, latitude=${latitude}`
    );
    return;
  }

  // Check time
  if (!time) {
    res
      .status(BAD_REQUEST)
      .send(`createPoint(): time must be provided. Received: ${time}`);
    return;
  }

  // Check speed
  if (speed === undefined || isNaN(+speed)) {
    res
      .status(BAD_REQUEST)
      .send(`createPoint(): speed must be a number. Received: ${speed}`);
    return;
  }

  try {
    await createPoint(
      trip_id,
      longitude,
      latitude,
      new Date(time),
      speed,
      undefined
    );
    res.status(OK_STATUS).send({ message: 'Point created successfully.' });
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`createPoint(): ${err}`);
  }
}

/**
 * GET /api/points/trip/:trip_id
 * Get all points associated with a trip.
 */
export async function fetchPointsByTrip(req: Request, res: Response) {
  const { trip_id } = req.params;

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(
        `getPointsByTrip(): trip_id must be a number. Received: ${trip_id}`
      );
    return;
  }

  try {
    const points = await getPointsByTrip(+trip_id);
    res.status(OK_STATUS).send(points);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_ERROR)
      .send('fetchPointsByTrip(): Failed to get points.');
  }
}

/**
 * GET /api/points/:trip_id/:time
 * Get a specific point by trip_id and timestamp.
 */
export async function fetchPoint(req: Request, res: Response) {
  const { trip_id, time } = req.params;

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoint(): trip_id must be a number. Received: ${trip_id}`);
    return;
  }

  if (!time) {
    res.status(BAD_REQUEST).send('getPoint(): time parameter required.');
    return;
  }

  try {
    const point = await getPoint(+trip_id, new Date(time));

    if (point) res.status(OK_STATUS).send(point);
    else
      res
        .status(NOT_FOUND)
        .send('getPoint(): No point found for the given trip_id and time.');
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send(`fetchPoint(): Unknown error: ${error}`);
  }
}

/**
 * GET /points/:north/:south/:east/:west?type?justDestination
 * Get points in a specified location, optionally applying modifiers.
 */
export async function fetchPoints(req: Request, res: Response) {
  const { north, south, east, west } = req.params;
  const { type, justDestinations } = req.query;

  // Check the latitudes and longitudes.
  if (!north || isNaN(+north)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoints(): 'north' must be a number. Received: ${north}`);
    return;
  }
  if (!south || isNaN(+south)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoints(): 'south' must be a number. Received: ${south}`);
    return;
  }
  if (!east || isNaN(+east)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoints(): 'east' must be a number. Received: ${east}`);
    return;
  }
  if (!west || isNaN(+west)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoints(): 'west' must be a number. Received: ${west}`);
    return;
  }

  // Check the optional modifiers.
  if (type && !isTripType(type)) {
    res
      .status(BAD_REQUEST)
      .send(`getPoints(): 'type' must be a valid trip type. Received: ${type}`);
    return;
  }
  if (
    justDestinations &&
    justDestinations != 'false' &&
    justDestinations != 'true'
  ) {
    res
      .status(BAD_REQUEST)
      .send(
        `getPoints(): 'justDestinations' must be a boolean. Received: ${justDestinations}`
      );
    return;
  }

  const options: WindowOptions = {
    type: type as TripType | undefined, // We already checked above, but TS doesn't believe us.
    justDestinations: justDestinations as boolean | undefined,
  };

  getPoints(+north, +south, +east, +west, options)
    .then((points) => {
      if (points !== null) {
        res.status(OK_STATUS).send(points);
      } else {
        res
          .status(FORBIDDEN)
          .send(`Not enough users in this area to be deidentifiable.`);
      }
      return;
    })
    .catch((error) => {
      console.error(error);
      res.status(INTERNAL_ERROR).send(`fetchPoints(): Unknown Error: ${error}`);
      return;
    });
}

/**
 * PUT /api/points/:trip_id/:time
 * Update a point (speed or coordinates).
 */
export async function putPoint(req: Request, res: Response) {
  const { trip_id, time } = req.params;
  const { longitude, latitude, speed } = req.body;

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(`updatePoint(): trip_id must be a number. Received: ${trip_id}`);
    return;
  }

  if (!time) {
    res.status(BAD_REQUEST).send('updatePoint(): time parameter required.');
    return;
  }

  try {
    const result = await updatePoint(+trip_id, new Date(time), {
      longitude,
      latitude,
      speed,
    });

    if (result)
      res.status(OK_STATUS).send({ message: 'Point updated successfully.' });
    else res.status(NOT_FOUND).send('updatePoint(): Point not found.');
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send('updatePoint(): Failed to update point.');
  }
}

/**
 * DELETE /api/points/:trip_id/:time
 * Delete a specific point.
 */
export async function delPoint(req: Request, res: Response) {
  const { trip_id, time } = req.params;

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(`deletePoint(): trip_id must be a number. Received: ${trip_id}`);
    return;
  }

  if (!time) {
    res.status(BAD_REQUEST).send('deletePoint(): time parameter required.');
    return;
  }

  try {
    const deleted = await deletePoint(+trip_id, new Date(time));
    if (deleted) res.status(OK_STATUS).send();
    else res.status(NOT_FOUND).send('deletePoint(): No such point.');
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send('deletePoint(): Failed to delete point.');
  }
}

/**
 * GET /api/points/location/range?minLat=&maxLat=&minLon=&maxLon=
 * Get all points within a bounding box.
 */
export async function fetchPointsByLocation(req: Request, res: Response) {
  const { minLat, maxLat, minLon, maxLon } = req.query;

  if (
    minLat === undefined ||
    maxLat === undefined ||
    minLon === undefined ||
    maxLon === undefined
  ) {
    res
      .status(BAD_REQUEST)
      .send(
        'getPointsByLocation(): must provide minLat, maxLat, minLon, maxLon.'
      );
    return;
  }

  try {
    const points = await DB('points')
      .whereBetween('latitude', [Number(minLat), Number(maxLat)])
      .andWhereBetween('longitude', [Number(minLon), Number(maxLon)]);

    res.status(OK_STATUS).send(points);
  } catch (error) {
    console.error(error);
    res
      .status(INTERNAL_ERROR)
      .send('getPointsByLocation(): Unable to retrieve points.');
  }
}
