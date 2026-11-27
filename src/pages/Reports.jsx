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

  const chartGrid = isDark ? '#2A332E' : '#E7E9E3';
  const chartText = isDark ? '#9BA29C' : '#777F79';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Project Governance & Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            Reports & Engineering Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
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
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#777F79] font-medium">Filter Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs text-[#242B27] font-semibold focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            >
              <option value="All">All Portfolio Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#777F79] font-medium">Date Range:</span>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="p-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs text-[#242B27] font-semibold focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            >
              <option value="Quarter 4 (Current)">Quarter 4 (Current)</option>
              <option value="Quarter 3 (Q3 2026)">Quarter 3 (Q3 2026)</option>
              <option value="Year-to-Date 2026">Year-to-Date 2026</option>
              <option value="Full Project Lifecycle">Full Project Lifecycle</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[#777F79] font-mono">
          Report Generated: <strong>Nov 26, 2026</strong>
        </div>
      </div>

      {/* KPI Overview Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E7E9E3] border-t-2 border-t-[#A77B50] p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-[#777F79]">Portfolio Average Completion</span>
          <div className="text-2xl font-extrabold text-[#242B27] font-heading mt-1">{avgProgress}%</div>
          <p className="text-[11px] text-[#A77B50] font-medium mt-1">Across active construction sites</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E7E9E3] border-t-2 border-t-[#5D8068] p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-[#777F79]">Deliverable Throughput</span>
          <div className="text-2xl font-extrabold text-[#5D8068] font-heading mt-1">{completedTasks}/{totalTasks}</div>
          <p className="text-[11px] text-[#777F79] mt-1">{Math.round((completedTasks/totalTasks)*100)}% certified complete</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E7E9E3] border-t-2 border-t-[#657A6A] p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-[#777F79]">Active in Field</span>
          <div className="text-2xl font-extrabold text-[#242B27] font-heading mt-1">{inProgressTasks}</div>
          <p className="text-[11px] text-[#777F79] mt-1">Under inspection or assembly</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E7E9E3] border-t-2 border-t-[#C66C62] p-4 shadow-xs">
          <span className="text-[11px] uppercase font-bold text-[#777F79]">Active Delays / Blockers</span>
          <div className="text-2xl font-extrabold text-[#C66C62] font-heading mt-1">{blockedTasks}</div>
          <p className="text-[11px] text-[#C66C62] font-medium mt-1">Requiring supervisor clearance</p>
        </div>
      </div>

      {/* Charts Row 1: Project Progress Comparison & Employee Workload Throughput */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Comparison */}
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
                Project Completion Progress Comparison
              </h3>
              <p className="text-xs text-[#777F79] mt-0.5">
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
                        <div className="bg-white p-3 rounded-lg border border-[#E7E9E3] shadow-md text-xs">
                          <div className="font-bold text-[#242B27]">{item.fullName}</div>
                          <div className="text-[#A77B50] font-bold mt-1">
                            Progress: {item.progress}%
                          </div>
                          <div className="text-[#777F79]">
                            Total Deliverables: {item.tasksCount}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="progress" fill="#A77B50" radius={[4, 4, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Output & Workload Distribution */}
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
                Specialist Deliverable Throughput
              </h3>
              <p className="text-xs text-[#777F79] mt-0.5">
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
                        <div className="bg-white p-3 rounded-lg border border-[#E7E9E3] shadow-md text-xs space-y-1">
                          <div className="font-bold text-[#242B27]">{item.fullName}</div>
                          <div className="text-[11px] text-[#777F79]">{item.role}</div>
                          <div className="text-[#5D8068] font-bold">Completed: {item.completed}</div>
                          <div className="text-[#A77B50] font-medium">Active: {item.active}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#5D8068" stackId="a" radius={[0, 0, 0, 0]} maxBarSize={30} />
                <Bar dataKey="active" name="In Progress" fill="#A77B50" stackId="a" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Milestone Completion Status Table */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E7E9E3] bg-[#F6F6F2] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#242B27]">
            Detailed Milestone Completion Audit Table
          </h3>
          <span className="text-xs text-[#777F79] font-mono">
            {milestones.length} Active Milestones
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6F6F2] border-b border-[#E7E9E3] text-[#777F79] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Milestone</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Start Date</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E9E3]">
              {milestones.map(m => (
                <tr key={m.id} className="hover:bg-[#F6F6F2]">
                  <td className="py-3 px-4 font-bold text-[#242B27]">
                    {m.name}
                  </td>
                  <td className="py-3 px-4 text-[#777F79]">
                    {m.projectName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#777F79]">
                    {m.startDate}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#777F79]">
                    {m.targetDate}
                  </td>
                  <td className="py-3 px-4 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E7E9E3] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#A77B50] h-full rounded-full"
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#242B27]">{m.progress}%</span>
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
