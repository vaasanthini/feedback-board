import { nanoid } from 'nanoid';
import * as repo from './repository.js';

const VALID_STATUSES = ['open', 'in_progress', 'done', 'closed'];

function notFound() {
  const err = new Error('Feedback not found');
  err.status = 404;
  return err;
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export function listFeedback({ status, sort, voterToken }) {
  return repo.findAll({ status, sort, voterToken });
}

export function getFeedback(id, voterToken) {
  const item = repo.findById(id, voterToken);
  if (!item) throw notFound();
  return item;
}

export function createFeedback({ title, description }) {
  if (!title || !title.trim()) throw badRequest('Title is required');
  if (title.length > 100) throw badRequest('Title must be 100 characters or less');
  if (!description || !description.trim()) throw badRequest('Description is required');
  if (description.length > 500) throw badRequest('Description must be 500 characters or less');

  const now = new Date().toISOString();
  const feedback = {
    id: nanoid(),
    title: title.trim(),
    description: description.trim(),
    status: 'open',
    upvotes: 0,
    created_at: now,
    updated_at: now,
  };
  repo.insert(feedback);
  return { ...feedback, has_voted: 0 };
}

export function toggleVote(id, voterToken) {
  const item = repo.findById(id, voterToken);
  if (!item) throw notFound();

  if (repo.hasVoted(id, voterToken)) {
    repo.removeVote(id, voterToken);
    return { upvotes: item.upvotes - 1, has_voted: false };
  } else {
    repo.addVote(id, voterToken);
    return { upvotes: item.upvotes + 1, has_voted: true };
  }
}

export function changeStatus(id, status) {
  if (!VALID_STATUSES.includes(status)) {
    throw badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  const item = repo.findById(id, '');
  if (!item) throw notFound();
  repo.updateStatus(id, status);
}

export function deleteFeedback(id) {
  const item = repo.findById(id, '');
  if (!item) throw notFound();
  repo.remove(id);
}
