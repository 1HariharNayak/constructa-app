import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { Button } from '../components/common/Button';
import {
  Search,
  Plus,
  Filter,
  Kanban,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';

export function TaskBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { canCreateTask } = useAuth();
  const {
    visibleTasks,
    projects,
    milestones,
    employees,
    addTask,
    updateTask,
    moveTaskStatus,
    updateTaskProgress,
    reportTaskBlocker,
    addCommentToTask,
    deleteTask
  } = useData();

  const initialTaskId = searchParams.get('taskId');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals & Drawer
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumn, setDefaultColumn] = useState('Pending');

  // If initialTaskId provided in URL, open it in drawer
  useEffect(() => {
    if (initialTaskId) {
      const match = visibleTasks.find(t => t.id === initialTaskId);
      if (match) setSelectedTask(match);
    }
  }, [initialTaskId, visibleTasks]);

  useEffect(() => {
    if (selectedTask) {
      const updated = visibleTasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [visibleTasks]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return visibleTasks.filter(t => {
      const matchSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.projectName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProject = projectFilter === 'All' || t.projectId === projectFilter;
      const matchEmployee = employeeFilter === 'All' || (t.assignedTo || t.assigneeIds || [])?.includes(employeeFilter);
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      return matchSearch && matchProject && matchEmployee && matchPriority;
    });
  }, [visibleTasks, searchQuery, projectFilter, employeeFilter, priorityFilter]);

  const handleCreateOrUpdate = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      setEditingTask(null);
    } else {
      addTask(formData);
    }
  };

  const openNewTaskInColumn = (status) => {
    setDefaultColumn(status);
    setEditingTask(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Interactive Workflow
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Kanban className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Task Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual stage-gate workflow across active field tasks, inspections, and deliverables.
          </p>
        </div>

        {canCreateTask && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setDefaultColumn('Pending');
              setEditingTask(null);
              setIsCreateModalOpen(true);
            }}
          >
            Create Work Order
          </Button>
        )}
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deliverables by code, title, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Project filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assignee filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Assignee:</span>
            <select
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Specialists</option>
              {employees.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Kanban Board Canvas */}
      <div className="overflow-x-auto pb-4">
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={(task) => setSelectedTask(task)}
          onMoveStatus={moveTaskStatus}
          onAddTaskInColumn={openNewTaskInColumn}
        />
      </div>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTask}
        defaultStatus={defaultColumn}
        projects={projects}
        milestones={milestones}
        employees={employees}
      />

      {/* Detailed Slide-out Drawer */}
      <TaskDetailDrawer
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onUpdateProgress={updateTaskProgress}
        onMoveStatus={moveTaskStatus}
        onReportBlocker={reportTaskBlocker}
        onAddComment={addCommentToTask}
        onEdit={(task) => {
          setEditingTask(task);
          setIsCreateModalOpen(true);
        }}
        onDelete={(taskId) => {
          deleteTask(taskId);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
