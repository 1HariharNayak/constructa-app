import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

export function TeamWorkloadSection({ employees, tasks }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Engineering Workload
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active task allocations and engineering team bandwidth
            </p>
          </div>
          <button
            onClick={() => navigate('/team')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <span>Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {employees.slice(0, 5).map((emp) => {
            const empTasks = tasks.filter(t => t.assignedTo?.includes(emp.id));
            const inProgress = empTasks.filter(t => t.status === 'In Progress').length;

            let capColor = 'bg-emerald-500';
            if (emp.capacity >= 85) capColor = 'bg-rose-500';
            else if (emp.capacity >= 70) capColor = 'bg-amber-500';

            return (
              <div
                key={emp.id}
                onClick={() => navigate(`/team?employeeId=${emp.id}`)}
                className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors cursor-pointer group text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 block truncate">
                        {emp.name}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                        {emp.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{emp.capacity}%</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {inProgress} active
                    </span>
                  </div>
                </div>

                {/* Capacity meter */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${capColor}`}
                    style={{ width: `${emp.capacity}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
