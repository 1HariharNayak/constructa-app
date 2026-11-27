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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Administration & Policy
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            Organization Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
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
          <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#A77B50]" />
              General Contractor & Architecture Entity Profile
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242B27]">Corporate Entity Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs font-medium text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#242B27]">GC & Engineering License #</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs font-mono font-medium text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#242B27]">Operational Regional Hubs</label>
                  <input
                    type="text"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#242B27]">Safety & Environmental Standard</label>
                  <input
                    type="text"
                    value={safetyStandard}
                    onChange={(e) => setSafetyStandard(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] text-xs text-[#242B27] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Automated Notification Rules */}
          <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#A77B50]" />
              Field Alert Routing & Dispatch Preferences
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] cursor-pointer">
                <div>
                  <span className="font-bold text-[#242B27] block">
                    Urgent Blocker Dispatch
                  </span>
                  <span className="text-[#777F79] text-[11px]">
                    Instantly broadcast notification when site superintendent or architect logs an on-site obstruction.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnBlocker}
                  onChange={(e) => setNotifyOnBlocker(e.target.checked)}
                  className="w-4 h-4 accent-[#A77B50] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] cursor-pointer">
                <div>
                  <span className="font-bold text-[#242B27] block">
                    Milestone Advancement Alerts
                  </span>
                  <span className="text-[#777F79] text-[11px]">
                    Notify project managers when foundation, framing, or building enclosure phases cross 100%.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnMilestone}
                  onChange={(e) => setNotifyOnMilestone(e.target.checked)}
                  className="w-4 h-4 accent-[#A77B50] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-lg border border-[#E7E9E3] bg-[#F6F6F2] cursor-pointer">
                <div>
                  <span className="font-bold text-[#242B27] block">
                    Task Assignment Reminders
                  </span>
                  <span className="text-[#777F79] text-[11px]">
                    Alert engineers and subcontractors upon new inspection task dispatch.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnAssignment}
                  onChange={(e) => setNotifyOnAssignment(e.target.checked)}
                  className="w-4 h-4 accent-[#A77B50] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Interface Appearance & Theme Section */}
          <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#A77B50]" />
              Interface Theme & Design System
            </h3>
            <p className="text-xs text-[#777F79] mb-4">
              Select between daytime architectural paper aesthetic or deep blueprint slate mode. Press <kbd className="px-1.5 py-0.5 bg-[#F6F6F2] border border-[#E7E9E3] rounded text-[10px] font-mono text-[#242B27]">Shift+D</kbd> anywhere to quickly toggle.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTheme('light');
                  showToast('Switched to Architectural Light theme');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-[#A77B50] bg-[#F3ECE5]/40 shadow-xs ring-1 ring-[#A77B50]'
                    : 'border-[#E7E9E3] bg-[#F6F6F2] hover:border-[#D5D8CF]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-[#A77B50]' : 'text-[#777F79]'}`} />
                  {theme === 'light' && <span className="w-2 h-2 rounded-full bg-[#A77B50]" />}
                </div>
                <div className="font-bold text-xs text-[#242B27]">Architectural Light</div>
                <div className="text-[11px] text-[#777F79] mt-0.5">Warm paper `#F6F6F2` canvas</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('dark');
                  showToast('Switched to Slate Blueprint Dark theme');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-[#A77B50] bg-[#2A342F] shadow-xs ring-1 ring-[#A77B50]'
                    : 'border-[#E7E9E3] bg-[#F6F6F2] hover:border-[#D5D8CF]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-[#C29567]' : 'text-[#777F79]'}`} />
                  {theme === 'dark' && <span className="w-2 h-2 rounded-full bg-[#C29567]" />}
                </div>
                <div className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-[#242B27]'}`}>Blueprint Dark</div>
                <div className={`text-[11px] ${theme === 'dark' ? 'text-[#9BA29C]' : 'text-[#777F79]'} mt-0.5`}>Deep graphite `#141816`</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTheme('system');
                  showToast('Theme set to follow system OS preference');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  theme === 'system'
                    ? 'border-[#A77B50] bg-[#F3ECE5]/40 shadow-xs ring-1 ring-[#A77B50]'
                    : 'border-[#E7E9E3] bg-[#F6F6F2] hover:border-[#D5D8CF]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Monitor className={`w-5 h-5 ${theme === 'system' ? 'text-[#657A6A]' : 'text-[#777F79]'}`} />
                  {theme === 'system' && <span className="w-2 h-2 rounded-full bg-[#657A6A]" />}
                </div>
                <div className="font-bold text-xs text-[#242B27]">System Auto</div>
                <div className="text-[11px] text-[#777F79] mt-0.5">Syncs with operating system</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Permissions Matrix & Demo Reset */}
        <div className="space-y-6">
          {/* Permissions Matrix */}
          <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 shadow-xs">
            <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#657A6A]" />
              Role Permissions Matrix
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3]">
                <span className="font-bold text-[#202824] block">Super Admin</span>
                <p className="text-[11px] text-[#777F79] mt-0.5">
                  Unrestricted access to all capital projects, user directory, project creations, deletions, and global system configuration.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3]">
                <span className="font-bold text-[#A77B50] block">Admin (Lead PM)</span>
                <p className="text-[11px] text-[#777F79] mt-0.5">
                  Manages assigned projects, creates work orders, schedules milestones, oversees employees, reviews deliverables.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3]">
                <span className="font-bold text-[#657A6A] block">Employee (Field Specialist)</span>
                <p className="text-[11px] text-[#777F79] mt-0.5">
                  Restricted to assigned projects and tasks. Updates task progress, marks completion, reports site blockers.
                </p>
              </div>
            </div>
          </div>

          {/* Prototype State Management */}
          <div className="bg-white rounded-xl border border-[#E7E9E3] p-6 shadow-xs border-dashed">
            <h3 className="text-xs font-bold text-[#777F79] uppercase tracking-wider mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#A77B50]" />
              Prototype Data Reset
            </h3>
            <p className="text-xs text-[#777F79] leading-relaxed mb-4">
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
