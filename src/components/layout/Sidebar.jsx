import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Kanban,
  Calendar,
  Users,
  BarChart3,
  Bell,
  Settings,
  Activity,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Building2,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { RoleBadge } from '../common/Badge';

export function Sidebar({ collapsed, onToggleCollapse, onOpenHelp }) {
  const { currentUser, isEmployee, switchRole, logout } = useAuth();
  const { notifications, resetToDefaults } = useData();
  const { isDark, toggleTheme } = useTheme();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Grouped Navigation per specification
  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        {
          to: '/',
          label: 'Dashboard',
          icon: LayoutDashboard,
          exact: true
        },
        {
          to: '/projects',
          label: 'All Projects',
          icon: FolderKanban
        },
        {
          to: '/tasks',
          label: 'My Tasks',
          icon: CheckSquare,
          exact: location.pathname === '/tasks' && !location.search.includes('view=kanban')
        },
        {
          to: '/tasks?view=kanban',
          label: 'Task Board',
          icon: Kanban,
          isActiveOverride: location.pathname === '/tasks' && location.search.includes('view=kanban')
        },
        {
          to: '/milestones',
          label: 'Calendar & Roadmap',
          icon: Calendar
        }
      ]
    },
    {
      group: 'MANAGEMENT',
      items: [
        {
          to: '/team',
          label: 'Team Members',
          icon: Users
        },
        ...(!isEmployee ? [
          {
            to: '/reports',
            label: 'Task Reports',
            icon: BarChart3
          }
        ] : []),
        {
          to: '/notifications?tab=activity',
          label: 'Activity Logs',
          icon: Activity,
          isActiveOverride: location.pathname === '/notifications' && location.search.includes('tab=activity')
        }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        {
          to: '/notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : null,
          isActiveOverride: location.pathname === '/notifications' && !location.search.includes('tab=activity')
        },
        ...(!isEmployee ? [
          {
            to: '/settings',
            label: 'Settings',
            icon: Settings
          }
        ] : [])
      ]
    }
  ];

  return (
    <aside
      className={`relative flex flex-col bg-[#202824] text-[#E7E9E3] transition-all duration-200 select-none z-30 shrink-0 border-r border-[#2A342F] ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A342F]">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Architectural Emblem in Warm Bronze */}
          <div className="w-9 h-9 rounded-lg bg-[#2A352F] border border-[#A77B50]/30 text-[#A77B50] flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-extrabold tracking-wider text-base text-[#F6F6F2] leading-none">
                CONSTRUCTA
              </span>
              <span className="text-[10px] tracking-widest text-[#8E9690] font-medium uppercase mt-1">
                Project Management
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-md text-[#8E9690] hover:text-[#F6F6F2] hover:bg-[#2A342F] transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-0.5">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#636C65]">
                {group.group}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.isActiveOverride !== undefined
                ? item.isActiveOverride
                : item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to) && (item.to !== '/' || location.pathname === '/');

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#A77B50]/15 text-[#F6F6F2] font-semibold border-l-2 border-[#A77B50]'
                      : 'text-[#8E9690] hover:bg-[#2A342F] hover:text-[#F6F6F2]'
                  } ${collapsed ? 'justify-center' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-[#A77B50]' : 'text-[#777F79] group-hover:text-[#F6F6F2]'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {item.badge && (
                    <span
                      className={`inline-flex items-center justify-center font-bold rounded-full ${
                        collapsed
                          ? 'absolute top-1 right-1 w-2.5 h-2.5 bg-[#C66C62]'
                          : 'px-1.5 py-0.2 text-[10px] bg-[#A77B50] text-white'
                      }`}
                    >
                      {!collapsed && item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Utility & Profile Section */}
      <div className="p-2.5 border-t border-[#2A342F] space-y-2 bg-[#1B221E]/60">
        {/* Help & Reset Data & Theme triggers */}
        <div className="flex items-center justify-between gap-1">
          <button
            onClick={onOpenHelp}
            className={`flex items-center gap-2 p-1.5 rounded-lg text-xs font-medium text-[#8E9690] hover:text-[#F6F6F2] hover:bg-[#2A342F] transition-colors flex-1 cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
            title="System Documentation & Feature Tour"
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-[#8E9690]" />
            {!collapsed && <span>Help</span>}
          </button>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-xs text-[#8E9690] hover:text-[#A77B50] hover:bg-[#2A342F] transition-colors cursor-pointer"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-[#C29567]" /> : <Moon className="w-3.5 h-3.5 text-[#8E9690]" />}
          </button>

          {!collapsed && (
            <button
              onClick={() => {
                if (window.confirm('Reset prototype demo data back to clean state?')) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 rounded-lg text-xs text-[#8E9690] hover:text-[#A77B50] hover:bg-[#2A342F] transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* User Profile Card with Role Switcher */}
        <div className="relative pt-1 border-t border-[#2A342F]">
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`flex items-center gap-2.5 p-2 rounded-lg bg-[#252E29] border border-[#2F3A33] hover:border-[#A77B50]/40 transition-colors cursor-pointer shadow-xs ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#A77B50]/40"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[#F6F6F2] truncate flex items-center justify-between">
                  <span>{currentUser?.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#8E9690]" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <RoleBadge role={currentUser?.role} />
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Role Switcher Popup */}
          {roleMenuOpen && (
            <div className="absolute bottom-16 left-0 right-0 bg-[#252E29] border border-[#344039] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8E9690] border-b border-[#2F3A33] flex items-center justify-between">
                <span>Switch Demo Role</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#A77B50]" />
              </div>
              <div className="mt-1.5 space-y-1 text-xs">
                <button
                  onClick={() => {
                    switchRole('superadmin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser?.roleKey === 'superadmin'
                      ? 'bg-[#A77B50] text-white font-semibold'
                      : 'text-[#E7E9E3] hover:bg-[#2F3A33]'
                  }`}
                >
                  <span>Super Admin</span>
                  <span className="text-[10px] text-white/70">Full Access</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('admin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser?.roleKey === 'admin'
                      ? 'bg-[#A77B50] text-white font-semibold'
                      : 'text-[#E7E9E3] hover:bg-[#2F3A33]'
                  }`}
                >
                  <span>Admin</span>
                  <span className="text-[10px] text-white/70">Project PM</span>
                </button>
                <button
                  onClick={() => {
                    switchRole('employee');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser?.roleKey === 'employee'
                      ? 'bg-[#A77B50] text-white font-semibold'
                      : 'text-[#E7E9E3] hover:bg-[#2F3A33]'
                  }`}
                >
                  <span>Employee</span>
                  <span className="text-[10px] text-white/70">Field Staff</span>
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-[#2F3A33]">
                <button
                  onClick={() => {
                    setRoleMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-[#C66C62] hover:bg-[#C66C62]/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
