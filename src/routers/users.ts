import express from 'express';
import {
  postUser,
  fetchUserByID,
  fetchUserByName,
  delUserByID,
  delUserByName,
} from '../controllers/users';

const BASE_URL = '/';
const router = express.Router();

// Create a new user
router.post(BASE_URL, postUser);

// Fetch a user by ID
router.get(BASE_URL + ':id', fetchUserByID);

// Fetch a user by username
router.get(BASE_URL + 'username/:username', fetchUserByName);

// Delete a user by ID
router.delete(BASE_URL + ':id', delUserByID);

// Delete a user by username
router.delete(BASE_URL + 'username/:username', delUserByName);

export default router;