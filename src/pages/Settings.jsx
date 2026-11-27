import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/common/Button';
import {
  Building2,
  Shield,
  Bell,
  Sliders,
  RefreshCw,
  CheckCircle2,
  Lock,
  Layers,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

export function Settings() {
  const { currentUser, isSuperAdmin } = useAuth();
  const { resetToDefaults } = useData();
  const { showToast } = useToast();
  const { theme, setTheme, isDark } = useTheme();

  const [companyName, setCompanyName] = useState('CONSTRUCTA Project Management & Architectural Design');
  const [licenseNumber, setLicenseNumber] = useState('GC-CA-9481028-A');
  const [headquarters, setHeadquarters] = useState('Austin, TX & Chicago, IL');
  const [safetyStandard, setSafetyStandard] = useState('OSHA 1926, IBC 2024 & LEED v4.1 Platinum');

  // Preferences
  const [notifyOnBlocker, setNotifyOnBlocker] = useState(true);
  const [notifyOnMilestone, setNotifyOnMilestone] = useState(true);
  const [notifyOnAssignment, setNotifyOnAssignment] = useState(true);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    showToast('Company governance settings successfully updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Administration & Policy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Organization Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure enterprise credentials, default construction milestones, safety codes, and prototype state.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={CheckCircle2}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form & Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Profile */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              General Contractor & Architecture Entity Profile
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">Corporate Entity Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">GC & Engineering License #</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs font-mono font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">Operational Regional Hubs</label>
                  <input
                    type="text"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-800 dark:text-slate-200">Safety & Environmental Standard</label>
                  <input
                    type="text"
                    value={safetyStandard}
                    onChange={(e) => setSafetyStandard(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xs text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Automated Notification Rules */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Field Alert Routing & Dispatch Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Urgent Blocker Dispatch
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Instantly broadcast notification when site superintendent or architect logs an on-site obstruction.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnBlocker}
                  onChange={(e) => setNotifyOnBlocker(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Milestone Advancement Alerts
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Notify project managers when foundation, framing, or building enclosure phases cross 100%.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnMilestone}
                  onChange={(e) => setNotifyOnMilestone(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Task Assignment Reminders
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Alert engineers and subcontractors upon new inspection task dispatch.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnAssignment}
                  onChange={(e) => setNotifyOnAssignment(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Interface Appearance & Theme Section */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sun className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Interface Theme & Design System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Select between daytime ERP clean slate mode or dark mode. Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-[10px] font-mono text-slate-800 dark:text-slate-200">Shift+D</kbd> anywhere to quickly toggle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  showToast('Switched to Vinayak ERP Light theme');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {theme === 'light' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">ERP Clean Light</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clean Slate `#f8fafc` canvas</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  showToast('Switched to ERP Slate Dark theme');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-blue-600 bg-slate-800 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-slate-400'}`} />
                  {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">ERP Slate Dark</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Deep slate `#090d16`</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  showToast('Theme set to follow system OS preference');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-xs ring-1 ring-blue-600'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Monitor className={`w-5 h-5 ${theme === 'system' ? 'text-blue-600' : 'text-slate-400'}`} />
                  {theme === 'system' && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white">System Auto</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Syncs with operating system</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Permissions Matrix & Demo Reset */}
        <div className="space-y-6">
          {/* Permissions Matrix */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Role Permissions Matrix
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-900 dark:text-white block">Super Admin</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Unrestricted access to all capital projects, user directory, project creations, deletions, and global system configuration.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-blue-600 dark:text-blue-400 block">Admin (Lead PM)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Manages assigned projects, creates work orders, schedules milestones, oversees employees, reviews deliverables.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Employee (Field Specialist)</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Restricted to assigned projects and tasks. Updates task progress, marks completion, reports site blockers.
                </p>
              </div>
            </div>
          </div>

          {/* Prototype State Management */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-6 shadow-xs border-dashed">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Prototype Data Reset
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Restores the prototype to fresh seed state with 22 capital projects, 100+ construction deliverables, 12 specialists, and complete milestone roadmaps.
            </p>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              className="w-full"
              onClick={() => {
                if (window.confirm('Reset all prototype modifications back to initial state?')) {
                  resetToDefaults();
                }
              }}
            >
              Reset Prototype Database
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
