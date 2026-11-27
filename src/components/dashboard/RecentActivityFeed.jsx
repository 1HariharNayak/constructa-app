import React from 'react';
import { Activity } from 'lucide-react';

export function RecentActivityFeed({ activities }) {
  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Activity className="w-4 h-4 text-[#A77B50]" />
              <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
                Recent Site Activity
              </h3>
            </div>
            <p className="text-xs text-[#777F79]">
              Audit trail of task movements, inspections, and blocker filings
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-[#A77B50] bg-[#A77B50]/10 px-2 py-0.5 rounded border border-[#A77B50]/20">
            Live
          </span>
        </div>

        <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E9E3]">
          {activities.slice(0, 5).map((act) => {
            let dotColor = 'bg-[#657A6A]';
            if (act.action.includes('blocker')) dotColor = 'bg-[#C66C62]';
            else if (act.action.includes('completed')) dotColor = 'bg-[#5D8068]';
            else if (act.action.includes('review')) dotColor = 'bg-[#C28D4E]';

            return (
              <div key={act.id} className="relative group text-xs">
                {/* Dot */}
                <div
                  className={`absolute -left-5 top-1.5 w-2 h-2 rounded-full ${dotColor} ring-4 ring-white`}
                />

                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-[#242B27]">
                    {act.user}
                  </span>
                  <span className="text-[10px] text-[#777F79] shrink-0 font-mono">
                    {act.timestamp}
                  </span>
                </div>

                <div className="text-[#242B27] mt-0.5 text-xs">
                  <span className="text-[#777F79]">{act.action}</span>{' '}
                  <span className="font-semibold text-[#242B27]">{act.target}</span>
                </div>

                {act.detail && (
                  <p className="text-[11px] text-[#777F79] mt-1 leading-relaxed bg-[#F6F6F2] p-1.5 rounded border border-[#E7E9E3]">
                    {act.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
