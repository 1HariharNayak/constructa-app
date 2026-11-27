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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Communication & Audit Alerts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
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
      <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-x-auto text-xs">
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
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#202824] text-white shadow-xs'
                : 'text-[#777F79] hover:bg-[#F6F6F2] hover:text-[#242B27]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications in this folder"
            description="You're completely caught up on all site alerts and work orders."
          />
        ) : (
          <div className="divide-y divide-[#E7E9E3]">
            {filtered.map(notif => {
              let Icon = Bell;
              let iconBg = 'bg-[#F6F6F2] text-[#777F79]';
              if (notif.type === 'blocker') {
                Icon = AlertTriangle;
                iconBg = 'bg-[#C66C62]/10 text-[#C66C62]';
              } else if (notif.type === 'completed') {
                Icon = CheckCircle2;
                iconBg = 'bg-[#5D8068]/10 text-[#5D8068]';
              } else if (notif.type === 'review') {
                Icon = FileCheck;
                iconBg = 'bg-[#C28D4E]/10 text-[#C28D4E]';
              } else if (notif.type === 'deadline' || notif.type === 'overdue') {
                Icon = Clock;
                iconBg = 'bg-[#A77B50]/10 text-[#A77B50]';
              } else if (notif.type === 'milestone') {
                Icon = Flag;
                iconBg = 'bg-[#657A6A]/10 text-[#657A6A]';
              }

              return (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-[#F6F6F2] ${
                    !notif.read ? 'bg-[#F6F6F2]/60' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-[#E7E9E3]/40 ${iconBg}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#242B27] truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#C66C62] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#242B27] mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-[#777F79]">
                        <span className="font-mono">{notif.timestamp}</span>
                        {notif.taskId && (
                          <span className="bg-[#F6F6F2] border border-[#E7E9E3] px-1.5 py-0.2 rounded font-mono font-bold text-[#242B27]">
                            {notif.taskId}
                          </span>
                        )}
                        {notif.projectId && (
                          <span className="hover:text-[#A77B50] underline">
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
                      className="text-xs text-[#A77B50] hover:underline shrink-0 font-semibold cursor-pointer"
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
