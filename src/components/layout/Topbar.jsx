import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Plus,
  FolderPlus,
  CheckSquare,
  Flag,
  UserPlus
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { RoleBadge } from '../common/Badge';

export function Topbar({ onToggleMobileSidebar, onOpenSearch, onOpenNewProject, onOpenNewTask }) {
  const { currentUser, switchRole, logout, isEmployee } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const navigate = useNavigate();

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const quickRef = useRef(null);

  const unreadNotifications = notifications.filter(n => !n.read);
  const recentNotifications = notifications.slice(0, 5);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target)) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date('2026-11-26'));

  return (
    <header className="h-16 bg-white border-b border-[#E7E9E3] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Mobile Sidebar Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-[#777F79] hover:bg-[#F6F6F2] hover:text-[#242B27] transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Global Search shortcut button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3] text-xs text-[#777F79] hover:text-[#242B27] hover:border-[#D5D8CF] shadow-xs transition-all cursor-pointer"
          title="Search projects, tasks, or drawings (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#657A6A]" />
          <span className="hidden md:inline font-medium">Search...</span>
          <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white text-[#777F79] border border-[#E7E9E3] rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F6F6F2] text-xs font-medium text-[#777F79] border border-[#E7E9E3]">
          <Calendar className="w-3.5 h-3.5 text-[#A77B50]" />
          <span>{todayStr}</span>
        </div>

        {/* Quick-Create Action Dropdown */}
        <div className="relative" ref={quickRef}>
          <button
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#A77B50] text-white hover:bg-[#956C43] text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>

          {quickCreateOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E7E9E3] rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <button
                onClick={() => {
                  setQuickCreateOpen(false);
                  navigate('/projects?action=new');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#242B27] hover:bg-[#F6F6F2] hover:text-[#A77B50] rounded-lg transition-colors text-left"
              >
                <FolderPlus className="w-4 h-4 text-[#A77B50]" />
                <span>New Project</span>
              </button>
              <button
                onClick={() => {
                  setQuickCreateOpen(false);
                  navigate('/tasks?action=new');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#242B27] hover:bg-[#F6F6F2] hover:text-[#657A6A] rounded-lg transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-[#657A6A]" />
                <span>New Work Order</span>
              </button>
              <button
                onClick={() => {
                  setQuickCreateOpen(false);
                  navigate('/milestones');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#242B27] hover:bg-[#F6F6F2] hover:text-[#C28D4E] rounded-lg transition-colors text-left"
              >
                <Flag className="w-4 h-4 text-[#C28D4E]" />
                <span>New Milestone</span>
              </button>
              <button
                onClick={() => {
                  setQuickCreateOpen(false);
                  navigate('/team');
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#242B27] hover:bg-[#F6F6F2] hover:text-[#718B9A] rounded-lg transition-colors text-left"
              >
                <UserPlus className="w-4 h-4 text-[#718B9A]" />
                <span>Add Team Member</span>
              </button>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Tabs */}
        <div className="hidden sm:flex items-center gap-1 bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg p-0.5 shadow-2xs">
          <button
            onClick={() => switchRole('superadmin')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              currentUser?.roleKey === 'superadmin'
                ? 'bg-[#202824] text-white shadow-xs'
                : 'text-[#777F79] hover:text-[#242B27]'
            }`}
            title="Preview Super Admin workspace"
          >
            Super Admin
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              currentUser?.roleKey === 'admin'
                ? 'bg-[#A77B50] text-white shadow-xs'
                : 'text-[#777F79] hover:text-[#242B27]'
            }`}
            title="Preview Admin PM workspace"
          >
            Admin
          </button>
          <button
            onClick={() => switchRole('employee')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
              currentUser?.roleKey === 'employee'
                ? 'bg-[#657A6A] text-white shadow-xs'
                : 'text-[#777F79] hover:text-[#242B27]'
            }`}
            title="Preview Field Specialist workspace"
          >
            Employee
          </button>
        </div>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-lg text-[#777F79] hover:text-[#242B27] hover:bg-[#F6F6F2] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C66C62] ring-2 ring-white" />
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E7E9E3] rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between p-3.5 border-b border-[#E7E9E3] bg-[#F6F6F2]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#242B27]">
                    Notifications
                  </h4>
                  {unreadNotifications.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#C66C62] text-white">
                      {unreadNotifications.length}
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-[#A77B50] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-[#E7E9E3]">
                {recentNotifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.taskId) navigate(`/tasks?taskId=${n.taskId}`);
                      else if (n.projectId) navigate(`/projects/${n.projectId}`);
                      setNotifDropdownOpen(false);
                    }}
                    className={`p-3 text-left hover:bg-[#F6F6F2] transition-colors cursor-pointer ${
                      !n.read ? 'bg-[#F6F6F2]/50 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#242B27] truncate">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-[#777F79] shrink-0 font-mono">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#777F79] mt-1 line-clamp-2">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#F6F6F2] border-t border-[#E7E9E3] text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-[#A77B50] hover:underline cursor-pointer"
                >
                  View all activity logs →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-[#F6F6F2] transition-colors cursor-pointer"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E7E9E3]"
            />
            <div className="hidden xl:block text-left text-xs">
              <div className="font-semibold text-[#242B27] leading-tight">
                {currentUser?.name}
              </div>
              <div className="text-[10px] text-[#777F79]">
                {currentUser?.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#777F79]" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E9E3] rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2.5 border-b border-[#E7E9E3] bg-[#F6F6F2] rounded-lg mb-1">
                <div className="text-xs font-semibold text-[#242B27]">{currentUser?.name}</div>
                <div className="text-[11px] text-[#777F79] truncate">{currentUser?.email}</div>
                <div className="mt-1.5">
                  <RoleBadge role={currentUser?.role} />
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/team');
                    setUserDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#242B27] hover:bg-[#F6F6F2] rounded-md transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#657A6A]" />
                  <span>Team Directory</span>
                </button>

                {!isEmployee && (
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#242B27] hover:bg-[#F6F6F2] rounded-md transition-colors cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#A77B50]" />
                    <span>Project Governance</span>
                  </button>
                )}
              </div>

              <div className="pt-1 border-t border-[#E7E9E3]">
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs text-[#C66C62] hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
