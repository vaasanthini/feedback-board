import express from 'express';
import cors from 'cors';
import feedbackRouter from './feedback/router.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  exposedHeaders: ['x-voter-token'],
}));
app.use(express.json());

app.use('/api/feedback', feedbackRouter);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

export default app;
