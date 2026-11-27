// Unified, high-contrast work status color tokens for CONSTRUCTA
export const STATUS_COLORS = {
  Pending: {
    id: 'Pending',
    label: 'Pending',
    hex: '#64748B', // Slate
    dot: 'bg-slate-400',
    border: 'border-t-slate-400',
    columnBorder: 'border-slate-200 dark:border-slate-800',
    columnBg: 'bg-slate-50/80 dark:bg-slate-900/30',
    headerText: 'text-slate-700 dark:text-slate-300',
    countBadge: 'bg-slate-200/80 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    cardBorder: 'border-l-4 border-l-slate-400',
    progressBg: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  },
  'In Progress': {
    id: 'In Progress',
    label: 'In Progress',
    hex: '#2563EB', // Royal Blue
    dot: 'bg-blue-600',
    border: 'border-t-blue-600',
    columnBorder: 'border-blue-200/80 dark:border-blue-900/40',
    columnBg: 'bg-blue-50/50 dark:bg-blue-950/20',
    headerText: 'text-blue-800 dark:text-blue-300',
    countBadge: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/60 dark:text-blue-300 dark:border-blue-800',
    cardBorder: 'border-l-4 border-l-blue-600',
    progressBg: 'bg-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800'
  },
  'Under Review': {
    id: 'Under Review',
    label: 'Under Review',
    hex: '#8B5CF6', // Purple / Violet
    dot: 'bg-purple-600',
    border: 'border-t-purple-600',
    columnBorder: 'border-purple-200/80 dark:border-purple-900/40',
    columnBg: 'bg-purple-50/50 dark:bg-purple-950/20',
    headerText: 'text-purple-800 dark:text-purple-300',
    countBadge: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/60 dark:text-purple-300 dark:border-purple-800',
    cardBorder: 'border-l-4 border-l-purple-600',
    progressBg: 'bg-purple-600',
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800'
  },
  Completed: {
    id: 'Completed',
    label: 'Completed',
    hex: '#16A34A', // Emerald Green
    dot: 'bg-emerald-600',
    border: 'border-t-emerald-600',
    columnBorder: 'border-emerald-200/80 dark:border-emerald-900/40',
    columnBg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    headerText: 'text-emerald-800 dark:text-emerald-300',
    countBadge: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 dark:border-emerald-800',
    cardBorder: 'border-l-4 border-l-emerald-600',
    progressBg: 'bg-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
  },
  Blocked: {
    id: 'Blocked',
    label: 'Blocked',
    hex: '#DC2626', // Crimson Red
    dot: 'bg-rose-600',
    border: 'border-t-rose-600',
    columnBorder: 'border-rose-200/80 dark:border-rose-900/40',
    columnBg: 'bg-rose-50/50 dark:bg-rose-950/20',
    headerText: 'text-rose-800 dark:text-rose-300',
    countBadge: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/60 dark:text-rose-300 dark:border-rose-800',
    cardBorder: 'border-l-4 border-l-rose-600',
    progressBg: 'bg-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800'
  }
};

export function getStatusStyle(status) {
  return STATUS_COLORS[status] || STATUS_COLORS.Pending;
}
