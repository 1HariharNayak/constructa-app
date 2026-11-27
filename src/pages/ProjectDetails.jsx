import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  MapPin,
  User,
  Calendar,
  FolderKanban,
  CheckSquare,
  Flag,
  Users,
  Activity,
  Plus,
  ArrowLeft,
  LayoutGrid,
  List,
  Edit2
} from 'lucide-react';
import { StatusBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Tabs } from '../components/common/Tabs';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskTable } from '../components/tasks/TaskTable';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { MilestoneCard } from '../components/milestones/MilestoneCard';
import { MilestoneModal } from '../components/milestones/MilestoneModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { EmployeeDetailModal } from '../components/team/EmployeeModal';
import { getProjectCoverImage, ARCHITECTURAL_BLUEPRINT_SVG } from '../utils/projectImages';
import { TaskStatusChart } from '../components/dashboard/TaskStatusChart';

export function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canCreateTask, canManageMilestones, canEditProject } = useAuth();
  const {
    projects,
    tasks,
    milestones,
    employees,
    activities,
    updateProject,
    addTask,
    updateTask,
    moveTaskStatus,
    updateTaskProgress,
    reportTaskBlocker,
    addCommentToTask,
    deleteTask,
    addMilestone,
    updateMilestone,
    deleteMilestone
  } = useData();

  const project = projects.find(p => p.id === id);

  // Tab state
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Task view mode within project
  const [taskViewMode, setTaskViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [taskSearch, setTaskSearch] = useState('');

  // Modals & Drawer
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskModalColumn, setTaskModalColumn] = useState('Pending');

  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const [projectEditModalOpen, setProjectEditModalOpen] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  if (!project) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-[#E7E9E3]">
        <h2 className="text-lg font-bold text-[#242B27]">Project Not Found</h2>
        <p className="text-xs text-[#777F79] mt-1 mb-4">The project with ID "{id}" does not exist.</p>
        <Button variant="primary" size="sm" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  // Filtered data for this project
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const projectActivities = activities.filter(a => a.projectId === project.id);

  const projectEmployees = employees.filter(e =>
    project.assignedEmployees?.includes(e.id) || e.assignedProjects?.includes(project.id)
  );

  const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
  const blockedTasks = projectTasks.filter(t => t.status === 'Blocked').length;

  const filteredTasks = projectTasks.filter(t =>
    t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
    t.id.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const tabsConfig = [
    { id: 'overview', label: 'Overview', icon: FolderKanban },
    { id: 'tasks', label: 'Work Orders & Tasks', icon: CheckSquare, count: projectTasks.length },
    { id: 'milestones', label: 'Key Milestones', icon: Flag, count: projectMilestones.length },
    { id: 'team', label: 'Assigned Crew', icon: Users, count: projectEmployees.length },
    { id: 'activity', label: 'Audit Trail', icon: Activity, count: projectActivities.length }
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#242B27] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects Portfolio</span>
        </button>
      </div>

      {/* Hero Workspace Header */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
        {/* Banner with Cover photo */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#202824]">
          <img
            src={getProjectCoverImage(project)}
            alt={project.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = ARCHITECTURAL_BLUEPRINT_SVG;
            }}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202824] via-[#202824]/40 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-[#202824]/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded">
              {project.type}
            </span>
            <span className="bg-white/95 text-[#242B27] text-xs font-mono font-bold px-2 py-1 rounded shadow-2xs">
              {project.code}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <StatusBadge status={project.status} size="sm" />
            {canEditProject && (
              <button
                onClick={() => setProjectEditModalOpen(true)}
                className="p-1.5 rounded-lg bg-[#202824]/60 hover:bg-[#202824] text-white backdrop-blur-xs transition-colors cursor-pointer"
                title="Edit Project Charter"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="text-xl sm:text-3xl font-extrabold font-heading tracking-tight drop-shadow-sm">
              {project.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/90 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#A77B50]" />
                {project.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#657A6A]" />
                Lead PM: <strong>{project.manager}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-[#C28D4E]" />
                {project.startDate} to {project.endDate}
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Quick Metrics Bar */}
        <div className="p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E9E3]">
          <div className="flex-1 max-w-md">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#242B27]">Overall Construction Completion</span>
              <span className="font-mono font-bold text-base text-[#A77B50]">{project.progress}%</span>
            </div>
            <div className="w-full bg-[#E7E9E3] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#A77B50] h-full rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-[#777F79] border-t sm:border-t-0 sm:border-l border-[#E7E9E3] pt-3 sm:pt-0 sm:pl-6">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#777F79]">Deliverables</span>
              <span className="font-mono font-bold text-sm text-[#242B27]">
                {completedTasks}/{projectTasks.length} Done
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#777F79]">Milestones</span>
              <span className="font-mono font-bold text-sm text-[#242B27]">
                {projectMilestones.length} Phases
              </span>
            </div>
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#777F79]">Assigned Crew</span>
              <span className="font-mono font-bold text-sm text-[#242B27]">
                {projectEmployees.length} Specialists
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 bg-white">
          <Tabs
            tabs={tabsConfig}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setSearchParams({ tab: tabId });
            }}
          />
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Description, Milestones & Deadlines */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
                <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-2">
                  Project Specifications & Structural Details
                </h3>
                <p className="text-xs text-[#242B27] leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Milestones Progress */}
              <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
                    Milestone Progress Pipeline
                  </h3>
                  <button
                    onClick={() => setActiveTab('milestones')}
                    className="text-xs font-semibold text-[#A77B50] hover:underline cursor-pointer"
                  >
                    View All Milestones →
                  </button>
                </div>

                <div className="space-y-3">
                  {projectMilestones.map(m => (
                    <div key={m.id} className="p-3 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#242B27]">{m.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#777F79]">Due {m.targetDate}</span>
                          <StatusBadge status={m.status} size="xs" />
                        </div>
                      </div>
                      <div className="w-full bg-white h-1.5 rounded-full overflow-hidden border border-[#E7E9E3]">
                        <div
                          className="bg-[#A77B50] h-full rounded-full"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {projectMilestones.length === 0 && (
                    <div className="text-xs text-[#777F79] italic">No milestones defined yet.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Task Distribution & Team */}
            <div className="lg:col-span-1 space-y-6">
              <TaskStatusChart tasks={projectTasks} />

              {/* Assigned Team Mini Card */}
              <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#242B27]">Assigned Crew</h3>
                  <button
                    onClick={() => setActiveTab('team')}
                    className="text-xs font-semibold text-[#A77B50] hover:underline cursor-pointer"
                  >
                    Manage ({projectEmployees.length})
                  </button>
                </div>
                <div className="space-y-2">
                  {projectEmployees.slice(0, 4).map(emp => (
                    <div
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F6F6F2] cursor-pointer transition-colors"
                    >
                      <img src={emp.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E7E9E3]" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#242B27] truncate">{emp.name}</div>
                        <div className="text-[10px] text-[#777F79] truncate">{emp.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Tasks Workspace */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
            <input
              type="text"
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              placeholder="Search deliverables in this project..."
              className="p-2 text-xs bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg max-w-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            />

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#F6F6F2] p-0.5 rounded-lg border border-[#E7E9E3]">
                <button
                  onClick={() => setTaskViewMode('kanban')}
                  className={`p-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    taskViewMode === 'kanban' ? 'bg-white text-[#242B27] shadow-xs' : 'text-[#777F79]'
                  }`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setTaskViewMode('table')}
                  className={`p-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    taskViewMode === 'table' ? 'bg-white text-[#242B27] shadow-xs' : 'text-[#777F79]'
                  }`}
                >
                  Table
                </button>
              </div>

              {canCreateTask && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={Plus}
                  onClick={() => {
                    setTaskModalColumn('Pending');
                    setTaskModalOpen(true);
                  }}
                >
                  New Task
                </Button>
              )}
            </div>
          </div>

          {/* Kanban or Table */}
          {taskViewMode === 'kanban' ? (
            <KanbanBoard
              tasks={filteredTasks}
              employees={employees}
              onTaskClick={(task) => setSelectedTask(task)}
              onMoveTask={moveTaskStatus}
              onCreateTaskInColumn={(col) => {
                setTaskModalColumn(col);
                setTaskModalOpen(true);
              }}
            />
          ) : (
            <TaskTable
              tasks={filteredTasks}
              employees={employees}
              onTaskClick={(task) => setSelectedTask(task)}
              onEditTask={(task) => setSelectedTask(task)}
              onDeleteTask={deleteTask}
              canManage={canCreateTask}
            />
          )}
        </div>
      )}

      {/* Tab 3: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-[#242B27]">Project Milestones</h3>
              <p className="text-xs text-[#777F79]">Key construction phases and target deadlines</p>
            </div>
            {canManageMilestones && (
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setEditingMilestone(null);
                  setMilestoneModalOpen(true);
                }}
              >
                Add Milestone
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectMilestones.map(m => (
              <MilestoneCard
                key={m.id}
                milestone={m}
                tasks={projectTasks}
                onEdit={(mile) => {
                  setEditingMilestone(mile);
                  setMilestoneModalOpen(true);
                }}
                onDelete={deleteMilestone}
                canManage={canManageMilestones}
              />
            ))}
            {projectMilestones.length === 0 && (
              <div className="col-span-3 text-center py-12 text-xs text-[#777F79] bg-white rounded-xl border border-dashed border-[#E7E9E3]">
                No milestones defined for this project.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Team */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
            <h3 className="text-sm font-bold text-[#242B27]">Staffing & Field Engineers</h3>
            <p className="text-xs text-[#777F79]">Specialists assigned to {project.name}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectEmployees.map(emp => {
              const empTasks = projectTasks.filter(t => t.assignedTo?.includes(emp.id));
              const doneCount = empTasks.filter(t => t.status === 'Completed').length;

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="bg-white rounded-xl border border-[#E7E9E3] p-4 hover:border-[#D5D8CF] shadow-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E7E9E3]" />
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-[#242B27] truncate">{emp.name}</div>
                      <div className="text-xs text-[#777F79] truncate">{emp.role}</div>
                      <span className="text-[10px] font-semibold text-[#657A6A] bg-[#657A6A]/10 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {emp.department}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#E7E9E3] flex items-center justify-between text-xs text-[#777F79]">
                    <span>Project Tasks: <strong className="text-[#242B27]">{doneCount}/{empTasks.length}</strong></span>
                    <span className="font-mono text-[11px]">{emp.phone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Activity */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
          <h3 className="text-sm font-bold text-[#242B27] mb-4">
            Project Event & Inspection Log
          </h3>

          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E7E9E3]">
            {projectActivities.map(act => (
              <div key={act.id} className="relative text-xs">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#A77B50] ring-4 ring-white" />
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-[#242B27]">{act.user}</span>
                  <span className="text-[10px] font-mono text-[#777F79]">{act.timestamp}</span>
                </div>
                <div className="text-[#242B27] mt-0.5">
                  <span className="text-[#777F79]">{act.action}</span> <strong>{act.target}</strong>
                </div>
                {act.detail && (
                  <p className="text-[11px] text-[#777F79] mt-1 bg-[#F6F6F2] p-2 rounded border border-[#E7E9E3]">
                    {act.detail}
                  </p>
                )}
              </div>
            ))}
            {projectActivities.length === 0 && (
              <div className="text-xs text-[#777F79] italic">No activity logged for this project yet.</div>
            )}
          </div>
        </div>
      )}

      {/* Task Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        employees={employees}
        projects={projects}
        onUpdateTask={updateTask}
        onMoveTaskStatus={moveTaskStatus}
        onUpdateProgress={updateTaskProgress}
        onAddComment={addCommentToTask}
        onReportBlocker={reportTaskBlocker}
        onEditTask={(task) => {}}
        onDeleteTask={deleteTask}
        canManage={canCreateTask}
      />

      {/* Task Create Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={addTask}
        projects={projects}
        milestones={milestones}
        employees={employees}
        defaultStatus={taskModalColumn}
        defaultProjectId={project.id}
      />

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={milestoneModalOpen}
        onClose={() => {
          setMilestoneModalOpen(false);
          setEditingMilestone(null);
        }}
        onSubmit={(mData) => {
          if (editingMilestone) {
            updateMilestone(editingMilestone.id, mData);
          } else {
            addMilestone({ ...mData, projectId: project.id });
          }
        }}
        initialMilestone={editingMilestone}
        projects={projects}
        defaultProjectId={project.id}
      />

      {/* Project Edit Modal */}
      <ProjectModal
        isOpen={projectEditModalOpen}
        onClose={() => setProjectEditModalOpen(false)}
        onSubmit={(pData) => updateProject(project.id, pData)}
        initialProject={project}
        employees={employees}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        tasks={tasks}
        projects={projects}
        onOpenTask={(task) => setSelectedTask(task)}
      />
    </div>
  );
}
