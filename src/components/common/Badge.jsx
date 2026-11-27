import React from 'react';

export function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  
  const map = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    'Active': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'On Site': 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Pending': 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'Under Review': 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-600/10 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    'In Meeting': 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-600/10 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
    'On Hold': 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'Blocked': 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/10 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    'Overdue': 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/10 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  };

  const style = map[status] || 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${style} ${sizeClasses} select-none`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />
      <span>{status}</span>
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const map = {
    'Urgent': 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-600/10 font-semibold dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
    'High': 'bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-600/10 font-medium dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
    'Medium': 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10 font-medium dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
    'Low': 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-600/10 font-normal dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  };

  const style = map[priority] || 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-600/10';

  return (
    <span className={`inline-flex items-center rounded-md border ${style} ${sizeClasses} select-none font-medium`}>
      {priority}
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 select-none">
      {type}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    'super_admin': { label: 'Super Admin', style: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' },
    'admin': { label: 'Admin', style: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
    'employee': { label: 'Specialist', style: 'bg-slate-100 text-slate-700 border-slate-200 ring-1 ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
  };

  const config = map[role] || { label: role, style: 'bg-slate-100 text-slate-700 border-slate-200' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${config.style} select-none`}>
      {config.label}
    </span>
  );
}
