import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flag,
  FileCheck,
  CheckSquare,
  ShieldAlert,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';

export function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unread' | 'blocker' | 'deadline' | 'completed'

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      if (activeTab === 'unread') return !n.read;
      if (activeTab === 'blocker') return n.type === 'blocker';
      if (activeTab === 'deadline') return n.type === 'deadline' || n.type === 'overdue';
      if (activeTab === 'completed') return n.type === 'completed';
      return true;
    });
  }, [notifications, activeTab]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.taskId) {
      navigate(`/tasks?taskId=${notif.taskId}`);
    } else if (notif.projectId) {
      navigate(`/projects/${notif.projectId}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Communication & Audit Alerts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time feed of task assignments, impending deadlines, milestone advancements, and critical blockers.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCircle2}
            onClick={markAllNotificationsRead}
          >
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-x-auto text-xs">
        {[
          { id: 'all', label: `All Alerts (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'blocker', label: 'Blockers & Delays' },
          { id: 'deadline', label: 'Deadlines & Overdue' },
          { id: 'completed', label: 'Milestones & Signoffs' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications in this folder"
            description="You're completely caught up on all site alerts and work orders."
          />
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
            {filtered.map(notif => {
              let Icon = Bell;
              let iconBg = 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400';
              if (notif.type === 'blocker') {
                Icon = AlertTriangle;
                iconBg = 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40';
              } else if (notif.type === 'completed') {
                Icon = CheckCircle2;
                iconBg = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40';
              } else if (notif.type === 'review') {
                Icon = FileCheck;
                iconBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40';
              } else if (notif.type === 'deadline' || notif.type === 'overdue') {
                Icon = Clock;
                iconBg = 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40';
              } else if (notif.type === 'milestone') {
                Icon = Flag;
                iconBg = 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                    !notif.read ? 'bg-blue-50/30 dark:bg-blue-950/20' : 'bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                        <span className="font-mono">{notif.timestamp}</span>
                        {notif.taskId && (
                          <span className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-1.5 py-0.2 rounded font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {notif.taskId}
                          </span>
                        )}
                        {notif.projectId && (
                          <span className="hover:text-blue-600 dark:hover:text-blue-400 underline">
                            View Workspace →
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!notif.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(notif.id);
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0 font-medium cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
