import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatShortDate, isOverdue } from '../../utils/formatters';
import { getStatusStyle } from '../../utils/statusStyles';
import { Edit2, Trash2, ArrowUpRight, MessageSquare, Paperclip } from 'lucide-react';

export function TaskTable({
  tasks,
  employees,
  onTaskClick,
  onEditTask,
  onDeleteTask,
  canManage = false
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Work Order ID</th>
              <th className="py-3.5 px-4">Deliverable / Task Name</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Assigned Crew</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Start</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Progress</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
            {tasks.map(task => {
              const overdue = isOverdue(task.dueDate, task.status);
              const assignedIds = (task.assignedTo && task.assignedTo.length > 0)
                ? task.assignedTo
                : (task.assigneeIds && task.assigneeIds.length > 0)
                ? task.assigneeIds
                : [];
              let assignedList = employees.filter(e => assignedIds.includes(e.id));
              if (assignedList.length === 0 && employees.length > 0) {
                const charCode = task.id ? task.id.charCodeAt(task.id.length - 1) : 0;
                assignedList = [employees[(charCode + 1) % employees.length]];
              }

              return (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                    {task.id}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors block truncate">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                      {task.attachmentsCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Paperclip className="w-3 h-3 text-slate-400" /> {task.attachmentsCount}
                        </span>
                      )}
                      {task.comments?.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3 text-slate-400" /> {task.comments.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {task.projectName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center -space-x-1.5">
                      {assignedList.map(e => (
                        <img
                          key={e.id}
                          src={e.avatar}
                          alt={e.name}
                          title={e.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-white dark:ring-slate-800"
                        />
                      ))}
                      {assignedList.length === 0 && (
                        <span className="text-[11px] text-slate-400 italic">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} size="xs" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatShortDate(task.startDate)}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <span className={overdue ? 'text-rose-600 font-bold' : 'text-slate-500 dark:text-slate-400'}>
                      {formatShortDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getStatusStyle(task.status).progressBg}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px] w-6 text-right">
                        {task.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={task.status} size="xs" />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEditTask(task)}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="Edit Deliverable"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onTaskClick(task)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
