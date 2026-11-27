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

  let capColor = 'bg-[#5D8068]';
  if (employee.capacity >= 85) capColor = 'bg-[#C66C62]';
  else if (employee.capacity >= 70) capColor = 'bg-[#C28D4E]';

  return (
    <div
      onClick={() => onSelect(employee)}
      className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs hover:border-[#D5D8CF] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
    >
      <div>
        {/* Header with avatar, status, actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E7E9E3] group-hover:ring-[#A77B50]/40 transition-all"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                  employee.status === 'Active'
                    ? 'bg-[#5D8068]'
                    : employee.status === 'On Site'
                    ? 'bg-[#A77B50]'
                    : 'bg-[#8E9690]'
                }`}
                title={employee.status}
              />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#242B27] group-hover:text-[#A77B50] transition-colors truncate">
                {employee.name}
              </h3>
              <p className="text-xs text-[#777F79] truncate">{employee.role}</p>
              <span className="text-[10px] font-semibold text-[#657A6A] bg-[#657A6A]/10 px-1.5 py-0.2 rounded mt-0.5 inline-block">
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
                  className="p-1 text-[#777F79] hover:text-[#A77B50] rounded"
                  title="Edit Specialist"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(employee.id)}
                  className="p-1 text-[#777F79] hover:text-[#C66C62] rounded"
                  title="Remove Specialist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Contact details */}
        <div className="mt-3.5 space-y-1 text-xs text-[#777F79] border-t border-[#E7E9E3] pt-3">
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-3.5 h-3.5 text-[#A77B50] shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2 truncate font-mono">
              <Phone className="w-3.5 h-3.5 text-[#657A6A] shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
        </div>

        {/* Assigned Projects list */}
        <div className="mt-3 pt-3 border-t border-[#E7E9E3]">
          <span className="text-[10px] uppercase font-bold text-[#777F79] block mb-1.5">
            Active Projects ({assignedProjectsList.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {assignedProjectsList.map(p => (
              <span
                key={p.id}
                className="text-[10px] bg-[#F6F6F2] border border-[#E7E9E3] text-[#242B27] px-1.5 py-0.5 rounded font-mono truncate max-w-[150px]"
                title={p.name}
              >
                {p.code}
              </span>
            ))}
            {assignedProjectsList.length === 0 && (
              <span className="text-[11px] text-[#777F79] italic">No active projects</span>
            )}
          </div>
        </div>
      </div>

      {/* Task & Workload meter */}
      <div className="mt-4 pt-3 border-t border-[#E7E9E3]">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#777F79] flex items-center gap-1 font-medium">
            <CheckSquare className="w-3 h-3 text-[#5D8068]" />
            Tasks: <strong className="text-[#242B27]">{completedTasks}/{empTasks.length}</strong> ({inProgressTasks} active)
          </span>
          <span className="font-mono font-bold text-[#242B27]">{employee.capacity}%</span>
        </div>
        <div className="w-full bg-[#E7E9E3] h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${capColor}`}
            style={{ width: `${employee.capacity}%` }}
          />
        </div>
      </div>
    </div>
  );
}
