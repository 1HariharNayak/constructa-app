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

  // Grouped Navigation matching ERP section hierarchy
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
          exact: true
        },
        {
          to: '/board',
          label: 'Task Board',
          icon: Kanban
        },
        {
          to: '/calendar',
          label: 'Calendar',
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
          to: '/activity',
          label: 'Activity Logs',
          icon: Activity
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
          badge: unreadCount > 0 ? unreadCount : null
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
      className={`relative flex flex-col h-screen bg-slate-900 text-slate-300 transition-all duration-200 select-none z-30 shrink-0 border-r border-slate-800 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-3.5 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          {/* Emblem in Enterprise Royal Blue */}
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/20">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold tracking-tight text-sm text-white leading-none">
                CONSTRUCTA
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 font-medium uppercase mt-0.5">
                ERP Management
              </span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 min-h-0 overflow-y-auto p-2 space-y-3 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-0.5">
            {!collapsed && (
              <div className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400/80">
                {group.group}
              </div>
            )}

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to) && (item.to !== '/' || location.pathname === '/');

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs sm:text-[13px] font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  } ${collapsed ? 'justify-center p-2.5' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}
                  {item.badge && (
                    <span
                      className={`inline-flex items-center justify-center font-bold rounded-full ${
                        collapsed
                          ? 'absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500'
                          : 'px-1.5 py-0.2 text-[10px] bg-blue-500 text-white font-bold'
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
      </nav>

      {/* Sidebar Footer Controls & User Card */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-900 shrink-0 space-y-2">
        {/* Quick Utility Actions */}
        <div className={`flex items-center gap-1 ${collapsed ? 'justify-center' : 'justify-between'}`}>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDark ? "Light Mode" : "Dark Mode"}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {!collapsed && (
            <button
              onClick={() => {
                if (window.confirm('Reset demo data back to clean state?')) {
                  resetToDefaults();
                }
              }}
              className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* User Profile Card with Role Switcher */}
        <div className="relative pt-1 border-t border-slate-800">
          <div
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className={`flex items-center gap-2.5 p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 transition-colors cursor-pointer shadow-xs ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-blue-500/40"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate flex items-center justify-between">
                  <span>{currentUser?.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <RoleBadge role={currentUser?.role} />
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          {roleMenuOpen && (
            <div className="absolute bottom-14 left-0 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 flex items-center justify-between">
                <span>Switch Demo Role</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="mt-1.5 space-y-1 text-xs">
                <button
                  onClick={() => {
                    switchRole('superadmin');
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser?.roleKey === 'superadmin'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700'
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
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700'
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
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>Employee</span>
                  <span className="text-[10px] text-white/70">Field Staff</span>
                </button>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-700">
                <button
                  onClick={() => {
                    setRoleMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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

export default Sidebar;
