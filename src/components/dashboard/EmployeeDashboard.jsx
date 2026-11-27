import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Play,
  Sliders,
  AlertTriangle,
  FolderKanban,
  Calendar,
  MessageSquare,
  Paperclip,
  CheckSquare
} from 'lucide-react';
import { StatCard } from './StatCard';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { isOverdue, formatShortDate } from '../../utils/formatters';
import { getStatusStyle } from '../../utils/statusStyles';

export function EmployeeDashboard({
  currentUser,
  tasks,
  projects,
  onOpenTaskDrawer,
  onUpdateTaskProgress,
  onMoveTaskStatus,
  onReportBlocker
}) {
  const navigate = useNavigate();

  // Employee's tasks
  const myTasks = tasks.filter(t => t.assignedTo?.includes(currentUser?.id));

  // Employee's assigned projects
  const myProjects = projects.filter(p =>
    currentUser?.assignedProjects?.includes(p.id) || p.assignedEmployees?.includes(currentUser?.id)
  );

  const [activeFilter, setActiveFilter] = useState('all');

  // Quick action modal state
  const [progressModalTask, setProgressModalTask] = useState(null);
  const [progressValue, setProgressValue] = useState(50);

  const [blockerModalTask, setBlockerModalTask] = useState(null);
  const [blockerReason, setBlockerReason] = useState('');

  // Stats calculation
  const totalAssigned = myTasks.length;
  const inProgressCount = myTasks.filter(t => t.status === 'In Progress').length;
  const completedCount = myTasks.filter(t => t.status === 'Completed').length;
  const overdueCount = myTasks.filter(t => isOverdue(t.dueDate, t.status)).length;
  const blockedCount = myTasks.filter(t => t.status === 'Blocked').length;

  const filteredTasks = myTasks.filter(t => {
    if (activeFilter === 'in_progress') return t.status === 'In Progress';
    if (activeFilter === 'pending') return t.status === 'Pending';
    if (activeFilter === 'completed') return t.status === 'Completed';
    if (activeFilter === 'blocked') return t.status === 'Blocked';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Field Specialist Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Good morning, {currentUser?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            You have <span className="font-semibold text-slate-900 dark:text-white">{inProgressCount} active deliverables</span> and <span className="font-semibold text-rose-600">{overdueCount} requiring inspection</span>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={FolderKanban}
            onClick={() => navigate('/projects')}
          >
            My Projects ({myProjects.length})
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={CheckSquare}
            onClick={() => navigate('/tasks')}
          >
            Open Work Board
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Assigned Tasks"
          value={totalAssigned}
          description="Total work orders"
          icon={CheckSquare}
          variant="default"
        />
        <StatCard
          title="In Progress"
          value={inProgressCount}
          description="Active execution"
          icon={Clock}
          variant="bronze"
        />
        <StatCard
          title="Overdue Tasks"
          value={overdueCount}
          description="Target date passed"
          icon={AlertCircle}
          variant="danger"
        />
        <StatCard
          title="Completed"
          value={completedCount}
          description="Certified deliverables"
          icon={CheckCircle2}
          variant="success"
        />
      </div>

      {/* My Projects Quick Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              My Active Project Assignments
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Capital sites where you are assigned as field specialist
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {myProjects.map(proj => (
            <div
              key={proj.id}
              onClick={() => navigate(`/projects/${proj.id}`)}
              className="p-3.5 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-slate-400">{proj.code}</span>
                  <StatusBadge status={proj.status} size="xs" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {proj.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {proj.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500 dark:text-slate-400">Completion</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task List with Quick Action Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              My Assigned Deliverables
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Execute actions, update progress percentages, or report blockers
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: `All (${myTasks.length})` },
              { id: 'in_progress', label: `In Progress (${inProgressCount})` },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: `Completed (${completedCount})` },
              { id: 'blocked', label: `Blocked (${blockedCount})` }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task Items */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No tasks currently matching "{activeFilter}".
            </div>
          ) : (
            filteredTasks.map(task => {
              const overdue = isOverdue(task.dueDate, task.status);

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    task.status === 'Blocked'
                      ? 'border-rose-200 dark:border-rose-800/40 bg-rose-50/40 dark:bg-rose-950/20'
                      : overdue
                      ? 'border-amber-200 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-950/20'
                      : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Left: Task Info */}
                    <div
                      className="cursor-pointer min-w-0 flex-1"
                      onClick={() => onOpenTaskDrawer(task)}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded">
                          {task.id}
                        </span>
                        <StatusBadge status={task.status} size="xs" />
                        <PriorityBadge priority={task.priority} size="xs" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {task.projectName}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {task.title}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {task.description}
                      </p>

                      {task.blockerReason && (
                        <div className="mt-2 p-2 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-1.5 font-medium border border-rose-200 dark:border-rose-800/40">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Blocker Alert: {task.blockerReason}</span>
                        </div>
                      )}
                    </div>

                    {/* Middle: Progress Meter */}
                    <div className="w-full lg:w-48 shrink-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Progress</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getStatusStyle(task.status).progressBg}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className={`flex items-center gap-1 font-mono ${overdue ? 'text-rose-600 font-bold' : ''}`}>
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Due: {formatShortDate(task.dueDate)}
                        </span>
                        {task.comments?.length > 0 && (
                          <span className="flex items-center gap-0.5">
                            <MessageSquare className="w-3 h-3" />
                            {task.comments.length}
                          </span>
                        )}
                        {task.attachmentsCount > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Paperclip className="w-3 h-3" />
                            {task.attachmentsCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-700">
                      {task.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={Play}
                          onClick={() => onMoveTaskStatus(task.id, 'In Progress')}
                        >
                          Start
                        </Button>
                      )}

                      {task.status !== 'Completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          icon={Sliders}
                          onClick={() => {
                            setProgressModalTask(task);
                            setProgressValue(task.progress);
                          }}
                        >
                          Update %
                        </Button>
                      )}

                      {task.status !== 'Completed' && (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={CheckCircle2}
                          onClick={() => onMoveTaskStatus(task.id, 'Completed')}
                        >
                          Complete
                        </Button>
                      )}

                      {task.status !== 'Blocked' && task.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            setBlockerModalTask(task);
                            setBlockerReason('');
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Report Blocker to Lead PM"
                        >
                          Flag Blocker
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Update Progress Modal */}
      {progressModalTask && (
        <Modal
          isOpen={true}
          onClose={() => setProgressModalTask(null)}
          title={`Update Progress: ${progressModalTask.id}`}
          subtitle={progressModalTask.title}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setProgressModalTask(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onUpdateTaskProgress(progressModalTask.id, progressValue);
                  setProgressModalTask(null);
                }}
              >
                Save Progress
              </Button>
            </>
          }
        >
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Completion Ratio:</span>
              <span className="font-mono font-extrabold text-lg text-blue-600 dark:text-blue-400">{progressValue}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressValue}
              onChange={(e) => setProgressValue(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>0% (Not Started)</span>
              <span>50% (Active Execution)</span>
              <span>100% (Certified Complete)</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Report Blocker Modal */}
      {blockerModalTask && (
        <Modal
          isOpen={true}
          onClose={() => setBlockerModalTask(null)}
          title="Report Construction Blocker"
          subtitle={`Task ${blockerModalTask.id} will be placed on hold and managers notified`}
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setBlockerModalTask(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!blockerReason.trim()}
                onClick={() => {
                  onReportBlocker(blockerModalTask.id, blockerReason);
                  setBlockerModalTask(null);
                }}
              >
                Submit Blocker Notice
              </Button>
            </>
          }
        >
          <div className="space-y-3 py-2 text-xs">
            <label className="block font-semibold text-slate-800 dark:text-slate-200">
              Specify on-site obstruction or inspection delay reason:
            </label>
            <textarea
              rows={4}
              value={blockerReason}
              onChange={(e) => setBlockerReason(e.target.value)}
              placeholder="e.g. Concrete slump test failure, severe weather delay, MEP drawing clash at grid line B3..."
              className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 text-xs"
            />
            <p className="text-[11px] text-slate-400">
              Filing this notice immediately triggers a critical alert in the project management portal.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
