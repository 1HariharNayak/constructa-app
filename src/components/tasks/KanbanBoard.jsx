import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { STATUS_COLORS } from '../../utils/statusStyles';

const COLUMNS = [
  STATUS_COLORS['Pending'],
  STATUS_COLORS['In Progress'],
  STATUS_COLORS['Under Review'],
  STATUS_COLORS['Completed'],
  STATUS_COLORS['Blocked']
];

export function KanbanBoard({
  tasks,
  employees,
  onTaskClick,
  onMoveTask,
  onCreateTaskInColumn
}) {
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);

  const handleDragStart = (e, taskId) => {
    setActiveDragId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== columnId) {
      setDragOverCol(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (taskId) {
      onMoveTask(taskId, columnId);
    }
    setActiveDragId(null);
    setDragOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start min-h-[600px] overflow-x-auto pb-6">
      {COLUMNS.map(col => {
        const columnTasks = tasks.filter(t => t.status === col.id);
        const isTarget = dragOverCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex flex-col ${col.columnBg} rounded-xl border ${col.columnBorder} border-t-4 ${col.border} p-3 transition-colors ${
              isTarget ? 'ring-2 ring-current ring-offset-1' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shadow-2xs`} />
                <h3 className={`text-xs font-extrabold ${col.headerText} tracking-wider uppercase`}>
                  {col.label}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border shadow-2xs ${col.countBadge}`}>
                  {columnTasks.length}
                </span>
              </div>

              {onCreateTaskInColumn && (
                <button
                  onClick={() => onCreateTaskInColumn(col.id)}
                  className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={`Add deliverable to ${col.label}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Task Card List */}
            <div className="space-y-3 min-h-[160px] flex-1">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  employees={employees}
                  onClick={onTaskClick}
                  onDragStart={handleDragStart}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-24 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center p-3 text-[11px] text-slate-400">
                  Drag work orders here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
