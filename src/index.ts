import express from 'express';
import cors from 'cors';
import authRouter from './routers/auth';
import { BACKEND_PORT } from './constants';
import tripsRouter from './routers/trips';
import usersRouter from './routers/users';
import pointsRouter from './routers/points';
import https from 'https';
import fs from 'fs';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/trips', tripsRouter);
app.use('/users', usersRouter);
app.use('/points', pointsRouter);

const options = {
  key: fs.readFileSync('cyclepaths.ssl.key'),
  cert: fs.readFileSync('cyclepaths.ssl.cert'),
};

const server = https.createServer(options, app);

server.listen(BACKEND_PORT, () => {
  console.log(`Server running at http://localhost:${BACKEND_PORT}`);
});
