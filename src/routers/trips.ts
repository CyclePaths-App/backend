import express from 'express';
import {
  delTrip,
  fetchTrip,
  fetchTripsByUserId,
  postTrip,
  postTripsInBulk,
  putTrip,
} from '../controllers/trips';

const BASE_URL = '/';
const router = express.Router();

router.post(BASE_URL, postTrip);
router.post(BASE_URL + 'bulk/', postTripsInBulk);

router.get(BASE_URL + ':id', fetchTrip);
router.get(BASE_URL + 'userid/:id', fetchTripsByUserId);

router.put(BASE_URL, putTrip);

router.delete(BASE_URL, delTrip);

export default router;
