import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Image, Check } from 'lucide-react';

const COVER_IMAGE_PRESETS = [
  {
    name: 'Residential CLT Timber',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Commercial High-Rise Facade',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Infrastructure & Bridge Site',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Modern Architectural Villa',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Interior Fit-Out & Timber',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Logistics Warehouse Portal Frame',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
  }
];

export function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
  initialProject = null,
  employees = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    type: 'Commercial High-Rise',
    startDate: '2026-12-01',
    endDate: '2027-12-15',
    manager: 'Arthur Sterling',
    managerEmail: 'manager@siteflow.demo',
    status: 'In Progress',
    assignedEmployees: [],
    coverImage: COVER_IMAGE_PRESETS[0].url
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProject) {
      setFormData({
        name: initialProject.name || '',
        code: initialProject.code || '',
        description: initialProject.description || '',
        location: initialProject.location || '',
        type: initialProject.type || 'Commercial',
        startDate: initialProject.startDate || '2026-12-01',
        endDate: initialProject.endDate || '2027-12-15',
        manager: initialProject.manager || 'Arthur Sterling',
        managerEmail: initialProject.managerEmail || 'manager@siteflow.demo',
        status: initialProject.status || 'In Progress',
        assignedEmployees: initialProject.assignedEmployees || [],
        coverImage: initialProject.coverImage || COVER_IMAGE_PRESETS[0].url
      });
    } else {
      setFormData({
        name: '',
        code: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        description: '',
        location: '',
        type: 'Commercial High-Rise',
        startDate: '2026-12-01',
        endDate: '2027-12-15',
        manager: 'Arthur Sterling',
        managerEmail: 'manager@siteflow.demo',
        status: 'In Progress',
        assignedEmployees: ['emp-1', 'emp-2'],
        coverImage: COVER_IMAGE_PRESETS[0].url
      });
    }
    setErrors({});
  }, [initialProject, isOpen]);

  const toggleEmployee = (empId) => {
    setFormData(prev => {
      const exists = prev.assignedEmployees.includes(empId);
      return {
        ...prev,
        assignedEmployees: exists
          ? prev.assignedEmployees.filter(id => id !== empId)
          : [...prev.assignedEmployees, empId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.location.trim()) newErrors.location = 'Project site location is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'Target completion date is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProject ? 'Edit Construction Project' : 'Initiate New Capital Project'}
      subtitle="Define project charter, timeline parameters, and staffing assignments"
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {initialProject ? 'Save Changes' : 'Launch Project'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name & Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-[#252821]">
              Project Name <span className="text-[#C96B5D]">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Skyline Logistics Hub Phase 2"
              className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40 ${
                errors.name ? 'border-[#C96B5D]' : 'border-[#E9E7DF]'
              }`}
            />
            {errors.name && <p className="text-[11px] text-[#C96B5D]">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Project Code</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="SLH-2026"
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            />
          </div>
        </div>

        {/* Location & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">
              Site Location <span className="text-[#C96B5D]">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. 742 Industrial Parkway, Denver, CO"
              className={`w-full p-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40 ${
                errors.location ? 'border-[#C96B5D]' : 'border-[#E9E7DF]'
              }`}
            />
            {errors.location && <p className="text-[11px] text-[#C96B5D]">{errors.location}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Facility Classification</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              <option value="Commercial High-Rise">Commercial High-Rise</option>
              <option value="Residential Multi-Family">Residential Multi-Family</option>
              <option value="Civil & Infrastructure">Civil & Infrastructure</option>
              <option value="Luxury Residential">Luxury Residential</option>
              <option value="Industrial Logistics">Industrial Logistics</option>
              <option value="Interior Adaptive Reuse">Interior Adaptive Reuse</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="font-semibold text-[#252821]">Project Scope & Engineering Summary</label>
          <textarea
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Key architectural highlights, structural framing system, LEED goals..."
            className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
          />
        </div>

        {/* Timeline & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
            <label className="font-semibold text-[#252821]">Expected Completion</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white font-mono focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-[#252821]">Project Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Delayed">Delayed (Critical)</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Assign Project Manager */}
        <div className="space-y-1">
          <label className="font-semibold text-[#252821]">Assign Lead Project Manager</label>
          <select
            value={formData.manager}
            onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
            className="w-full p-2.5 rounded-lg border border-[#E9E7DF] bg-white focus:outline-none focus:ring-2 focus:ring-[#687653]/40"
          >
            <option value="Arthur Sterling">Arthur Sterling (Senior Construction PM)</option>
            <option value="Alexandra Wright">Alexandra Wright (Partner & VP Operations)</option>
          </select>
        </div>

        {/* Staff Assignment */}
        <div className="space-y-1.5">
          <label className="font-semibold text-[#252821]">
            Assign Field Staff & Engineering Leads ({formData.assignedEmployees.length} selected)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#E9E7DF] rounded-lg">
            {employees.map(emp => {
              const selected = formData.assignedEmployees.includes(emp.id);
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

        {/* Cover Photo Presets */}
        <div className="space-y-1.5">
          <label className="font-semibold text-[#252821] flex items-center gap-1.5">
            <Image className="w-3.5 h-3.5 text-[#687653]" />
            Select Architectural Cover Photography
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {COVER_IMAGE_PRESETS.map((img, idx) => {
              const isSelected = formData.coverImage === img.url;
              return (
                <div
                  key={idx}
                  onClick={() => setFormData({ ...formData, coverImage: img.url })}
                  className={`relative h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-[#687653] ring-2 ring-[#687653]/30 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  title={img.name}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#687653]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </form>
    </Modal>
  );
}
