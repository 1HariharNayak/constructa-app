import React from 'react';
import { Flag, Calendar, CheckSquare, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export function MilestoneCard({
  milestone,
  tasks = [],
  onEdit,
  onDelete,
  canManage = false
}) {
  const linkedTasks = tasks.filter(t => t.milestoneId === milestone.id);
  const completedCount = linkedTasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs hover:border-[#D5D8CF] hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3] text-[#A77B50] flex items-center justify-center shrink-0">
              <Flag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-[#242B27] group-hover:text-[#A77B50] transition-colors truncate">
                {milestone.name}
              </h3>
              <span className="text-[11px] text-[#777F79] block truncate">
                {milestone.projectName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <StatusBadge status={milestone.status} size="xs" />
            {canManage && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <button
                  onClick={() => onEdit(milestone)}
                  className="p-1 text-[#777F79] hover:text-[#A77B50] rounded"
                  title="Edit Milestone"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(milestone.id)}
                  className="p-1 text-[#777F79] hover:text-[#C66C62] rounded"
                  title="Delete Milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {milestone.description && (
          <p className="text-xs text-[#777F79] mt-2 line-clamp-2 leading-relaxed">
            {milestone.description}
          </p>
        )}

        {/* Date details */}
        <div className="flex items-center justify-between text-xs text-[#777F79] mt-4 pt-3 border-t border-[#E7E9E3]">
          <span className="font-mono flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#A77B50]" />
            {milestone.startDate} → {milestone.targetDate}
          </span>
          <span className="flex items-center gap-1 font-medium">
            <CheckSquare className="w-3 h-3 text-[#657A6A]" />
            {completedCount}/{linkedTasks.length} tasks
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-3 border-t border-[#E7E9E3]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#777F79]">Milestone Progress</span>
          <span className="font-mono font-bold text-[#242B27]">{milestone.progress}%</span>
        </div>
        <div className="w-full bg-[#E7E9E3] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              milestone.status === 'Completed'
                ? 'bg-[#5D8068]'
                : milestone.status === 'Delayed'
                ? 'bg-[#C66C62]'
                : 'bg-[#A77B50]'
            }`}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
