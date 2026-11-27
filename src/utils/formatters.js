// Formatting utilities for dates, statuses, and badges

export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
}

export function isOverdue(dueDate, status) {
  if (!dueDate || status === 'Completed') return false;
  const today = new Date('2026-11-26');
  const due = new Date(dueDate);
  return due < today;
}

export function getDaysRemaining(dueDate) {
  if (!dueDate) return null;
  const today = new Date('2026-11-26');
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getStatusStyle(status) {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-[#EEF1E9]',
        text: 'text-[#465036]',
        border: 'border-[#687653]/30',
        dot: 'bg-[#687653]'
      };
    case 'In Progress':
      return {
        bg: 'bg-[#F8EFE7]',
        text: 'text-[#9F6534]',
        border: 'border-[#B77945]/30',
        dot: 'bg-[#B77945]'
      };
    case 'Under Review':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        dot: 'bg-[#D49A48]'
      };
    case 'Delayed':
    case 'Blocked':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-800',
        border: 'border-rose-200',
        dot: 'bg-[#C96B5D]'
      };
    case 'Pending':
    case 'Planning':
    default:
      return {
        bg: 'bg-[#F0EFE9]',
        text: 'text-[#4B4F45]',
        border: 'border-[#DDD9CF]',
        dot: 'bg-[#77786F]'
      };
  }
}

export function getPriorityStyle(priority) {
  switch (priority) {
    case 'Urgent':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200'
      };
    case 'High':
      return {
        bg: 'bg-[#F8EFE7]',
        text: 'text-[#9F6534]',
        border: 'border-[#B77945]/30'
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200'
      };
    case 'Low':
    default:
      return {
        bg: 'bg-[#F0EFE9]',
        text: 'text-[#77786F]',
        border: 'border-[#E9E7DF]'
      };
  }
}
