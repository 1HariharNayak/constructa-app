import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight } from 'lucide-react';

export function TeamWorkloadSection({ employees, tasks }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Users className="w-4 h-4 text-[#A77B50]" />
              <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
                Engineering Workload
              </h3>
            </div>
            <p className="text-xs text-[#777F79]">
              Active task allocations and engineering team bandwidth
            </p>
          </div>
          <button
            onClick={() => navigate('/team')}
            className="text-xs font-semibold text-[#A77B50] hover:text-[#8E653E] flex items-center gap-1 cursor-pointer"
          >
            <span>Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {employees.slice(0, 5).map((emp) => {
            const empTasks = tasks.filter(t => t.assignedTo?.includes(emp.id));
            const inProgress = empTasks.filter(t => t.status === 'In Progress').length;

            let capColor = 'bg-[#5D8068]';
            if (emp.capacity >= 85) capColor = 'bg-[#C66C62]';
            else if (emp.capacity >= 70) capColor = 'bg-[#C28D4E]';

            return (
              <div
                key={emp.id}
                onClick={() => navigate(`/team?employeeId=${emp.id}`)}
                className="p-2.5 rounded-lg border border-[#E7E9E3] hover:bg-[#F6F6F2] transition-colors cursor-pointer group text-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#E7E9E3]"
                    />
                    <div className="truncate">
                      <span className="font-bold text-[#242B27] group-hover:text-[#A77B50] block truncate">
                        {emp.name}
                      </span>
                      <span className="text-[10px] text-[#777F79] block truncate">
                        {emp.role}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-[#242B27] text-xs">{emp.capacity}%</span>
                    <span className="text-[10px] text-[#777F79] block font-mono">
                      {inProgress} active
                    </span>
                  </div>
                </div>

                {/* Capacity meter */}
                <div className="w-full bg-[#E7E9E3] h-1.5 rounded-full overflow-hidden">
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
