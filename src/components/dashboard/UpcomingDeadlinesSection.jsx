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
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
              Deadlines & Urgent Items
            </h3>
            <p className="text-xs text-[#777F79] mt-0.5">
              Deliverables requiring immediate field inspection or engineer sign-off
            </p>
          </div>
          <button
            onClick={() => navigate('/tasks')}
            className="text-xs font-semibold text-[#A77B50] hover:text-[#8E653E] cursor-pointer"
          >
            Tasks →
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Overdue alert block if any */}
          {overdue.length > 0 && (
            <div className="p-3 rounded-lg bg-[#C66C62]/10 border border-[#C66C62]/30">
              <div className="flex items-center gap-1.5 text-[#C66C62] text-xs font-bold uppercase tracking-wider mb-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Overdue Deliverables ({overdue.length})</span>
              </div>
              <div className="space-y-1.5">
                {overdue.slice(0, 2).map(t => (
                  <div
                    key={t.id}
                    onClick={() => navigate(`/tasks?taskId=${t.id}`)}
                    className="flex items-center justify-between p-2 rounded bg-white border border-[#C66C62]/20 hover:border-[#C66C62] text-xs cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-[#C66C62] shrink-0 text-[11px]">{t.id}</span>
                      <span className="font-medium text-[#242B27] group-hover:text-[#C66C62] truncate text-xs">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-[#C66C62]">Due {formatShortDate(t.dueDate)}</span>
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
                className="flex items-center justify-between p-2.5 rounded-lg border border-[#E7E9E3] hover:bg-[#F6F6F2] hover:border-[#D5D8CF] transition-colors text-xs cursor-pointer group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <CheckSquare className="w-4 h-4 text-[#657A6A] shrink-0 mt-0.5" />
                  <div className="truncate">
                    <div className="font-semibold text-[#242B27] group-hover:text-[#A77B50] truncate">
                      {t.title}
                    </div>
                    <div className="text-[11px] text-[#777F79] truncate">
                      {t.projectName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[#777F79] font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#A77B50]" />
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
