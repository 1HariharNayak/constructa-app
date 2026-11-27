import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import {
  Download,
  Printer,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/common/Badge';
import { exportProjectsToCSV, exportTasksToCSV } from '../utils/exportUtils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export function Reports() {
  const { projects, tasks, milestones, employees } = useData();
  const { isDark } = useTheme();

  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedRange, setSelectedRange] = useState('Quarter 4 (Current)');

  const chartGrid = isDark ? '#334155' : '#E2E8F0';
  const chartText = isDark ? '#94A3B8' : '#64748B';

  // Filter tasks if project selected
  const displayProjects = selectedProject === 'All'
    ? projects
    : projects.filter(p => p.id === selectedProject);

  const displayTasks = selectedProject === 'All'
    ? tasks
    : tasks.filter(t => t.projectId === selectedProject);

  // Stats
  const totalTasks = displayTasks.length;
  const completedTasks = displayTasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = displayTasks.filter(t => t.status === 'In Progress').length;
  const blockedTasks = displayTasks.filter(t => t.status === 'Blocked').length;
  const avgProgress = displayProjects.length > 0
    ? Math.round(displayProjects.reduce((acc, p) => acc + p.progress, 0) / displayProjects.length)
    : 0;

  // Chart data: Project-wise comparison
  const projectComparisonData = displayProjects.map(p => ({
    name: p.code,
    fullName: p.name,
    progress: p.progress,
    tasksCount: tasks.filter(t => t.projectId === p.id).length
  }));

  // Chart data: Employee performance
  const employeePerformanceData = employees.slice(0, 6).map(e => {
    const empTasks = tasks.filter(t => t.assignedTo?.includes(e.id));
    const done = empTasks.filter(t => t.status === 'Completed').length;
    return {
      name: e.name.split(' ')[0],
      fullName: e.name,
      role: e.role,
      completed: done,
      active: empTasks.length - done,
      total: empTasks.length
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Project Governance & Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Reports & Engineering Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structural velocity, task completion throughput, and field milestone progress auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => exportProjectsToCSV(projects, tasks)}
          >
            Export Projects CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={() => exportTasksToCSV(tasks, projects)}
          >
            Export Tasks CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Filter Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Portfolio Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Date Range:</span>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="p-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Quarter 4 (Current)">Quarter 4 (Current)</option>
              <option value="Quarter 3 (Q3 2026)">Quarter 3 (Q3 2026)</option>
              <option value="Year-to-Date 2026">Year-to-Date 2026</option>
              <option value="Full Project Lifecycle">Full Project Lifecycle</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Report Generated: <strong>Nov 26, 2026</strong>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 border-t-2 border-t-blue-600 p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400">Portfolio Average Completion</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgProgress}%</div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">Across active construction sites</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 border-t-2 border-t-emerald-500 p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400">Deliverable Throughput</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks}/{totalTasks}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{Math.round((completedTasks/totalTasks)*100)}% certified complete</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 border-t-2 border-t-blue-500 p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400">Active in Field</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{inProgressTasks}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Under inspection or assembly</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 border-t-2 border-t-rose-500 p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-slate-400">Active Delays / Blockers</span>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{blockedTasks}</div>
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">Requiring supervisor clearance</p>
        </div>
      </div>

      {/* Charts Row 1: Project Progress Comparison & Employee Workload Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Comparison */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Project Completion Progress Comparison
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Current structural stage completion ratio (%) by project code
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: chartText, fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md text-xs">
                          <div className="font-bold text-slate-900 dark:text-white">{item.fullName}</div>
                          <div className="text-blue-600 dark:text-blue-400 font-bold mt-1">
                            Progress: {item.progress}%
                          </div>
                          <div className="text-slate-500 dark:text-slate-400">
                            Total Deliverables: {item.tasksCount}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="progress" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Output & Workload Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Specialist Deliverable Throughput
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Completed deliverables vs active work assignments per engineer
              </p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={employeePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGrid} />
                <XAxis dataKey="name" tick={{ fill: chartText, fontSize: 11 }} />
                <YAxis tick={{ fill: chartText, fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1">
                          <div className="font-bold text-slate-900 dark:text-white">{item.fullName}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.role}</div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-bold">Completed: {item.completed}</div>
                          <div className="text-blue-600 dark:text-blue-400 font-medium">Active: {item.active}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={30} />
                <Bar dataKey="active" name="In Progress" fill="#2563EB" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestone Completion Status Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Detailed Milestone Completion Audit Table
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            {milestones.length} Active Milestones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
              {milestones.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {m.projectName}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {m.startDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 dark:text-slate-400">
                    {m.targetDate}
                  </td>
                  <td className="py-3 px-4 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">{m.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={m.status} size="xs" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
