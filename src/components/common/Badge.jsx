import React from 'react';

export function StatusBadge({ status, size = 'sm' }) {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  
  const map = {
    'Active': 'bg-[#EBF0EC] text-[#5D8068] border-[#5D8068]/20',
    'Completed': 'bg-[#EEF1E9] text-[#657A6A] border-[#657A6A]/20',
    'On Hold': 'bg-[#FBF4EC] text-[#C28D4E] border-[#C28D4E]/25',
    'In Progress': 'bg-[#F3ECE5] text-[#A77B50] border-[#A77B50]/25',
    'Pending': 'bg-[#F0F2EC] text-[#777F79] border-[#E7E9E3]',
    'Under Review': 'bg-[#F4EFF6] text-[#8A6792] border-[#8A6792]/25',
    'Overdue': 'bg-[#F9ECEB] text-[#C66C62] border-[#C66C62]/25',
    'Available': 'bg-[#EBF0EC] text-[#5D8068] border-[#5D8068]/20',
    'On Site': 'bg-[#FBF4EC] text-[#C28D4E] border-[#C28D4E]/25',
    'In Meeting': 'bg-[#EEF2F5] text-[#718B9A] border-[#718B9A]/20',
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
