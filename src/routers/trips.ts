import express from 'express';
import { fetchTrip, fetchTripsByUserId, postTrip } from '../controllers/trips';

const BASE_URL = '/';
const router = express.Router();

router.post(BASE_URL, postTrip);

router.get(BASE_URL + ':id', fetchTrip);

router.get(BASE_URL + 'userid/:id', fetchTripsByUserId);

// router.put(BASE_URL);

// router.delete(BASE_URL);

// router.delete(BASE_URL + 'byUser/');

export default router;
