import { nanoid } from 'nanoid';
import * as repo from './repository.js';

export function listFeedback({ status, sort, voterToken }) {
  return repo.findAll({ status, sort, voterToken });
}

export function getFeedback(id, voterToken) {
  const item = repo.findById(id, voterToken);
  if (!item) {
    const err = new Error('Feedback not found');
    err.status = 404;
    throw err;
  }
  return item;
}

export function createFeedback({ title, description }) {
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
  if (!item) {
    const err = new Error('Feedback not found');
    err.status = 404;
    throw err;
  }

  if (repo.hasVoted(id, voterToken)) {
    repo.removeVote(id, voterToken);
    return { upvotes: item.upvotes - 1, has_voted: false };
  } else {
    repo.addVote(id, voterToken);
    return { upvotes: item.upvotes + 1, has_voted: true };
  }
}

export function changeStatus(id, status) {
  const item = repo.findById(id, '');
  if (!item) {
    const err = new Error('Feedback not found');
    err.status = 404;
    throw err;
  }
  repo.updateStatus(id, status);
}

export function deleteFeedback(id) {
  const item = repo.findById(id, '');
  if (!item) {
    const err = new Error('Feedback not found');
    err.status = 404;
    throw err;
  }
  repo.remove(id);
}
