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

  // Find assigned employees
  const assignedList = employees.filter(e => task.assignedTo?.includes(e.id));

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onClick={() => onClick(task)}
      className={`p-3.5 rounded-xl border bg-white dark:bg-[#1C221F] shadow-xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing select-none group border-l-4 ${statusStyle.cardBorder} ${
        task.status === 'Blocked'
          ? 'border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-400/20'
          : overdue
          ? 'border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-400/20'
          : 'border-[#E7E9E3] dark:border-[#2A332E] hover:border-[#D5D8CF] dark:hover:border-[#38453E]'
      }`}
    >
      {/* Header: Project name & Priority */}
      <div className="flex items-center justify-between gap-1 text-[11px] mb-2">
        <span className="font-semibold text-[#777F79] dark:text-[#9BA29C] uppercase tracking-wider truncate max-w-[140px]">
          {task.projectName}
        </span>
        <PriorityBadge priority={task.priority} size="xs" />
      </div>

      {/* Task ID & Title */}
      <h4 className="text-xs font-bold text-[#242B27] dark:text-[#EDEDEA] group-hover:text-[#A77B50] dark:group-hover:text-[#C29567] transition-colors leading-snug line-clamp-2 mb-2">
        <span className="font-mono text-[#777F79] dark:text-[#9BA29C] mr-1.5">{task.id}:</span>
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
        <div className="flex items-center justify-between text-[10px] text-[#777F79] dark:text-[#9BA29C] mb-1">
          <span>Progress</span>
          <span className="font-mono font-bold text-[#242B27] dark:text-[#EDEDEA]">{task.progress}%</span>
        </div>
        <div className="w-full bg-[#E7E9E3] dark:bg-[#2A332E] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${statusStyle.progressBg}`}
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer: Due date, Attachments, Comments, Avatars */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E7E9E3] dark:border-[#2A332E] text-[11px] text-[#777F79] dark:text-[#9BA29C]">
        <div className="flex items-center gap-2">
          {/* Due date */}
          <span className={`flex items-center gap-1 font-mono ${overdue ? 'text-[#C66C62] font-bold' : ''}`}>
            <Calendar className="w-3 h-3" />
            {formatShortDate(task.dueDate)}
          </span>

          {/* Attachments */}
          {task.attachmentsCount > 0 && (
            <span className="flex items-center gap-0.5 text-[#777F79]" title={`${task.attachmentsCount} attachments`}>
              <Paperclip className="w-3 h-3 text-[#A77B50]" />
              <span>{task.attachmentsCount}</span>
            </span>
          )}

          {/* Comments */}
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-0.5 text-[#777F79]" title={`${task.comments.length} comments`}>
              <MessageSquare className="w-3 h-3 text-[#657A6A]" />
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>

        {/* Assigned Avatars */}
        <div className="flex items-center -space-x-1.5">
          {assignedList.map(emp => (
            <img
              key={emp.id}
              src={emp.avatar}
              alt={emp.name}
              title={emp.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-white"
            />
          ))}
          {assignedList.length === 0 && (
            <span className="text-[10px] text-[#777F79] italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
