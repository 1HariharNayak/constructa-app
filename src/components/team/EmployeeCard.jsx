import React from 'react';
import { Mail, Phone, FolderKanban, CheckSquare, Edit2, Trash2, ArrowUpRight } from 'lucide-react';

export function EmployeeCard({
  employee,
  tasks = [],
  projects = [],
  onSelect,
  onEdit,
  onDelete,
  canManage = false
}) {
  const empTasks = tasks.filter(t => t.assignedTo?.includes(employee.id));
  const completedTasks = empTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = empTasks.filter(t => t.status === 'In Progress').length;

  const assignedProjectsList = projects.filter(p =>
    employee.assignedProjects?.includes(p.id) || p.assignedEmployees?.includes(employee.id)
  );

  let capColor = 'bg-emerald-600';
  if (employee.capacity >= 85) capColor = 'bg-rose-600';
  else if (employee.capacity >= 70) capColor = 'bg-amber-500';

  return (
    <div
      onClick={() => onSelect(employee)}
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header with avatar, status, actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500/50 transition-all"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                  employee.status === 'Active'
                    ? 'bg-emerald-500'
                    : employee.status === 'On Site'
                    ? 'bg-blue-600'
                    : 'bg-slate-400'
                }`}
                title={employee.status}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{employee.role}</p>
              <span className="text-[10px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                {employee.department}
              </span>
            </div>
          </div>

          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {canManage && (
              <>
                <button
                  onClick={() => onEdit(employee)}
                  className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                  title="Edit Specialist"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded"
                  title="Remove Specialist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-3.5 space-y-1 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/80 pt-3">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2 truncate font-mono">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>

        {/* Assigned Projects list */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1.5">
            Active Projects ({assignedProjectsList.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {assignedProjectsList.map(p => (
              <span
                key={p.id}
                className="text-[10px] bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono truncate max-w-[150px]"
                title={p.name}
              >
                {p.code}
              </span>
            ))}
            {assignedProjectsList.length === 0 && (
              <span className="text-[11px] text-slate-400 italic">No active projects</span>
            )}
          </div>
        </div>
      </div>

      {/* Task & Workload meter */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <CheckSquare className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Tasks: <strong className="text-slate-900 dark:text-white">{completedTasks}/{empTasks.length}</strong> ({inProgressTasks} active)
          </span>
          <span className="font-mono font-bold text-slate-900 dark:text-white">{employee.capacity}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${capColor}`}
            style={{ width: `${employee.capacity}%` }}
          />
        </div>
      </div>
    </div>
  );
}
