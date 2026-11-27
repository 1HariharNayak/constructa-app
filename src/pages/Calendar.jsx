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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Project Delivery Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-7 h-7 text-[#A77B50]" />
            Master Schedule Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Unified view of key contractual milestones, stage gates, and field inspections.
          </p>
        </div>

        {/* Month Switcher Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={jumpToday}
            className="px-3 py-1.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] hover:bg-white text-xs font-semibold text-[#242B27] transition-all cursor-pointer shadow-2xs"
          >
            Today (Nov 2026)
          </button>
          <div className="flex items-center bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-md text-[#777F79] hover:text-[#242B27] hover:bg-white transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold font-heading text-[#242B27] min-w-36 text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-md text-[#777F79] hover:text-[#242B27] hover:bg-white transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#777F79]">Filter Project:</span>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-3 py-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs font-semibold text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Construction Sites</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#777F79]">View Layer:</span>
          <div className="flex items-center gap-1 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setEventTypeFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'all' ? 'bg-[#202824] text-white shadow-xs' : 'text-[#777F79] hover:text-[#242B27]'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setEventTypeFilter('milestones')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'milestones' ? 'bg-[#A77B50] text-white shadow-xs' : 'text-[#777F79] hover:text-[#242B27]'
              }`}
            >
              Milestones Only
            </button>
            <button
              onClick={() => setEventTypeFilter('tasks')}
              className={`px-2.5 py-1 rounded-md transition-all font-semibold ${
                eventTypeFilter === 'tasks' ? 'bg-[#657A6A] text-white shadow-xs' : 'text-[#777F79] hover:text-[#242B27]'
              }`}
            >
              Work Orders
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[#E7E9E3] bg-[#FAF9F6] text-center text-xs font-bold text-[#777F79] py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Calendar Days Matrix */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#E7E9E3] border-b border-[#E7E9E3]">
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
                  isCurrentMonth ? 'bg-white hover:bg-[#FAF9F6]' : 'bg-[#F9F9F6] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                      isToday
                        ? 'bg-[#A77B50] text-white font-bold'
                        : isCurrentMonth
                          ? 'text-[#242B27]'
                          : 'text-[#8E9690]'
                    }`}
                  >
                    {cell.day}
                  </span>
                  {(dayTasks.length > 0 || dayMilestones.length > 0) && (
                    <span className="text-[10px] font-mono text-[#777F79]">
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
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#A77B50]/15 text-[#A77B50] border border-[#A77B50]/30 truncate cursor-pointer hover:bg-[#A77B50]/25 transition-colors flex items-center gap-1"
                      title={`Milestone: ${m.name}`}
                    >
                      <Flag className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{m.name}</span>
                    </div>
                  ))}

                  {/* Tasks */}
                  {dayTasks.map(t => {
                    let pillStyle = 'bg-[#657A6A]/15 text-[#657A6A] border-[#657A6A]/30';
                    if (t.priority === 'Urgent') pillStyle = 'bg-[#C66C62]/15 text-[#C66C62] border-[#C66C62]/30';
                    else if (t.status === 'Completed') pillStyle = 'bg-[#5D8068]/15 text-[#5D8068] border-[#5D8068]/30';

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
