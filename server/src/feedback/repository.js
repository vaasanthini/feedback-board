import { sql } from '../db/index.js';

export async function findAll({ status, sort, voterToken }) {
  const token = voterToken || '';
  const orderBy = sort === 'top'
    ? 'ORDER BY f.upvotes DESC, f.created_at DESC'
    : 'ORDER BY f.created_at DESC';

  if (status && status !== 'all') {
    return sql.unsafe(
      `SELECT f.*,
         CASE WHEN v.voter_token IS NOT NULL THEN 1 ELSE 0 END AS has_voted
       FROM feedback f
       LEFT JOIN votes v ON v.feedback_id = f.id AND v.voter_token = $1
       WHERE f.status = $2
       ${orderBy}`,
      [token, status]
    );
  }

  return sql.unsafe(
    `SELECT f.*,
       CASE WHEN v.voter_token IS NOT NULL THEN 1 ELSE 0 END AS has_voted
     FROM feedback f
     LEFT JOIN votes v ON v.feedback_id = f.id AND v.voter_token = $1
     ${orderBy}`,
    [token]
  );
}

export async function findById(id, voterToken) {
  const rows = await sql`
    SELECT f.*,
      CASE WHEN v.voter_token IS NOT NULL THEN 1 ELSE 0 END AS has_voted
    FROM feedback f
    LEFT JOIN votes v ON v.feedback_id = f.id AND v.voter_token = ${voterToken || ''}
    WHERE f.id = ${id}
  `;
  return rows[0] ?? null;
}

export async function insert(feedback) {
  await sql`
    INSERT INTO feedback (id, title, description, status, upvotes, created_at, updated_at)
    VALUES (
      ${feedback.id}, ${feedback.title}, ${feedback.description},
      ${feedback.status}, ${feedback.upvotes}, ${feedback.created_at}, ${feedback.updated_at}
    )
  `;
}

export async function hasVoted(feedbackId, voterToken) {
  const rows = await sql`
    SELECT 1 FROM votes WHERE feedback_id = ${feedbackId} AND voter_token = ${voterToken}
  `;
  return rows.length > 0;
}

export async function addVote(feedbackId, voterToken) {
  await sql`INSERT INTO votes (feedback_id, voter_token) VALUES (${feedbackId}, ${voterToken})`;
  await sql`
    UPDATE feedback SET upvotes = upvotes + 1, updated_at = ${new Date().toISOString()}
    WHERE id = ${feedbackId}
  `;
}

export async function removeVote(feedbackId, voterToken) {
  await sql`DELETE FROM votes WHERE feedback_id = ${feedbackId} AND voter_token = ${voterToken}`;
  await sql`
    UPDATE feedback SET upvotes = upvotes - 1, updated_at = ${new Date().toISOString()}
    WHERE id = ${feedbackId}
  `;
}

export async function updateStatus(id, status) {
  await sql`
    UPDATE feedback SET status = ${status}, updated_at = ${new Date().toISOString()}
    WHERE id = ${id}
  `;
}

export async function remove(id) {
  await sql`DELETE FROM feedback WHERE id = ${id}`;
}
