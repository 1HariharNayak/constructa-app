import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function MilestoneModal({
  isOpen,
  onClose,
  onSubmit,
  initialMilestone = null,
  projects = [],
  defaultProjectId = null
}) {
  const [formData, setFormData] = useState({
    name: 'Foundation',
    projectId: defaultProjectId || (projects[0]?.id || ''),
    description: '',
    startDate: '2026-11-26',
    targetDate: '2027-02-15',
    status: 'In Progress',
    progress: 25
  });

  const [errors, setErrors] = useState({});

  const COMMON_MILESTONE_PRESETS = [
    'Site Preparation & Mass Excavation',
    'Deep Foundation & Piles',
    'Structural Concrete Podium',
    'Structural Steel & CLT Framing',
    'Building Enclosure & Curtain Wall Glazing',
    'Brickwork & Architectural Masonry',
    'Electrical & Power Distribution Rough-Ins',
    'Plumbing & Fire Suppression Rough-Ins',
    'Interior Millwork & Drywall Finishing',
    'Architectural Painting & Coatings',
    'Commissioning & Building Automation Testing',
    'Final Inspection & Certificate of Occupancy'
  ];

  useEffect(() => {
    if (initialMilestone) {
      setFormData({
        name: initialMilestone.name || '',
        projectId: initialMilestone.projectId || (projects[0]?.id || ''),
        description: initialMilestone.description || '',
        startDate: initialMilestone.startDate || '2026-11-26',
        targetDate: initialMilestone.targetDate || '2027-02-15',
        status: initialMilestone.status || 'In Progress',
        progress: initialMilestone.progress || 0
      });
    } else {
      setFormData({
        name: 'Structural Framing',
        projectId: defaultProjectId || (projects[0]?.id || ''),
        description: '',
        startDate: '2026-11-26',
        targetDate: '2027-02-15',
        status: 'In Progress',
        progress: 10
      });
    }
    setErrors({});
  }, [initialMilestone, isOpen, defaultProjectId, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Milestone name is required';
    if (!formData.projectId) newErrors.projectId = 'Project is required';
    if (!formData.targetDate) newErrors.targetDate = 'Target date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const proj = projects.find(p => p.id === formData.projectId);

    onSubmit({
      ...formData,
      projectName: proj ? proj.name : ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialMilestone ? 'Edit Construction Milestone' : 'Add Critical Milestone'}
      subtitle="Establish major building phase deadlines and deliverables"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {initialMilestone ? 'Save Milestone' : 'Create Milestone'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name with presets */}
        <div className="space-y-1">
          <label className="font-semibold text-[#242B27]">
            Milestone Title <span className="text-[#C66C62]">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Deep Foundation & Pile Caps"
            className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50] ${
              errors.name ? 'border-[#C66C62]' : 'border-[#E7E9E3]'
            }`}
          />
          {errors.name && <p className="text-[11px] text-[#C66C62]">{errors.name}</p>}

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px]">
            <span className="text-[#777F79] shrink-0 font-medium">Quick Presets:</span>
            {COMMON_MILESTONE_PRESETS.slice(0, 4).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, name: preset })}
                className="px-2 py-0.5 rounded bg-[#F6F6F2] text-[#242B27] hover:bg-[#E7E9E3] shrink-0 transition-colors cursor-pointer"
              >
                {preset.split('&')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Project */}
        <div className="space-y-1">
          <label className="font-semibold text-[#242B27]">
            Project Assignment <span className="text-[#C66C62]">*</span>
          </label>
          <select
            value={formData.projectId}
            onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-semibold text-[#242B27]">Milestone Deliverables & Criteria</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Specify third-party inspection signoffs, structural tolerances, or signoff criteria..."
            className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#242B27]">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white font-mono focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#242B27]">Target Completion Date</label>
            <input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white font-mono focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            />
          </div>
        </div>

        {/* Status & Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#242B27]">Status</label>
            <select
              value={formData.status}
              onChange={(e) => {
                const st = e.target.value;
                let p = formData.progress;
                if (st === 'Completed') p = 100;
                setFormData({ ...formData, status: st, progress: p });
              }}
              className="w-full p-2.5 rounded-lg border border-[#E7E9E3] bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="font-semibold text-[#242B27]">Completion Ratio</label>
              <span className="font-mono font-bold text-[#A77B50]">{formData.progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              className="w-full accent-[#A77B50] cursor-pointer mt-2"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
