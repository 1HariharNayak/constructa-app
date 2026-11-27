import React from 'react';
import { Activity } from 'lucide-react';

export function RecentActivityFeed({ activities }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Recent Site Activity
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trail of task movements, inspections, and blocker filings
            </p>
          </div>
          <span className="text-[10px] font-mono font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/40">
            Live
          </span>
        </div>

        <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
          {activities.slice(0, 5).map((act) => {
            let dotColor = 'bg-blue-600';
            if (act.action.includes('blocker')) dotColor = 'bg-rose-500';
            else if (act.action.includes('completed')) dotColor = 'bg-emerald-500';
            else if (act.action.includes('review')) dotColor = 'bg-amber-500';

            return (
              <div key={act.id} className="relative group text-xs">
                {/* Dot */}
                <div
                  className={`absolute -left-5 top-1.5 w-2 h-2 rounded-full ${dotColor} ring-4 ring-white dark:ring-slate-800`}
                />

                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {act.user}
                  </span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                    {act.timestamp}
                  </span>
                </div>

                <div className="text-slate-800 dark:text-slate-200 mt-0.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">{act.action}</span>{' '}
                  <span className="font-medium text-slate-900 dark:text-white">{act.target}</span>
                </div>

                {act.detail && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-700/40 p-2 rounded border border-slate-100 dark:border-slate-700">
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
