import express from 'express';
import {
  postUser,
  fetchUserByID,
  delUserByID,
  delUserByName,
  postLoginUser,
} from '../controllers/users';

const router = express.Router();

// Create a new user
router.post('/', postUser);
// Send user login and retrieve user information.
router.post('/login', postLoginUser);

// Fetch user by ID
router.get('/:id', fetchUserByID);

// Fetch user by username
// router.get('/username/:username', fetchUserByNameAndPassword);

// Delete user by ID
router.delete('/:id', delUserByID);

// Delete user by username
router.delete('/username/:username', delUserByName);

export default router;