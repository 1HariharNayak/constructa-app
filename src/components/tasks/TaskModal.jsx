import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Paperclip, Plus, X } from 'lucide-react';

export function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask = null,
  projects = [],
  milestones = [],
  employees = [],
  defaultStatus = 'Pending',
  defaultProjectId = null
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    milestoneId: '',
    assignedTo: [],
    priority: 'Medium',
    status: defaultStatus,
    startDate: '2026-11-26',
    dueDate: '2026-12-10',
    attachments: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        projectId: initialTask.projectId || (projects[0]?.id || ''),
        milestoneId: initialTask.milestoneId || '',
        assignedTo: initialTask.assignedTo || [],
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || defaultStatus,
        startDate: initialTask.startDate || '2026-11-26',
        dueDate: initialTask.dueDate || '2026-12-10',
        attachments: initialTask.attachments || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        projectId: defaultProjectId || (projects[0]?.id || ''),
        milestoneId: '',
        assignedTo: ['emp-1'],
        priority: 'Medium',
        status: defaultStatus,
        startDate: '2026-11-26',
        dueDate: '2026-12-10',
        attachments: []
      });
    }
    setErrors({});
  }, [initialTask, isOpen, defaultProjectId, defaultStatus, projects]);

  // Project's available milestones
  const availableMilestones = milestones.filter(m => m.projectId === formData.projectId);

  const toggleEmployee = (empId) => {
    setFormData(prev => {
      const exists = prev.assignedTo.includes(empId);
      return {
        ...prev,
        assignedTo: exists
          ? prev.assignedTo.filter(id => id !== empId)
          : [...prev.assignedTo, empId]
      };
    });
  };

  const handleSimulateAttachment = () => {
    const sampleFiles = [
      { name: 'Reinforcement_Structural_Detail.pdf', size: '2.1 MB', date: '2026-11-26' },
      { name: 'Concrete_Cylinder_Break_Report.pdf', size: '1.4 MB', date: '2026-11-26' },
      { name: 'Field_Site_Photo_Quadrant_B.jpg', size: '3.6 MB', date: '2026-11-26' }
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), picked]
    }));
  };

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Task title is required';
    if (!formData.projectId) newErrors.projectId = 'Project selection is required';
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedProj = projects.find(p => p.id === formData.projectId);

    onSubmit({
      ...formData,
      projectName: selectedProj ? selectedProj.name : 'Unassigned Project'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? `Edit Task: ${initialTask.id}` : 'Create Construction Work Order'}
      subtitle="Specify task deliverables, assign engineering crew, and set milestone milestone targets"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {initialTask ? 'Update Task' : 'Assign & Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div className="space-y-1">
          <label className="font-semibold text-[#252821]">
            Task Title <span className="text-[#C96B5D]">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Conduct ultrasonic weld testing on moment connections"
            className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40 ${
              errors.title ? 'border-[#C96B5D]' : 'border-[#E9E7DF]'
            }`}
          />
          {errors.title && <p className="text-[11px] text-[#C96B5D]">{errors.title}</p>}
        </div>

        {/* Project & Milestone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">
              Assigned Project <span className="text-[#C96B5D]">*</span>
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value, milestoneId: '' })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Associated Milestone</label>
            <select
              value={formData.milestoneId}
              onChange={(e) => setFormData({ ...formData, milestoneId: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              <option value="">-- General Project Milestone --</option>
              {availableMilestones.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-semibold text-[#252821]">Specification & Scope</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed testing protocols, code references, tolerance standards, or safety notes..."
            className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Priority Level</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
              <option value="Urgent">Urgent (Critical Path)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Workflow Column Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Start Date</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">
              Target Due Date <span className="text-[#C96B5D]">*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            />
          </div>
        </div>

        {/* Assign Team Members */}
        <div className="space-y-1.5">
          <label className="font-semibold text-[#252821]">
            Assign Personnel ({formData.assignedTo.length} assigned)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#E9E7DF] rounded-lg">
            {employees.map(emp => {
              const selected = formData.assignedTo.includes(emp.id);
              return (
                <div
                  key={emp.id}
                  onClick={() => toggleEmployee(emp.id)}
                  className={`p-1.5 rounded-md border flex items-center gap-2 cursor-pointer transition-colors ${
                    selected
                      ? 'border-[#687653] bg-[#EEF1E9] text-[#252821]'
                      : 'border-[#E9E7DF] bg-white hover:border-[#DDD9CF] text-[#77786F]'
                  }`}
                >
                  <img src={emp.avatar} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <span className="truncate text-[11px] font-medium">{emp.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attachments Upload Simulator */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-[#252821] flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5 text-[#687653]" />
              Drawing & Field Attachments
            </label>
            <button
              type="button"
              onClick={handleSimulateAttachment}
              className="text-[11px] font-semibold text-[#687653] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Simulate Upload</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {formData.attachments?.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-[#FAF9F6] border border-[#E9E7DF] text-[11px]"
              >
                <div className="flex items-center gap-2 truncate">
                  <Paperclip className="w-3.5 h-3.5 text-[#77786F] shrink-0" />
                  <span className="font-medium text-[#252821] truncate">{file.name}</span>
                  <span className="text-[#77786F] shrink-0 font-mono">({file.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="text-[#77786F] hover:text-[#C96B5D] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {(!formData.attachments || formData.attachments.length === 0) && (
              <div className="text-[11px] text-[#77786F] italic bg-[#FAF9F6] p-2 rounded border border-dashed border-[#DDD9CF] text-center">
                No attachments uploaded. Click "Simulate Upload" to attach drawings or test slips.
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
