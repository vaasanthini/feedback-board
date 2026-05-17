import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getFeedbackById } from '../api/feedback.js';
import { useAdmin } from '../context/AdminContext.jsx';
import { useAdminActions } from '../hooks/useAdminActions.js';
import { STATUSES } from '../constants/feedback.js';
import StatusBadge from '../components/StatusBadge.jsx';
import VoteButton from '../components/VoteButton.jsx';

export default function FeedbackDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getFeedbackById(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const { status, isClosed, closing, deleting, handleStatusChange, handleToggleClose, handleDelete } =
    useAdminActions({
      feedbackId: id,
      initialStatus: item?.status ?? 'open',
      onDeleted: () => navigate('/'),
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
          <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center gap-4 transition-colors">
        <p className="text-2xl">⚠️</p>
        <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
        <Link to="/" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">← Back to board</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors">
            <span>←</span> Back to board
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm transition-colors">
          <div className="flex gap-5">
            <VoteButton
              feedbackId={item.id}
              initialUpvotes={item.upvotes}
              initialHasVoted={item.has_voted}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h1 className={`text-xl font-bold leading-snug ${isClosed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{item.title}</h1>
                <StatusBadge status={status} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
              <p className="mt-4 text-xs text-slate-300 dark:text-slate-600">
                Submitted {new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {isAdmin && (
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {!isClosed && (
                      <>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Change status:</label>
                        <select
                          value={status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </>
                    )}

                    <button
                      onClick={handleToggleClose}
                      disabled={closing}
                      className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full border-2 transition-all shadow-sm ${
                        isClosed
                          ? 'border-emerald-400 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                          : 'border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40'
                      }`}
                    >
                      {closing ? (
                        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : isClosed ? (
                        <span>↩</span>
                      ) : (
                        <span>🔒</span>
                      )}
                      {closing ? 'Updating…' : isClosed ? 'Reopen feedback' : 'Close feedback'}
                    </button>

                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="ml-auto text-sm text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
                    >
                      {deleting ? 'Deleting…' : 'Delete feedback'}
                    </button>
                  </div>

                  {isClosed && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                      This feedback is closed. Reopen it to change its status.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
