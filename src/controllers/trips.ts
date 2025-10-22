import { Request, Response } from 'express';
import {
  createTrip,
  deleteTrip,
  getTrip,
  getTripsByUserId,
  isTripType,
  Location,
  updateTrip,
} from '../logic/trips';
import {
  BAD_REQUEST,
  INTERNAL_ERROR,
  NOT_FOUND,
  OK_STATUS,
} from '../constants';

export async function postTrip(req: Request, res: Response): Promise<void> {
  //console.log(req.body);
  const { user_id, trip, trip_type } = req.body;

  // Check user_id
  if (!user_id || isNaN(user_id)) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): user_id must be a number. Received: ${user_id}`,
    });
  }
  // Check trip array
  if (!trip || Array.isArray(trip) == false || trip.length < 2) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): trips must be an array of Trips. Received: ${trip}`,
    });
  }
  // Convert the dates in each location to a date.
  const checked_trip: Location[] = trip.map(
    (location: { latitude: number; longitude: number; time: string }) => {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        time: new Date(location.time),
      };
    }
  );
  // Check trip_type
  if (!trip_type || isTripType(trip_type) == false) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): trip_type must be either \`bike\` or \`walk\`. Received: ${trip_type}`,
    });
  }

  try {
    const id = await createTrip(user_id, checked_trip, trip_type);

    if (id === -1) {
      res
        .status(INTERNAL_ERROR)
        .send({ message: 'createTrip(): Could not create trip.' });
    } else {
      res.status(OK_STATUS).send({
        id: id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send({ message: err });
  }
}

export async function fetchTrip(req: Request, res: Response) {
  const { id: trip_id } = req.params; // Have to use params for get requests.

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(`getTrip(): trip_id must be a number. Received: ${trip_id}`);
  }

  try {
    const trip = await getTrip(+(trip_id ?? -1)); // Nonsense casting it to a number, and using -1 if it is undefined. Should never be undefined because of the if statement.

    if (trip) res.status(OK_STATUS).send(trip);
    else
      res
        .status(NOT_FOUND)
        .send('getTrip(): The trip you are looking for does not exist.');
  } catch (err) {
    console.error(err);
    res.status(INTERNAL_ERROR).send(`fetchTrip(): Unknown error: ${err}`);
  }
}

export async function fetchTripsByUserId(req: Request, res: Response) {
  const { id: user_id } = req.params;

  if (!user_id || isNaN(+user_id)) {
    res
      .status(BAD_REQUEST)
      .send(`Cannot get trips. user_id must be a number. Received: ${user_id}`);
  }

  try {
    const trips = await getTripsByUserId(+(user_id ?? -1)); // Nonsense casting it to a number, and using -1 if it is undefined. Should never be undefined because of the if statement.

    res.status(OK_STATUS).send(trips);
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send('fetchTripsByUserId: Unable to get trips.');
  }
}

export async function putTrip(req: Request, res: Response) {
  const { id, user_id, distance, trip_type } = req.body;

  // Check id
  if (!id || Number.isNaN(id)) {
    res.status(BAD_REQUEST).send({
      message: `Cannot update trip. id must be a number. Received: ${id}`,
    });
  }
  // Check user_id
  if (!user_id || Number.isNaN(user_id)) {
    res.status(BAD_REQUEST).send({
      message: `Cannot update trip. user_id must be a number. Received: ${user_id}`,
    });
  }
  // Check distance
  if (distance && isNaN(distance)) {
    res.status(BAD_REQUEST).send({
      message: `Cannot update trip. distance must be a number. Received: ${distance}`,
    });
  }
  // Check trip_type
  if (trip_type && isTripType(trip_type) == false) {
    res.status(BAD_REQUEST).send({
      message: `Cannot update trip. trip_type must be either \`bike\` or \`walk\`. Received: ${trip_type}`,
    });
  }

  try {
    if (await updateTrip(id, user_id, distance, trip_type)) {
      res.status(OK_STATUS).send();
    } else {
      res.status(NOT_FOUND).send('No such trip.');
    }
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send('Failed to update trip.');
  }
}

export async function delTrip(req: Request, res: Response) {
  const { id: trip_id } = req.body;

  if (!trip_id || isNaN(+trip_id)) {
    res
      .status(BAD_REQUEST)
      .send(
        `Unable to delete trip. trip_id must be a number. Received: ${trip_id}`
      );
  }

  try {
    if (await deleteTrip(trip_id)) {
      res.status(OK_STATUS).send();
    } else {
      res.status(NOT_FOUND).send('Failed to delete trip.');
    }
  } catch (error) {
    console.error(error);
    res.status(INTERNAL_ERROR).send('Failed to delete trip.');
  }
}
