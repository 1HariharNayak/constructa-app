import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  CheckSquare,
  ArrowUpDown
} from 'lucide-react';

export function Tasks() {
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

  // URL Query param handling for direct linking
  const initialTaskId = searchParams.get('taskId');
  const initialView = searchParams.get('view') === 'table' ? 'table' : 'kanban';

  // View state: 'kanban' | 'table'
  const [viewMode, setViewMode] = useState(initialView);

  // Sync viewMode whenever searchParams changes
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'table' || view === 'kanban') {
      setViewMode(view);
    }
  }, [searchParams]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [employeeFilter, setEmployeeFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modals & Drawer
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.get('action') === 'new');
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumn, setDefaultColumn] = useState('Pending');

  // If initialTaskId provided in URL, open it in drawer
  useEffect(() => {
    if (initialTaskId) {
      const match = visibleTasks.find(t => t.id === initialTaskId);
      if (match) {
        setSelectedTask(match);
      }
    }
  }, [initialTaskId, visibleTasks]);

  // Keep selectedTask updated if modified in state
  useEffect(() => {
    if (selectedTask) {
      const updated = visibleTasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [visibleTasks]);

  // Filtered & Sorted Tasks
  const filteredTasks = useMemo(() => {
    return visibleTasks
      .filter(t => {
        const matchSearch =
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.projectName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchProject = projectFilter === 'All' || t.projectId === projectFilter;
        const matchEmployee = employeeFilter === 'All' || t.assignedTo?.includes(employeeFilter);
        const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
        const matchStatus = statusFilter === 'All' || t.status === statusFilter;

        return matchSearch && matchProject && matchEmployee && matchPriority && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority') {
          const weights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (weights[b.priority] || 0) - (weights[a.priority] || 0);
        }
        if (sortBy === 'progress') {
          return b.progress - a.progress;
        }
        return 0;
      });
  }, [visibleTasks, searchQuery, projectFilter, employeeFilter, priorityFilter, statusFilter, sortBy]);

  const handleCreateOrUpdate = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
      setEditingTask(null);
    } else {
      addTask(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Field Execution & Deliverables
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            Work Orders & Tasks
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Track site inspections, concrete pours, MEP balance runs, and structural certifications across all sites.
          </p>
        </div>

        {canCreateTask && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setDefaultColumn('Pending');
              setIsCreateModalOpen(true);
            }}
          >
            Create Work Order
          </Button>
        )}
      </div>

      {/* Control Bar: Search & Multi-Filters */}
      <div className="p-4 bg-white rounded-xl border border-[#E7E9E3] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777F79] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search deliverables by ID, title, or project..."
              className="w-full pl-9 pr-3 py-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F6F6F2] p-0.5 rounded-lg border border-[#E7E9E3]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'kanban'
                    ? 'bg-white text-[#242B27] shadow-xs'
                    : 'text-[#777F79] hover:text-[#242B27]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-[#242B27] shadow-xs'
                    : 'text-[#777F79] hover:text-[#242B27]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E7E9E3] text-xs">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Employee Filter */}
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Personnel</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.name} ({e.role.split(' ')[0]})</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Workflow States</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Under Review">Under Review</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Sort By */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[#777F79]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#A77B50]" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-1 bg-[#F6F6F2] border border-[#E7E9E3] rounded text-[#242B27] focus:outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="progress">Completion %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Kanban / Table Views */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks found matching current filters"
          description="Adjust your search criteria, project dropdown, or status filters."
          actionText={canCreateTask ? "Add New Task" : undefined}
          onAction={() => {
            setSearchQuery('');
            setProjectFilter('All');
            setEmployeeFilter('All');
            setPriorityFilter('All');
            setStatusFilter('All');
            if (canCreateTask) setIsCreateModalOpen(true);
          }}
        />
      ) : viewMode === 'kanban' ? (
        <KanbanBoard
          tasks={filteredTasks}
          employees={employees}
          onTaskClick={(task) => setSelectedTask(task)}
          onMoveTask={moveTaskStatus}
          onCreateTaskInColumn={(col) => {
            if (!canCreateTask) return;
            setDefaultColumn(col);
            setEditingTask(null);
            setIsCreateModalOpen(true);
          }}
        />
      ) : (
        <TaskTable
          tasks={filteredTasks}
          employees={employees}
          onTaskClick={(task) => setSelectedTask(task)}
          onEditTask={(task) => {
            setEditingTask(task);
            setIsCreateModalOpen(true);
          }}
          onDeleteTask={deleteTask}
          canManage={canCreateTask}
        />
      )}

      {/* Task Details Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
          if (searchParams.get('taskId')) {
            searchParams.delete('taskId');
            setSearchParams(searchParams);
          }
        }}
        task={selectedTask}
        employees={employees}
        projects={projects}
        onUpdateTask={updateTask}
        onMoveTaskStatus={moveTaskStatus}
        onUpdateProgress={updateTaskProgress}
        onAddComment={addCommentToTask}
        onReportBlocker={reportTaskBlocker}
        onEditTask={(task) => {
          setEditingTask(task);
          setIsCreateModalOpen(true);
        }}
        onDeleteTask={deleteTask}
        canManage={canCreateTask}
      />

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialTask={editingTask}
        projects={projects}
        milestones={milestones}
        employees={employees}
        defaultStatus={defaultColumn}
      />
    </div>
  );
}
