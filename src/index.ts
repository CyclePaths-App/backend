import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth';
import { BACKEND_PORT } from './constants';
import tripsRouter from './routers/trips';
import usersRouter from './routers/users';
import pointsRouter from './routers/points';
import requireAuth from './middleware/requireAuth';
import requireApiKey from './middleware/requireApiKey';

export const app = express();

app.use(cors());
app.use(express.json());

// Public auth routes (register/login/me lives inside authRouter)
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

// Protected data routes: need BOTH x-api-key + JWT
app.use('/trips', requireApiKey, requireAuth, tripsRouter);
app.use('/users', requireApiKey, requireAuth, usersRouter);
app.use('/points', requireApiKey, requireAuth, pointsRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`Server running at http://localhost:${BACKEND_PORT}`);
});

