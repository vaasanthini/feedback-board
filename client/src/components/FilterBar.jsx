import { useFilter } from '../context/FilterContext.jsx';

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'closed', label: 'Closed' },
];

export default function FilterBar({ vertical = false }) {
  const { status, setStatus, sort, setSort } = useFilter();

  if (vertical) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Status</p>
          <div className="flex flex-col gap-1">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setStatus(s.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all
                  ${status === s.value
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Sort by</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition-colors"
          >
            <option value="newest">Newest first</option>
            <option value="top">Top voted</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 justify-between">
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setStatus(s.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
              ${status === s.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer transition-colors"
      >
        <option value="newest">Newest first</option>
        <option value="top">Top voted</option>
      </select>
    </div>
  );
}
