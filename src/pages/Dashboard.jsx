import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  CheckSquare,
  Plus,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
  Filter
} from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { ProjectProgressChart } from '../components/dashboard/ProjectProgressChart';
import { TaskStatusChart } from '../components/dashboard/TaskStatusChart';
import { MonthlyTaskChart } from '../components/dashboard/MonthlyCompletionChart';
import { MilestoneTimelineChart } from '../components/dashboard/MilestoneTimelineChart';
import { RecentProjectsSection } from '../components/dashboard/RecentProjectsSection';
import { UpcomingDeadlinesSection } from '../components/dashboard/UpcomingDeadlinesSection';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { TeamWorkloadSection } from '../components/dashboard/TeamWorkloadSection';
import { EmployeeDashboard } from '../components/dashboard/EmployeeDashboard';
import { TaskDetailDrawer } from '../components/tasks/TaskDetailDrawer';
import { TaskModal } from '../components/tasks/TaskModal';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Button } from '../components/common/Button';
import { isOverdue } from '../utils/formatters';

export function Dashboard() {
  const { currentUser, isEmployee, canCreateProject, canCreateTask } = useAuth();
  const {
    projects,
    tasks,
    milestones,
    employees,
    activities,
    addTask,
    updateTask,
    moveTaskStatus,
    updateTaskProgress,
    reportTaskBlocker,
    addCommentToTask,
    deleteTask,
    addProject
  } = useData();

  const navigate = useNavigate();

  // Modals & Drawers state
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('This Quarter');
  const [selectedDate, setSelectedDate] = useState('2026-11-26');

  // Stats calculation
  const totalProjects = projects.length || 28;
  const activeProjects = projects.filter(p => p.status === 'In Progress').length || 16;
  const completedProjects = projects.filter(p => p.status === 'Completed').length || 7;
  const onHoldProjects = projects.filter(p => p.status === 'Delayed' || p.status === 'Planning').length || 5;

  const totalTasks = tasks.length || 186;
  const overdueTasks = tasks.filter(t => isOverdue(t.dueDate, t.status)).length || 12;

  // If Employee role is active, render tailored Employee Dashboard
  if (isEmployee) {
    return (
      <>
        <EmployeeDashboard
          currentUser={currentUser}
          tasks={tasks}
          projects={projects}
          onOpenTaskDrawer={(task) => setSelectedTask(task)}
          onUpdateTaskProgress={updateTaskProgress}
          onMoveTaskStatus={moveTaskStatus}
          onReportBlocker={reportTaskBlocker}
        />

        {/* Task Detail Drawer */}
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
          canManage={false}
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-[#1C221F] rounded-xl border border-[#E7E9E3] dark:border-[#2A332E] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Executive Portfolio Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] dark:text-[#EDEDEA] font-heading tracking-tight">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Anant'}
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] dark:text-[#9BA29C] mt-1">
            Here's what's happening across your capital construction projects today.
          </p>
        </div>

        {/* Cohesive Right Toolbar */}
        <div className="flex items-center gap-2.5 flex-wrap lg:flex-nowrap">
          {/* Date Selector */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F6F2] dark:bg-[#232B27] border border-[#E7E9E3] dark:border-[#2A332E] text-xs text-[#242B27] dark:text-[#EDEDEA]">
            <Calendar className="w-3.5 h-3.5 text-[#A77B50]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs font-mono font-medium text-[#242B27] dark:text-[#EDEDEA] focus:outline-none cursor-pointer"
            />
          </div>

          {/* Reporting Period Filter */}
          <div className="flex items-center gap-1 bg-[#F6F6F2] dark:bg-[#232B27] border border-[#E7E9E3] dark:border-[#2A332E] rounded-lg p-0.5 text-xs">
            {['This Month', 'This Quarter', 'YTD'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-white dark:bg-[#1C221F] text-[#242B27] dark:text-[#EDEDEA] shadow-xs'
                    : 'text-[#777F79] dark:text-[#9BA29C] hover:text-[#242B27] dark:hover:text-[#EDEDEA]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Clean Primary Action */}
          {canCreateProject && (
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setProjectModalOpen(true)}
            >
              New Project
            </Button>
          )}
        </div>
      </div>

      {/* 6 Clean KPI Cards - No Truncation, Balanced Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          description="Active & archived"
          trend="+2 this qtr"
          trendPositive={true}
          icon={FolderKanban}
          variant="default"
          onClick={() => navigate('/projects')}
        />
        <StatCard
          title="Active Sites"
          value={activeProjects}
          description="In structural execution"
          trend="8 on track"
          trendPositive={true}
          icon={Clock}
          variant="bronze"
          onClick={() => navigate('/projects?status=In Progress')}
        />
        <StatCard
          title="Completed"
          value={completedProjects}
          description="Certified delivery"
          trend="100% code"
          trendPositive={true}
          icon={CheckCircle2}
          variant="success"
          onClick={() => navigate('/projects?status=Completed')}
        />
        <StatCard
          title="On Hold"
          value={onHoldProjects}
          description="Permit clearance"
          trend="Action required"
          trendPositive={false}
          icon={AlertTriangle}
          variant="warning"
          onClick={() => navigate('/projects?status=Delayed')}
        />
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          description="Active deliverables"
          trend="92% velocity"
          trendPositive={true}
          icon={CheckSquare}
          variant="info"
          onClick={() => navigate('/tasks')}
        />
        <StatCard
          title="Overdue"
          value={overdueTasks}
          description="Critical path delay"
          trend="Immediate"
          trendPositive={false}
          icon={AlertCircle}
          variant="danger"
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Main Analytics Row 1: Balanced Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectProgressChart projects={projects} />
        </div>
        <div className="lg:col-span-1">
          <TaskStatusChart tasks={tasks} />
        </div>
      </div>

      {/* Analytics Row 2: Monthly Task Completion & Milestone Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyTaskChart />
        <MilestoneTimelineChart milestones={milestones} projects={projects} />
      </div>

      {/* Active Capital Projects Gallery / Cards */}
      <RecentProjectsSection projects={projects} />

      {/* Lower Dashboard Section: Deadlines vs Recent Activities vs Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UpcomingDeadlinesSection tasks={tasks} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityFeed activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <TeamWorkloadSection employees={employees} tasks={tasks} />
        </div>
      </div>

      {/* Modals & Drawers */}
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
        onEditTask={() => {}}
        onDeleteTask={deleteTask}
        canManage={true}
      />

      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={addTask}
        projects={projects}
        milestones={milestones}
        employees={employees}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={addProject}
        employees={employees}
      />
    </div>
  );
}
