import express from 'express';
import cors from 'cors';
import { BACKEND_PORT } from './constants';
import tripsRouter from './routers/trips';
import pointsRouter from './routers/points';
import heatmapRouter from './routers/heatmap';

export const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON into bodies automatically


app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/trips', tripsRouter);
app.use('/points', pointsRouter);
app.use('/heatmap', heatmapRouter);


app.listen(BACKEND_PORT, () => {app.use('/heatmap', heatmapRouter);
  console.log(`Server running at http://localhost:${BACKEND_PORT}`);
});
