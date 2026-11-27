import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'Pending', label: 'Pending', dot: 'bg-[#8E9690]', border: 'border-t-[#8E9690]' },
  { id: 'In Progress', label: 'In Progress', dot: 'bg-[#A77B50]', border: 'border-t-[#A77B50]' },
  { id: 'Under Review', label: 'Under Review', dot: 'bg-[#C28D4E]', border: 'border-t-[#C28D4E]' },
  { id: 'Completed', label: 'Completed', dot: 'bg-[#5D8068]', border: 'border-t-[#5D8068]' },
  { id: 'Blocked', label: 'Blocked', dot: 'bg-[#C66C62]', border: 'border-t-[#C66C62]' }
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
            className={`flex flex-col bg-[#F6F6F2] rounded-xl border border-[#E7E9E3] border-t-3 ${col.border} p-3 transition-colors ${
              isTarget ? 'bg-[#A77B50]/10 ring-2 ring-[#A77B50]/40' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-bold text-[#242B27] tracking-wider uppercase">
                  {col.label}
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-white text-[#777F79] border border-[#E7E9E3]">
                  {columnTasks.length}
                </span>
              </div>

              {onCreateTaskInColumn && (
                <button
                  onClick={() => onCreateTaskInColumn(col.id)}
                  className="p-1 rounded text-[#777F79] hover:text-[#242B27] hover:bg-white transition-colors cursor-pointer"
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
                <div className="flex items-center justify-center h-24 border border-dashed border-[#D5D8CF] rounded-lg text-center p-3 text-[11px] text-[#777F79]">
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
