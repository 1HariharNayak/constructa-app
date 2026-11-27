import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Shield, Sparkles, CheckCircle, RefreshCw, KeyRound, Layers, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function HelpModal({ isOpen, onClose }) {
  const { resetToDefaults } = useData();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CONSTRUCTA Prototype Demonstration Guide"
      subtitle="Interactive client presentation features & architectural workflow"
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={() => {
              resetToDefaults();
              onClose();
            }}
          >
            Reset Sample Data
          </Button>
          <Button onClick={onClose} size="sm" variant="primary">
            Explore System
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200 dark:border-slate-700">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            About CONSTRUCTA Interactive Prototype
          </h4>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400">
            CONSTRUCTA is an enterprise-grade Construction Project Management & Architectural Delivery System. Built for client presentation, all charts, multi-level filters, Kanban drag-and-drops, work orders, modals, and drawers are fully functional and persist state in local storage.
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Role-Based Experiences to Showcase
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <span className="font-semibold text-slate-900 dark:text-white block">Super Admin</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Full executive oversight: create/delete projects, manage team, edit settings.</p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <span className="font-semibold text-blue-600 dark:text-blue-400 block">Admin (Lead PM)</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Project Manager: create tasks, review work, schedule milestones.</p>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 block">Employee</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Field Specialist: assigned work orders, progress slider, flag blockers.</p>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Key Interactive Workflows
          </h5>
          <ul className="space-y-1.5 list-disc list-inside text-slate-600 dark:text-slate-400">
            <li><strong className="text-slate-900 dark:text-white">Kanban Board:</strong> Drag and drop work orders between Pending, In Progress, Under Review, Completed, and Blocked.</li>
            <li><strong className="text-slate-900 dark:text-white">Task Detail Drawer:</strong> Click any work order to inspect specifications, change progress %, submit comments, and report blockers.</li>
            <li><strong className="text-slate-900 dark:text-white">Project Workspace:</strong> Click into any project to toggle between Overview, Tasks, Milestones, Team, and Activity tabs.</li>
            <li><strong className="text-slate-900 dark:text-white">Reporting Blocker:</strong> As an Employee or Admin, flag an issue on a task to generate an instant notification and status update.</li>
            <li><strong className="text-slate-900 dark:text-white">Exporting:</strong> In Reports & Analytics, download project and task progress datasets via CSV.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
