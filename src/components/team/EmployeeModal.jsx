import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export function EmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  initialEmployee = null,
  projects = []
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Lead Structural Engineer',
    department: 'Engineering',
    phone: '',
    capacity: 70,
    status: 'Active',
    assignedProjects: [],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
    bio: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialEmployee) {
      setFormData({
        name: initialEmployee.name || '',
        email: initialEmployee.email || '',
        role: initialEmployee.role || 'Lead Structural Engineer',
        department: initialEmployee.department || 'Engineering',
        phone: initialEmployee.phone || '',
        capacity: initialEmployee.capacity || 70,
        status: initialEmployee.status || 'Active',
        assignedProjects: initialEmployee.assignedProjects || [],
        avatar: initialEmployee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces',
        bio: initialEmployee.bio || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Site Safety Officer',
        department: 'Safety & Compliance',
        phone: '+1 (555) 789-0123',
        capacity: 65,
        status: 'Active',
        assignedProjects: [projects[0]?.id || 'proj-1'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
        bio: ''
      });
    }
    setErrors({});
  }, [initialEmployee, isOpen, projects]);

  const toggleProject = (projectId) => {
    setFormData(prev => {
      const exists = prev.assignedProjects.includes(projectId);
      return {
        ...prev,
        assignedProjects: exists
          ? prev.assignedProjects.filter(id => id !== projectId)
          : [...prev.assignedProjects, projectId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Corporate email is required';

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
      title={initialEmployee ? 'Edit Specialist Profile' : 'Onboard Engineering / Field Specialist'}
      subtitle="Register team personnel and assign initial construction projects"
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {initialEmployee ? 'Save Profile' : 'Add to Directory'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Gabriel Montgomery, PE"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                errors.name ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">
              Corporate Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="g.montgomery@constructa.demo"
              className={`w-full p-2.5 rounded-lg border bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 ${
                errors.email ? 'border-rose-400' : 'border-slate-200 dark:border-slate-600'
              }`}
            />
            {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
          </div>
        </div>

        {/* Role & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Designation / Job Title</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Lead Geotechnical Engineer"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Engineering">Engineering</option>
              <option value="Architecture & Design">Architecture & Design</option>
              <option value="Safety & Compliance">Safety & Compliance</option>
              <option value="Field Operations">Field Operations</option>
              <option value="Mechanical/Electrical">Mechanical/Electrical (MEP)</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Interiors">Interiors</option>
              <option value="Procurement">Procurement</option>
            </select>
          </div>
        </div>

        {/* Phone & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Direct Contact Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-800 dark:text-slate-200">Operational Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="Active">Active in Office</option>
              <option value="On Site">Deployed On Site</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Assign Projects */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-800 dark:text-slate-200">
            Assign Active Projects ({formData.assignedProjects.length} selected)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg">
            {projects.map(proj => {
              const selected = formData.assignedProjects.includes(proj.id);
              return (
                <div
                  key={proj.id}
                  onClick={() => toggleProject(proj.id)}
                  className={`p-2 rounded-md border flex items-center justify-between cursor-pointer transition-colors ${
                    selected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="font-medium truncate text-xs">{proj.name}</span>
                  <span className="font-mono text-[10px] uppercase font-bold">{proj.code}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-800 dark:text-slate-200">Professional Bio & Certifications</label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Certifications (OSHA 30, PE, LEED AP), years of structural experience..."
            className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </form>
    </Modal>
  );
}

export function EmployeeDetailModal({
  isOpen,
  onClose,
  employee,
  tasks = [],
  projects = [],
  onOpenTask
}) {
  if (!employee) return null;

  const empTasks = tasks.filter(t => t.assignedTo?.includes(employee.id));
  const assignedProjectsList = projects.filter(p =>
    employee.assignedProjects?.includes(p.id) || p.assignedEmployees?.includes(employee.id)
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee.name}
      subtitle={`${employee.role} • ${employee.department}`}
      maxWidth="max-w-2xl"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Close Profile
        </Button>
      }
    >
      <div className="space-y-5 text-xs text-slate-900 dark:text-slate-100">
        {/* Profile Card Header */}
        <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-600 shrink-0"
          />
          <div className="space-y-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{employee.name}</h4>
            <div className="text-xs text-slate-500 dark:text-slate-400">{employee.role}</div>
            <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 pt-1">
              <span>{employee.email}</span>
              <span>•</span>
              <span className="font-mono">{employee.phone}</span>
            </div>
            {employee.bio && (
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700 leading-relaxed">
                {employee.bio}
              </p>
            )}
          </div>
        </div>

        {/* Assigned Projects */}
        <div>
          <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Assigned Projects ({assignedProjectsList.length})
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assignedProjectsList.map(p => (
              <div key={p.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="font-bold text-slate-900 dark:text-white truncate">{p.name}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{p.location}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">Status: {p.status}</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assigned Tasks */}
        <div>
          <h5 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-2">
            Work Orders & Assigned Deliverables ({empTasks.length})
          </h5>
          <div className="space-y-2 max-h-56 overflow-y-auto custom-scrollbar">
            {empTasks.map(t => (
              <div
                key={t.id}
                onClick={() => {
                  onClose();
                  if (onOpenTask) onOpenTask(t);
                }}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{t.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                    {t.id} • {t.projectName}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{t.progress}%</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
