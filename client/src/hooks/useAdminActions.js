import { useState, useEffect } from 'react';
import { updateStatus, deleteFeedback } from '../api/feedback.js';

export function useAdminActions({ feedbackId, initialStatus, onStatusChange, onDeleted }) {
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isClosed = status === 'closed';

  async function handleStatusChange(newStatus) {
    const prev = status;
    setStatus(newStatus);
    try {
      await updateStatus(feedbackId, newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      setStatus(prev);
      alert(err.message);
    }
  }

  async function handleToggleClose() {
    const newStatus = isClosed ? 'open' : 'closed';
    setClosing(true);
    try {
      await updateStatus(feedbackId, newStatus);
      setStatus(newStatus);
      onStatusChange?.(newStatus);
    } catch (err) {
      alert(err.message);
    } finally {
      setClosing(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this feedback?')) return;
    setDeleting(true);
    try {
      await deleteFeedback(feedbackId);
      onDeleted?.();
    } catch (err) {
      setDeleting(false);
      alert(err.message);
    }
  }

  return { status, isClosed, closing, deleting, handleStatusChange, handleToggleClose, handleDelete };
}
