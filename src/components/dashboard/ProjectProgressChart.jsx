import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function ProjectProgressChart({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Project Progress Overview
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Active construction phases and structural milestone completion rates
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
        >
          <span>All Projects</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {projects.slice(0, 5).map(proj => {
          let barColor = 'bg-blue-600';
          if (proj.status === 'Delayed') barColor = 'bg-rose-500';
          else if (proj.status === 'Completed') barColor = 'bg-emerald-500';
          else if (proj.progress < 40) barColor = 'bg-amber-500';

          return (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                    {proj.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                    ({proj.code})
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={proj.status} size="xs" />
                  <span className="font-mono font-bold text-slate-900 dark:text-white w-10 text-right">
                    {proj.progress}%
                  </span>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${proj.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
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
