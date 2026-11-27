import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock, Calendar, CheckSquare } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { isOverdue, formatShortDate } from '../../utils/formatters';

export function UpcomingDeadlinesSection({ tasks }) {
  const navigate = useNavigate();

  // Sort tasks by due date
  const sorted = [...tasks]
    .filter(t => t.status !== 'Completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const overdue = sorted.filter(t => isOverdue(t.dueDate, t.status));
  const upcoming = sorted.filter(t => !isOverdue(t.dueDate, t.status)).slice(0, 4);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Deadlines & Urgent Items
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deliverables requiring immediate field inspection or engineer sign-off
            </p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
          >
            Tasks →
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Overdue alert block if any */}
          {overdue.length > 0 && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Overdue Deliverables ({overdue.length})</span>
              </div>
              <div className="space-y-1.5">
                {overdue.slice(0, 2).map(t => (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/tasks?taskId=${t.id}`)}
                    className="flex items-center justify-between p-2 rounded bg-white dark:bg-slate-800 border border-rose-100 dark:border-rose-900/50 hover:border-rose-300 text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 shrink-0 text-[11px]">{t.id}</span>
                      <span className="font-medium text-slate-900 dark:text-white group-hover:text-rose-600 truncate text-xs">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">Due {formatShortDate(t.dueDate)}</span>
                      <PriorityBadge priority={t.priority} size="xs" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming deliverables */}
          <div className="space-y-2">
            {upcoming.map(t => (
              <div
                key={t.id}
                onClick={() => navigate(`/tasks?taskId=${t.id}`)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors text-xs cursor-pointer group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {t.projectName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatShortDate(t.dueDate)}
                  </span>
                  <PriorityBadge priority={t.priority} size="xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
