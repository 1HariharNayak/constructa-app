import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { MilestoneModal } from '../components/milestones/MilestoneModal';
import { Button } from '../components/common/Button';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flag,
  CheckSquare,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function Calendar() {
  const {
    tasks,
    milestones,
    projects,
    updateTaskProgress,
    moveTaskStatus,
    reportTaskBlocker,
    addCommentToTask,
    deleteTask,
    updateMilestone
  } = useData();

  // Current viewing month (default Nov 2026 as per mock dataset)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026
  const [selectedProject, setSelectedProject] = useState('All');
  const [eventTypeFilter, setEventTypeFilter] = useState('all'); // 'all' | 'milestones' | 'tasks'

  // Modals / Drawers
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const jumpToday = () => {
    setCurrentDate(new Date(2026, 10, 1));
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Compute calendar grid days
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Filter tasks & milestones
  const activeTasks = useMemo(() => {
    return tasks.filter(t => selectedProject === 'All' || t.projectId === selectedProject);
  }, [tasks, selectedProject]);

  const activeMilestones = useMemo(() => {
    return milestones.filter(m => selectedProject === 'All' || m.projectId === selectedProject);
  }, [milestones, selectedProject]);

  // Build 35 or 42 grid cells
  const calendarDays = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      monthType: 'prev',
      dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDays.push({
      day: i,
      monthType: 'current',
      dateString
    });
  }

  // Next month leading days
  const remainingCells = 35 - calendarDays.length;
  for (let i = 1; i <= (remainingCells > 0 ? remainingCells : 42 - calendarDays.length); i++) {
    calendarDays.push({
      day: i,
      monthType: 'next',
      dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Project Delivery Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Master Schedule Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Unified view of key contractual milestones, stage gates, and field inspections.
          </p>
        </div>

        {/* Month Switcher Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToday}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-xs"
          >
            Today (Nov 2026)
          </button>
          <div className="flex items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-600 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-36 text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filter Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Construction Sites</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">View Layer:</span>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setEventTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'all' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setEventTypeFilter('milestones')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'milestones' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Milestones Only
            </button>
            <button
              onClick={() => setEventTypeFilter('tasks')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'tasks' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Work Orders
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-center text-xs font-bold text-slate-500 dark:text-slate-400 py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 dark:divide-slate-700 border-b border-slate-200 dark:border-slate-700">
          {calendarDays.map((cell, idx) => {
            // Find tasks due on this date
            const dayTasks = eventTypeFilter === 'milestones' ? [] : activeTasks.filter(t => t.dueDate === cell.dateString);
            // Find milestones on this date
            const dayMilestones = eventTypeFilter === 'tasks' ? [] : activeMilestones.filter(m => m.targetDate === cell.dateString);

            const isCurrentMonth = cell.monthType === 'current';
            const isToday = cell.dateString === '2026-11-26';

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-1.5 transition-colors ${
                  isCurrentMonth ? 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/40' : 'bg-slate-50/50 dark:bg-slate-900/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      isToday
                        ? 'bg-blue-600 text-white font-bold'
                        : isCurrentMonth
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {(dayTasks.length > 0 || dayMilestones.length > 0) && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {dayTasks.length + dayMilestones.length}
                    </span>
                  )}
                </div>

                {/* Event Pills */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] custom-scrollbar">
                  {/* Milestones */}
                  {dayMilestones.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMilestone(m)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 truncate cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-1"
                      title={`Milestone: ${m.name}`}
                    >
                      <Flag className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{m.name}</span>
                    </div>
                  ))}

                  {/* Tasks */}
                  {dayTasks.map(t => {
                    let pillStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
                    if (t.priority === 'Urgent') pillStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
                    else if (t.status === 'Completed') pillStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';

                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTask(t)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-medium border truncate cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1 ${pillStyle}`}
                        title={`Task: ${t.title}`}
                      >
                        <CheckSquare className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Detail Drawer */}
      <TaskDetailDrawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateProgress={updateTaskProgress}
        onMoveStatus={moveTaskStatus}
        onReportBlocker={reportTaskBlocker}
        onAddComment={addCommentToTask}
        onDelete={(taskId) => {
          deleteTask(taskId);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
