import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'feedback.db');

let instance = null;

export function getDb() {
  if (!instance) {
    instance = new DatabaseSync(DB_PATH);
    instance.exec('PRAGMA journal_mode = WAL');
    instance.exec('PRAGMA foreign_keys = ON');
  }
  return instance;
}
