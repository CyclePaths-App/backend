import { Request, Response } from 'express';
import { createTrip, getTrip, isTripType } from '../logic/trips';
import {
  BAD_REQUEST,
  INTERNAL_ERROR,
  NOT_FOUND,
  OK_STATUS,
} from '../constants';

export async function postTrip(req: Request, res: Response): Promise<void> {
  console.log(req.body);
  const { user_id, trip, trip_type } = req.body;

  if (!user_id || Number.isNaN(user_id)) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): user_id must be a number. Received: ${user_id}`,
    });
  }
  if (!trip || Array.isArray(trip) == false) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): trips must be an array of Trips. Received: ${trip_type}`,
    });
  }
  if (!trip_type || isTripType(trip_type) == false) {
    res.status(BAD_REQUEST).send({
      message: `createTrip(): trip_type must be either \`bike\` or \`walk\`. Received: ${trip_type}`,
    });
  }

  try {
    const id = await createTrip(user_id, trip, trip_type);

    if (id === -1) {
      res
        .status(INTERNAL_ERROR)
        .send({ message: 'createTrip(): An unknown error has occurred.' });
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

  if (!trip_id || Number.isNaN(trip_id)) {
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
