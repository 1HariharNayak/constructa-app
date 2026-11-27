import React from 'react';

export function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  
  const map = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    'Pending': 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    'Under Review': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    'Blocked': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    'Active': 'bg-[#EBF0EC] text-[#5D8068] border-[#5D8068]/20 dark:bg-[#1E2B22] dark:text-[#7EB88F] dark:border-[#2D3E32]',
    'On Hold': 'bg-[#FBF4EC] text-[#C28D4E] border-[#C28D4E]/25 dark:bg-[#2B231A] dark:text-[#DFAB62] dark:border-[#3D3125]',
    'Overdue': 'bg-[#F9ECEB] text-[#C66C62] border-[#C66C62]/25 dark:bg-[#2E1A1A] dark:text-[#E48479] dark:border-[#422525]',
    'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300',
    'On Site': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300',
    'In Meeting': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300',
  };

  const style = map[status] || 'bg-[#F0F2EC] text-[#777F79] border-[#E7E9E3]';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style} ${sizeClasses} select-none`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 shrink-0" />
      <span>{status}</span>
    </span>
  );
}

export function PriorityBadge({ priority, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.2 text-[10px]' : size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  const map = {
    'Urgent': 'bg-[#F9ECEB] text-[#C66C62] border-[#C66C62]/25 font-semibold',
    'High': 'bg-[#FBF4EC] text-[#C28D4E] border-[#C28D4E]/25 font-medium',
    'Medium': 'bg-[#F3ECE5] text-[#A77B50] border-[#A77B50]/25 font-medium',
    'Low': 'bg-[#F0F2EC] text-[#777F79] border-[#E7E9E3] font-normal',
  };

  const style = map[priority] || 'bg-[#F0F2EC] text-[#777F79] border-[#E7E9E3]';

  return (
    <span className={`inline-flex items-center rounded-md border ${style} ${sizeClasses} select-none`}>
      {priority}
    </span>
  );
}

export function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#E7E9E3]/70 text-[#242B27] border border-[#E7E9E3] select-none">
      {type}
    </span>
  );
}

export function RoleBadge({ role }) {
  const map = {
    'super_admin': { label: 'Super Admin', style: 'bg-[#F3ECE5] text-[#A77B50] border-[#A77B50]/25' },
    'admin': { label: 'Admin', style: 'bg-[#EBF0EC] text-[#657A6A] border-[#657A6A]/25' },
    'employee': { label: 'Specialist', style: 'bg-[#EEF2F5] text-[#718B9A] border-[#718B9A]/25' },
  };

  const config = map[role] || { label: role || 'Member', style: 'bg-[#F0F2EC] text-[#777F79] border-[#E7E9E3]' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${config.style} select-none`}>
      {config.label}
    </span>
  );
}
