import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function MilestoneTimelineChart({ milestones, projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Flag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Project Timeline & Key Milestones
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Critical path milestones requiring structural approvals and client handovers
          </p>
        </div>
        <button
          onClick={() => navigate('/milestones')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
        >
          View Roadmap →
        </button>
      </div>

      <div className="space-y-3">
        {milestones.slice(0, 5).map((m) => {
          const proj = projects.find(p => p.id === m.projectId);

          let statusIcon = Clock;
          let iconColor = 'text-slate-400';
          if (m.status === 'Completed') {
            statusIcon = CheckCircle2;
            iconColor = 'text-emerald-500';
          } else if (m.status === 'Delayed') {
            statusIcon = AlertCircle;
            iconColor = 'text-rose-500';
          }

          const IconComponent = statusIcon;

          return (
            <div
              key={m.id}
              onClick={() => navigate(`/projects/${m.projectId}?tab=milestones`)}
              className="p-3 bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-lg hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {m.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {proj?.name || m.projectName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {m.targetDate}
                  </span>
                  <StatusBadge status={m.status} size="xs" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      m.status === 'Completed'
                        ? 'bg-emerald-500'
                        : m.status === 'Delayed'
                        ? 'bg-rose-500'
                        : 'bg-blue-600'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 w-7 text-right">
                  {m.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
