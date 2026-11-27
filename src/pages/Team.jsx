import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { EmployeeCard } from '../components/team/EmployeeCard';
import { EmployeeModal, EmployeeDetailModal } from '../components/team/EmployeeModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Plus, Users, Filter } from 'lucide-react';

export function Team() {
  const [searchParams] = useSearchParams();
  const { canManageEmployees } = useAuth();
  const {
    employees,
    tasks,
    projects,
    addEmployee,
    updateEmployee,
    deleteEmployee
  } = useData();

  const initialEmpId = searchParams.get('employeeId');

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    if (initialEmpId) {
      const match = employees.find(e => e.id === initialEmpId);
      if (match) setSelectedEmployee(match);
    }
  }, [initialEmpId, employees]);

  const departments = useMemo(() => {
    const set = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(set);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = departmentFilter === 'All' || e.department === departmentFilter;
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;

      return matchSearch && matchDept && matchStatus;
    });
  }, [employees, searchQuery, departmentFilter, statusFilter]);

  const handleCreateOrUpdate = (formData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, formData);
      setEditingEmployee(null);
    } else {
      addEmployee(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Human Capital & Engineering Personnel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Engineering & Field Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Structural engineers, project directors, MEP consultants, site superintendents, and safety inspectors.
          </p>
        </div>

        {canManageEmployees && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingEmployee(null);
              setIsCreateModalOpen(true);
            }}
          >
            Add Specialist
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team member by name, role, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="p-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Disciplines</option>
            {departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Site">On Site</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      {filteredEmployees.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No personnel found"
          description="Try modifying search keywords or clearing discipline filters."
          actionText={canManageEmployees ? "Onboard Specialist" : undefined}
          onAction={() => {
            setSearchQuery('');
            setDepartmentFilter('All');
            setStatusFilter('All');
            if (canManageEmployees) setIsCreateModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map(emp => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              tasks={tasks}
              projects={projects}
              onSelect={(e) => setSelectedEmployee(e)}
              onEdit={(e) => {
                setEditingEmployee(e);
                setIsCreateModalOpen(true);
              }}
              onDelete={(id) => {
                if (window.confirm('Remove this specialist from active roster?')) {
                  deleteEmployee(id);
                }
              }}
              canManage={canManageEmployees}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialEmployee={editingEmployee}
        projects={projects}
      />

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
        tasks={tasks}
        projects={projects}
      />
    </div>
  );
}
