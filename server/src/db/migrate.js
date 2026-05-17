import { sql } from './index.js';

const migrations = [
  {
    name: '001_initial.sql',
    statements: [
      `CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open'
          CHECK(status IN ('open','in_progress','done','closed')),
        upvotes INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status)`,
      `CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at)`,
      `CREATE TABLE IF NOT EXISTS votes (
        feedback_id TEXT NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
        voter_token TEXT NOT NULL,
        PRIMARY KEY (feedback_id, voter_token)
      )`,
      `CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TEXT NOT NULL
      )`,
    ],
  },
];

export async function runMigrations() {
  await sql(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `);

  const applied = (await sql`SELECT name FROM schema_migrations`).map((r) => r.name);

  for (const migration of migrations) {
    if (applied.includes(migration.name)) continue;
    for (const statement of migration.statements) {
      await sql(statement);
    }
    await sql`
      INSERT INTO schema_migrations (name, applied_at)
      VALUES (${migration.name}, ${new Date().toISOString()})
    `;
    console.log(`Migration applied: ${migration.name}`);
  }
}
