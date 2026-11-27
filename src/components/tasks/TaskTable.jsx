import React from 'react';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { formatShortDate, isOverdue } from '../../utils/formatters';
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
    <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F6F2] border-b border-[#E7E9E3] text-[#777F79] uppercase tracking-wider font-semibold">
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
          <tbody className="divide-y divide-[#E7E9E3]">
            {tasks.map(task => {
              const overdue = isOverdue(task.dueDate, task.status);
              const assignedList = employees.filter(e => task.assignedTo?.includes(e.id));

              return (
                <tr
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="hover:bg-[#F6F6F2] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-[#242B27]">
                    {task.id}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-bold text-sm text-[#242B27] group-hover:text-[#A77B50] transition-colors block truncate">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-[#777F79] mt-0.5">
                      {task.attachmentsCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Paperclip className="w-3 h-3 text-[#A77B50]" /> {task.attachmentsCount}
                        </span>
                      )}
                      {task.comments?.length > 0 && (
                        <span className="flex items-center gap-0.5">
                          <MessageSquare className="w-3 h-3 text-[#657A6A]" /> {task.comments.length}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#777F79] whitespace-nowrap">
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
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
                        />
                      ))}
                      {assignedList.length === 0 && (
                        <span className="text-[11px] text-[#777F79] italic">—</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} size="xs" />
                  </td>
                  <td className="py-3 px-4 font-mono text-[#777F79] whitespace-nowrap">
                    {formatShortDate(task.startDate)}
                  </td>
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <span className={overdue ? 'text-[#C66C62] font-bold' : 'text-[#777F79]'}>
                      {formatShortDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="py-3 px-4 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E7E9E3] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#A77B50] h-full rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#242B27] text-[11px] w-6 text-right">
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
                            className="p-1 text-[#777F79] hover:text-[#A77B50] rounded"
                            title="Edit Deliverable"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTask(task.id)}
                            className="p-1 text-[#777F79] hover:text-[#C66C62] rounded"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => onTaskClick(task)}
                        className="p-1 text-[#777F79] hover:text-[#242B27] rounded"
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
