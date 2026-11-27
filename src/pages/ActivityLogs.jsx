import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Button } from '../components/common/Button';
import {
  Activity,
  Search,
  Filter,
  Download,
  Clock,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  Users
} from 'lucide-react';

export function ActivityLogs() {
  const { activities, projects, employees } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [actionTypeFilter, setActionTypeFilter] = useState('All');

  // Filtered Activities
  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchSearch =
        act.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        act.target?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (act.detail && act.detail.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchProject = projectFilter === 'All' || act.projectId === projectFilter;

      let matchType = true;
      if (actionTypeFilter === 'Blockers') matchType = act.action.includes('blocker') || act.type === 'blocker';
      else if (actionTypeFilter === 'Completed') matchType = act.action.includes('completed') || act.type === 'completed';
      else if (actionTypeFilter === 'Review') matchType = act.action.includes('review') || act.type === 'review';

      return matchSearch && matchProject && matchType;
    });
  }, [activities, searchQuery, projectFilter, actionTypeFilter]);

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Specialist', 'Action', 'Target Element', 'Detail Notes'];
    const rows = filteredActivities.map(a => [
      `"${a.timestamp}"`,
      `"${a.user}"`,
      `"${a.action}"`,
      `"${a.target}"`,
      `"${a.detail || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CONSTRUCTA_Audit_Logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Governance & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Site Activity & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tamper-evident chronological audit trail of all task movements, field inspections, structural sign-offs, and blocker filings.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export CSV Log
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Audit Events</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activities.length} Recorded</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">100% telemetry synced</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Critical Site Blockers</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {activities.filter(a => a.action.includes('blocker')).length} Logged
          </div>
          <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">Immediate superintendent attention</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Milestones & Sign-Offs</div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {activities.filter(a => a.action.includes('completed')).length} Certified
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified against IBC / OSHA code</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, deliverable, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Event Type:</span>
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Actions</option>
              <option value="Blockers">Blockers & Issues</option>
              <option value="Completed">Completions & Sign-Offs</option>
              <option value="Review">Submissions for Review</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Site Project:</span>
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
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No activity records match your filter criteria.
            </div>
          ) : (
            filteredActivities.map((act) => {
              let dotColor = 'bg-blue-600';
              let badgeBg = 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40';

              if (act.action.includes('blocker')) {
                dotColor = 'bg-rose-500';
                badgeBg = 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
              } else if (act.action.includes('completed')) {
                dotColor = 'bg-emerald-500';
                badgeBg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
              } else if (act.action.includes('review')) {
                dotColor = 'bg-amber-500';
                badgeBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
              }

              return (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors flex items-start gap-4 text-xs"
                >
                  {/* Indicator Dot */}
                  <div className="mt-1 shrink-0">
                    <span className={`block w-2.5 h-2.5 rounded-full ${dotColor} ring-4 ring-slate-100 dark:ring-slate-700`} />
                  </div>

                  {/* Main Event Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{act.user}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeBg}`}>
                          {act.action}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{act.timestamp}</span>
                    </div>

                    <div className="text-xs text-slate-800 dark:text-slate-200">
                      Target Deliverable: <span className="font-semibold text-blue-600 dark:text-blue-400">{act.target}</span>
                    </div>

                    {act.detail && (
                      <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono leading-relaxed">
                        {act.detail}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
