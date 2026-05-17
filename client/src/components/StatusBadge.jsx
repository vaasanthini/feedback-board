const config = {
  open:        { colour: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800',    dot: 'bg-blue-500',   label: 'Open' },
  in_progress: { colour: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800', dot: 'bg-amber-500',  label: 'In Progress' },
  done:        { colour: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 ring-1 ring-green-200 dark:ring-green-800', dot: 'bg-green-500',  label: 'Done' },
  closed:      { colour: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 ring-1 ring-slate-200 dark:ring-slate-600', dot: 'bg-slate-400',  label: 'Closed' },
};

export default function StatusBadge({ status }) {
  const { colour, dot, label } = config[status] || config.open;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${colour}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
