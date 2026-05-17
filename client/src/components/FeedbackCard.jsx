import { Link } from 'react-router-dom';
import { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';
import VoteButton from './VoteButton.jsx';
import { useAdmin } from '../context/AdminContext.jsx';
import { updateStatus, deleteFeedback } from '../api/feedback.js';

const STATUSES = ['open', 'in_progress', 'done'];

export default function FeedbackCard({ item, onDelete, onStatusChange }) {
  const { isAdmin } = useAdmin();
  const [status, setStatus] = useState(item.status);
  const [closing, setClosing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isClosed = status === 'closed';

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateStatus(item.id, newStatus);
      onStatusChange?.(item.id, newStatus);
    } catch (err) {
      setStatus(item.status);
      alert(err.message);
    }
  }

  async function handleToggleClose(e) {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = isClosed ? 'open' : 'closed';
    setClosing(true);
    try {
      await updateStatus(item.id, newStatus);
      setStatus(newStatus);
      onStatusChange?.(item.id, newStatus);
    } catch (err) {
      alert(err.message);
    } finally {
      setClosing(false);
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this feedback?')) return;
    setDeleting(true);
    try {
      await deleteFeedback(item.id);
      onDelete?.(item.id);
    } catch (err) {
      setDeleting(false);
      alert(err.message);
    }
  }

  return (
    <div className={`flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border transition-all group ${
      isClosed
        ? 'border-slate-200 dark:border-slate-700 opacity-70'
        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:shadow-md'
    }`}>
      <VoteButton
        feedbackId={item.id}
        initialUpvotes={item.upvotes}
        initialHasVoted={item.has_voted}
      />

      <Link to={`/feedback/${item.id}`} className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-semibold leading-snug transition-colors ${
            isClosed
              ? 'text-slate-400 dark:text-slate-500 line-through'
              : 'text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400'
          }`}>{item.title}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
        <p className="mt-2 text-xs text-slate-300 dark:text-slate-600">{new Date(item.created_at).toLocaleDateString()}</p>
      </Link>

      {isAdmin && (
        <div className="flex flex-col gap-1.5 shrink-0 justify-start pt-0.5">
          {!isClosed && (
            <select
              value={status}
              onChange={handleStatusChange}
              onClick={(e) => e.stopPropagation()}
              className="text-xs border border-slate-200 dark:border-slate-600 rounded-md px-2 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-colors"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          <button
            onClick={handleToggleClose}
            disabled={closing}
            title={isClosed ? 'Reopen this feedback' : 'Close this feedback'}
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md border transition-all ${
              isClosed
                ? 'border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                : 'border-rose-200 dark:border-rose-800 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40'
            }`}
          >
            {closing ? '…' : isClosed ? '↩ Reopen' : '✕ Close'}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors text-left"
          >
            {deleting ? '…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
