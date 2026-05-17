import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

export async function runMigrations() {
  const applied = (await sql`
    SELECT name FROM schema_migrations
  `).map((r) => r.name);

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.includes(file)) continue;
    const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    const statements = content.split(';').map((s) => s.trim()).filter(Boolean);
    for (const statement of statements) {
      await sql.unsafe(statement);
    }
    await sql`
      INSERT INTO schema_migrations (name, applied_at)
      VALUES (${file}, ${new Date().toISOString()})
    `;
    console.log(`Migration applied: ${file}`);
  }
}
