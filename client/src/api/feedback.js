import { apiFetch } from './client.js';

export const getFeedbackList = ({ status, sort } = {}) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (sort) params.set('sort', sort);
  const qs = params.toString();
  return apiFetch(`/api/feedback${qs ? `?${qs}` : ''}`);
};

export const getFeedbackById = (id) => apiFetch(`/api/feedback/${id}`);

export const createFeedback = (data) =>
  apiFetch('/api/feedback', { method: 'POST', body: JSON.stringify(data) });

export const toggleVote = (id) =>
  apiFetch(`/api/feedback/${id}/vote`, { method: 'POST', body: JSON.stringify({}) });

export const updateStatus = (id, status) =>
  apiFetch(`/api/feedback/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const deleteFeedback = (id) =>
  apiFetch(`/api/feedback/${id}`, { method: 'DELETE' });

export const verifyAdminKey = (key) =>
  apiFetch('/api/feedback/admin/verify', {
    headers: { 'x-admin-key': key },
  });
