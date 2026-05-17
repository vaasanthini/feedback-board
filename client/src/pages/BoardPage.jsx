import { useEffect, useState } from 'react';
import { getFeedbackList } from '../api/feedback.js';
import { useFilter } from '../context/FilterContext.jsx';
import { useAdmin } from '../context/AdminContext.jsx';
import FilterBar from '../components/FilterBar.jsx';
import FeedbackCard from '../components/FeedbackCard.jsx';
import FeedbackForm from '../components/FeedbackForm.jsx';
import AdminLogin from '../components/AdminLogin.jsx';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

export default function BoardPage() {
  const { status, sort } = useFilter();
  const { isAdmin, logout } = useAdmin();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  useEffect(() => {
    setLoading(true);
    getFeedbackList({ status, sort })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, sort]);

  function handleCreated(item) {
    setItems((prev) => [item, ...prev]);
  }

  function handleDelete(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleStatusChange(id, newStatus) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-sm transition-colors">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow">F</div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">Feedback Board</h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Share ideas · vote · shape the roadmap</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <DarkModeToggle />
            {isAdmin ? (
              <span className="flex items-center gap-2">
                <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold px-2 py-1 rounded-full">Admin</span>
                <button
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 font-medium transition-colors"
                >
                  Exit
                </button>
              </span>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="text-sm text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                Admin
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 active:bg-indigo-800 shadow-sm transition-colors"
            >
              + Submit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 flex gap-8 items-start">
        <aside className="w-52 shrink-0 sticky top-16">
          <FilterBar vertical />
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {loading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse">
                  <div className="w-12 h-14 bg-slate-100 dark:bg-slate-700 rounded-lg shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 py-1">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-red-500 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-3xl">💡</div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No feedback yet</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">Be the first to share an idea or report an issue.</p>
              <button
                onClick={() => setShowForm(true)}
                className="mt-2 px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <FeedbackCard
                  key={item.id}
                  item={item}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showForm && (
        <FeedbackForm onCreated={handleCreated} onClose={() => setShowForm(false)} />
      )}
      {showAdminLogin && (
        <AdminLogin onClose={() => setShowAdminLogin(false)} />
      )}
    </div>
  );
}
