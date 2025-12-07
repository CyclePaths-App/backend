import express from 'express';
import {
  postPoint,
  fetchPointsByTrip,
  fetchPoint,
  putPoint,
  delPoint,
  fetchPointsByLocation,
  fetchPoints,
} from '../controllers/points';

const BASE_URL = '/';
const router = express.Router();

router.post(BASE_URL, postPoint);

router.get(BASE_URL + 'trip/:trip_id', fetchPointsByTrip);

router.get(BASE_URL + ':trip_id/:time', fetchPoint);

router.get(BASE_URL + ':north/:south/:east/:west', fetchPoints);

router.put(BASE_URL + ':trip_id/:time', putPoint);

router.delete(BASE_URL + ':trip_id/:time', delPoint);

router.get(BASE_URL + 'location/range', fetchPointsByLocation);

export default router;
