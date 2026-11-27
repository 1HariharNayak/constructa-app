import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function ProjectProgressChart({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Building2 className="w-4 h-4 text-[#A77B50]" />
            <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
              Project Progress Overview
            </h3>
          </div>
          <p className="text-xs text-[#777F79]">
            Active construction phases and structural milestone completion rates
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-[#A77B50] hover:text-[#8E653E] flex items-center gap-1 cursor-pointer"
        >
          <span>All Projects</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 5).map(proj => {
          let barColor = 'bg-[#657A6A]';
          if (proj.status === 'Delayed') barColor = 'bg-[#C66C62]';
          else if (proj.status === 'Completed') barColor = 'bg-[#5D8068]';
          else if (proj.progress < 40) barColor = 'bg-[#A77B50]';

          return (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="p-3 rounded-lg hover:bg-[#F6F6F2] border border-[#E7E9E3]/70 hover:border-[#D5D8CF] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-[#242B27] group-hover:text-[#A77B50] truncate">
                    {proj.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#777F79] hidden sm:inline">
                    ({proj.code})
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={proj.status} size="xs" />
                  <span className="font-mono font-bold text-[#242B27] w-10 text-right">
                    {proj.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-[#E7E9E3] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#777F79] mt-1.5">
                <span className="truncate">Site: {proj.location.split(',')[0]}</span>
                <span className="font-mono text-[10px]">Target: {proj.endDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
