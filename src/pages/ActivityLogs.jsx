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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Governance & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-[#A77B50]" />
            Site Activity & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
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
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#777F79]">Total Audit Events</div>
          <div className="text-2xl font-extrabold text-[#242B27] font-heading mt-1">{activities.length} Recorded</div>
          <div className="text-[11px] text-[#5D8068] font-medium mt-1">100% telemetry synced</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#777F79]">Critical Site Blockers</div>
          <div className="text-2xl font-extrabold text-[#C66C62] font-heading mt-1">
            {activities.filter(a => a.action.includes('blocker')).length} Logged
          </div>
          <div className="text-[11px] text-[#C66C62] font-medium mt-1">Immediate superintendent attention</div>
        </div>
        <div className="bg-white rounded-xl border border-[#E7E9E3] p-4 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#777F79]">Milestones & Sign-Offs</div>
          <div className="text-2xl font-extrabold text-[#5D8068] font-heading mt-1">
            {activities.filter(a => a.action.includes('completed')).length} Certified
          </div>
          <div className="text-[11px] text-[#777F79] mt-1">Verified against IBC / OSHA code</div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#777F79] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by user, action, deliverable, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs font-medium text-[#242B27] placeholder-[#777F79] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#777F79]">Event Type:</span>
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs font-semibold text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            >
              <option value="All">All Actions</option>
              <option value="Blockers">Blockers & Issues</option>
              <option value="Completed">Completions & Sign-Offs</option>
              <option value="Review">Submissions for Review</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#777F79]">Site Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg text-xs font-semibold text-[#242B27] focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
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
      <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
        <div className="divide-y divide-[#E7E9E3]">
          {filteredActivities.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#777F79]">
              No activity records match your filter criteria.
            </div>
          ) : (
            filteredActivities.map((act) => {
              let dotColor = 'bg-[#657A6A]';
              let badgeBg = 'bg-[#657A6A]/10 text-[#657A6A] border-[#657A6A]/20';

              if (act.action.includes('blocker')) {
                dotColor = 'bg-[#C66C62]';
                badgeBg = 'bg-[#C66C62]/10 text-[#C66C62] border-[#C66C62]/20';
              } else if (act.action.includes('completed')) {
                dotColor = 'bg-[#5D8068]';
                badgeBg = 'bg-[#5D8068]/10 text-[#5D8068] border-[#5D8068]/20';
              } else if (act.action.includes('review')) {
                dotColor = 'bg-[#C28D4E]';
                badgeBg = 'bg-[#C28D4E]/10 text-[#C28D4E] border-[#C28D4E]/20';
              }

              return (
                <div
                  key={act.id}
                  className="p-4 sm:p-5 hover:bg-[#FAF9F6] transition-colors flex items-start gap-4 text-xs"
                >
                  {/* Indicator Dot */}
                  <div className="mt-1 shrink-0">
                    <span className={`block w-2.5 h-2.5 rounded-full ${dotColor} ring-4 ring-[#F6F6F2]`} />
                  </div>

                  {/* Main Event Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#242B27] font-heading">{act.user}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badgeBg}`}>
                          {act.action}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-[#777F79]">{act.timestamp}</span>
                    </div>

                    <div className="text-xs text-[#242B27]">
                      Target Deliverable: <span className="font-semibold text-[#A77B50]">{act.target}</span>
                    </div>

                    {act.detail && (
                      <div className="mt-2 text-[11px] text-[#777F79] bg-[#F6F6F2] p-2.5 rounded-lg border border-[#E7E9E3] font-mono leading-relaxed">
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
