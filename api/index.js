import app from '../server/src/app.js';
import { runMigrations } from '../server/src/db/migrate.js';

const migrationPromise = runMigrations().catch(console.error);

export default async function handler(req, res) {
  await migrationPromise;
  return app(req, res);
}
