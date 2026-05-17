import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

import app from './app.js';
import { runMigrations } from './db/migrate.js';

const PORT = process.env.PORT || 3001;

await runMigrations();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
