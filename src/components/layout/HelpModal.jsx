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
      <div className="space-y-4 text-xs text-[#242B27]">
        <div className="p-3.5 bg-[#F6F6F2] rounded-xl border border-[#E7E9E3]">
          <h4 className="font-bold text-sm text-[#242B27] flex items-center gap-2 mb-1">
            <Building2 className="w-4 h-4 text-[#A77B50]" />
            About CONSTRUCTA Interactive Prototype
          </h4>
          <p className="leading-relaxed text-[#777F79]">
            CONSTRUCTA is an enterprise-grade Construction Project Management & Architectural Delivery System. Built for client presentation, all charts, multi-level filters, Kanban drag-and-drops, work orders, modals, and drawers are fully functional and persist state in local storage.
          </p>
        </div>

        <div>
          <h5 className="font-bold text-[#242B27] mb-2 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#657A6A]" />
            Role-Based Experiences to Showcase
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white border border-[#E7E9E3] rounded-lg">
              <span className="font-bold text-[#202824] block">Super Admin</span>
              <p className="text-[11px] text-[#777F79] mt-1">Full executive oversight: create/delete projects, manage team, edit settings.</p>
            </div>
            <div className="p-2.5 bg-white border border-[#E7E9E3] rounded-lg">
              <span className="font-bold text-[#A77B50] block">Admin (Lead PM)</span>
              <p className="text-[11px] text-[#777F79] mt-1">Project Manager: create tasks, review work, schedule milestones.</p>
            </div>
            <div className="p-2.5 bg-white border border-[#E7E9E3] rounded-lg">
              <span className="font-bold text-[#657A6A] block">Employee</span>
              <p className="text-[11px] text-[#777F79] mt-1">Field Specialist: assigned work orders, progress slider, flag blockers.</p>
            </div>
          </div>
        </div>

        <div>
          <h5 className="font-bold text-[#242B27] mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#A77B50]" />
            Key Interactive Workflows
          </h5>
          <ul className="space-y-1.5 list-disc list-inside text-[#777F79]">
            <li><strong className="text-[#242B27]">Kanban Board:</strong> Drag and drop work orders between Pending, In Progress, Under Review, Completed, and Blocked.</li>
            <li><strong className="text-[#242B27]">Task Detail Drawer:</strong> Click any work order to inspect specifications, change progress %, submit comments, and report blockers.</li>
            <li><strong className="text-[#242B27]">Project Workspace:</strong> Click into any project to toggle between Overview, Tasks, Milestones, Team, and Activity tabs.</li>
            <li><strong className="text-[#242B27]">Reporting Blocker:</strong> As an Employee or Admin, flag an issue on a task to generate an instant notification and status update.</li>
            <li><strong className="text-[#242B27]">Exporting:</strong> In Reports & Analytics, download project and task progress datasets via CSV.</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}
