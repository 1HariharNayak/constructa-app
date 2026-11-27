import React from 'react';
import { Calendar, Paperclip, MessageSquare, AlertTriangle } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { isOverdue, formatShortDate } from '../../utils/formatters';
import { getStatusStyle } from '../../utils/statusStyles';

export function TaskCard({
  task,
  employees = [],
  onClick,
  onDragStart
}) {
  const overdue = isOverdue(task.dueDate, task.status);
  const statusStyle = getStatusStyle(task.status);

  // Find assigned employees (resolves assignedTo, assigneeIds, or deterministic engineer assignment)
  const assignedIds = (task.assignedTo && task.assignedTo.length > 0)
    ? task.assignedTo
    : (task.assigneeIds && task.assigneeIds.length > 0)
    ? task.assigneeIds
    : [];

  let assignedList = employees.filter(e => assignedIds.includes(e.id));
  if (assignedList.length === 0 && employees.length > 0) {
    const charCode = task.id ? task.id.charCodeAt(task.id.length - 1) : 0;
    const emp1 = employees[(charCode + 1) % employees.length];
    const emp2 = employees[(charCode + 3) % employees.length];
    assignedList = [emp1, emp2].filter(Boolean);
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className={`p-3.5 rounded-xl border bg-white dark:bg-slate-800 shadow-xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing select-none group border-l-4 ${statusStyle.cardBorder} ${
        task.status === 'Blocked'
          ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-400/20'
          : overdue
          ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-400/20'
          : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      {/* Header: Project name & Priority */}
      <div className="flex items-center justify-between gap-1 text-[11px] mb-2">
        <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate max-w-[140px]">
          {task.projectName}
        </span>
        <PriorityBadge priority={task.priority} size="xs" />
      </div>

      {/* Task ID & Title */}
      <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2 mb-2">
        <span className="font-mono text-slate-400 mr-1.5">{task.id}:</span>
        {task.title}
      </h4>

      {/* Blocker alert tag if blocked */}
      {task.status === 'Blocked' && task.blockerReason && (
        <div className="p-1.5 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-[10px] flex items-start gap-1 font-medium mb-2.5">
          <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-rose-600" />
          <span className="line-clamp-1">{task.blockerReason}</span>
        </div>
      )}

      {/* Progress track with distinctive status color */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{task.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${statusStyle.progressBg}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer: Due date, Attachments, Comments, Avatars */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          {/* Due date */}
          <span className={`flex items-center gap-1 font-mono ${overdue ? 'text-rose-600 font-bold' : ''}`}>
            <Calendar className="w-3 h-3 text-slate-400" />
            {formatShortDate(task.dueDate)}
          </span>

          {/* Attachments */}
          {task.attachmentsCount > 0 && (
            <span className="flex items-center gap-0.5 text-slate-400" title={`${task.attachmentsCount} attachments`}>
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span>{task.attachmentsCount}</span>
            </span>
          )}

          {/* Comments */}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-0.5 text-slate-400" title={`${task.comments.length} comments`}>
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Assigned Crew Avatars & Label */}
        <div className="flex items-center gap-1.5" title={assignedList.map(e => e.name).join(', ')}>
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {assignedList.slice(0, 3).map(emp => (
              <img
                key={emp.id}
                src={emp.avatar}
                alt={emp.name}
                title={`${emp.name} (${emp.designation || emp.roleLabel || 'Specialist'})`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=2A352F&color=fff&size=64`;
                }}
                className="w-5.5 h-5.5 rounded-full object-cover ring-1.5 ring-white dark:ring-[#1C221F] shadow-2xs"
              />
            ))}
          </div>
          {assignedList.length > 0 && (
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[75px]">
              {assignedList[0].name.split(' ')[0]}
              {assignedList.length > 1 ? ` +${assignedList.length - 1}` : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
