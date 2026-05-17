import { useState } from 'react';
import { toggleVote } from '../api/feedback.js';

export default function VoteButton({ feedbackId, initialUpvotes, initialHasVoted, onVote }) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(!!initialHasVoted);
  const [loading, setLoading] = useState(false);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const result = await toggleVote(feedbackId);
      setUpvotes(result.upvotes);
      setHasVoted(result.has_voted);
      onVote?.(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex flex-col items-center justify-center w-12 h-14 rounded-xl border-2 transition-all font-bold text-sm shrink-0 select-none
        ${hasVoted
          ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm shadow-indigo-200'
          : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
        } ${loading ? 'opacity-60' : ''}`}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 1L11 7H1L6 1Z" />
      </svg>
      <span className="mt-0.5 text-xs font-semibold">{upvotes}</span>
    </button>
  );
}
