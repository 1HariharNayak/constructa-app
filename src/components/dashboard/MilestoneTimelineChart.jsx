import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Flag, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function MilestoneTimelineChart({ milestones, projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Flag className="w-4 h-4 text-[#A77B50]" />
            <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
              Project Timeline & Key Milestones
            </h3>
          </div>
          <p className="text-xs text-[#777F79]">
            Critical path milestones requiring structural approvals and client handovers
          </p>
        </div>
        <button
          onClick={() => navigate('/milestones')}
          className="text-xs font-semibold text-[#A77B50] hover:text-[#8E653E] cursor-pointer"
        >
          View Roadmap →
        </button>
      </div>

      <div className="space-y-3">
        {milestones.slice(0, 5).map((m) => {
          const proj = projects.find(p => p.id === m.projectId);

          let statusIcon = Clock;
          let iconColor = 'text-[#777F79]';
          if (m.status === 'Completed') {
            statusIcon = CheckCircle2;
            iconColor = 'text-[#5D8068]';
          } else if (m.status === 'Delayed') {
            statusIcon = AlertCircle;
            iconColor = 'text-[#C66C62]';
          }

          const IconComponent = statusIcon;

          return (
            <div
              key={m.id}
              onClick={() => navigate(`/projects/${m.projectId}?tab=milestones`)}
              className="p-3 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg hover:border-[#D5D8CF] transition-colors cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <IconComponent className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                  <div>
                    <h4 className="text-xs font-bold text-[#242B27] group-hover:text-[#A77B50] transition-colors">
                      {m.name}
                    </h4>
                    <span className="text-[11px] text-[#777F79]">
                      {proj?.name || m.projectName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] text-[#777F79] flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-[#A77B50]" />
                    {m.targetDate}
                  </span>
                  <StatusBadge status={m.status} size="xs" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2.5 flex items-center gap-2">
                <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden border border-[#E7E9E3]">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      m.status === 'Completed'
                        ? 'bg-[#5D8068]'
                        : m.status === 'Delayed'
                        ? 'bg-[#C66C62]'
                        : 'bg-[#A77B50]'
                    }`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#777F79] w-7 text-right">
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
