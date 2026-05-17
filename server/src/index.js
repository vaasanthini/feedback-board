import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate.js';
import feedbackRouter from './feedback/router.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  exposedHeaders: ['x-voter-token'],
}));
app.use(express.json());

runMigrations();

app.use('/api/feedback', feedbackRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
