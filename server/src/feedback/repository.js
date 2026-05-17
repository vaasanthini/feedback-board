import { getDb } from '../db/index.js';

export function findAll({ status, sort, voterToken }) {
  const db = getDb();
  let query = `
    SELECT f.*,
      CASE WHEN v.voter_token IS NOT NULL THEN 1 ELSE 0 END AS has_voted
    FROM feedback f
    LEFT JOIN votes v ON v.feedback_id = f.id AND v.voter_token = ?
  `;
  const params = [voterToken || ''];

  if (status && status !== 'all') {
    query += ' WHERE f.status = ?';
    params.push(status);
  }

  if (sort === 'top') {
    query += ' ORDER BY f.upvotes DESC, f.created_at DESC';
  } else {
    query += ' ORDER BY f.created_at DESC';
  }

  return db.prepare(query).all(...params);
}

export function findById(id, voterToken) {
  const db = getDb();
  return db
    .prepare(
      `SELECT f.*,
        CASE WHEN v.voter_token IS NOT NULL THEN 1 ELSE 0 END AS has_voted
       FROM feedback f
       LEFT JOIN votes v ON v.feedback_id = f.id AND v.voter_token = ?
       WHERE f.id = ?`
    )
    .get(voterToken || '', id);
}

export function insert(feedback) {
  const db = getDb();
  db.prepare(
    `INSERT INTO feedback (id, title, description, status, upvotes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    feedback.id,
    feedback.title,
    feedback.description,
    feedback.status,
    feedback.upvotes,
    feedback.created_at,
    feedback.updated_at
  );
}

export function hasVoted(feedbackId, voterToken) {
  const db = getDb();
  return !!db
    .prepare('SELECT 1 FROM votes WHERE feedback_id = ? AND voter_token = ?')
    .get(feedbackId, voterToken);
}

export function addVote(feedbackId, voterToken) {
  const db = getDb();
  db.prepare('INSERT INTO votes (feedback_id, voter_token) VALUES (?, ?)').run(
    feedbackId,
    voterToken
  );
  db.prepare('UPDATE feedback SET upvotes = upvotes + 1, updated_at = ? WHERE id = ?').run(
    new Date().toISOString(),
    feedbackId
  );
}

export function removeVote(feedbackId, voterToken) {
  const db = getDb();
  db.prepare('DELETE FROM votes WHERE feedback_id = ? AND voter_token = ?').run(
    feedbackId,
    voterToken
  );
  db.prepare('UPDATE feedback SET upvotes = upvotes - 1, updated_at = ? WHERE id = ?').run(
    new Date().toISOString(),
    feedbackId
  );
}

export function updateStatus(id, status) {
  const db = getDb();
  db.prepare('UPDATE feedback SET status = ?, updated_at = ? WHERE id = ?').run(
    status,
    new Date().toISOString(),
    id
  );
}

export function remove(id) {
  const db = getDb();
  db.prepare('DELETE FROM feedback WHERE id = ?').run(id);
}
