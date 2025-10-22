import express from 'express';
import cors from 'cors';
import { BACKEND_PORT } from './constants';
import tripsRouter from './routers/trips';

export const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON into bodies automatically :)

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/trips', tripsRouter);

app.listen(BACKEND_PORT, () => {
  console.log(`Server running at http://localhost:${BACKEND_PORT}`);
});
