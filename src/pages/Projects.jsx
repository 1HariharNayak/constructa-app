import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectTable } from '../components/projects/ProjectTable';
import { ProjectModal } from '../components/projects/ProjectModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  Plus,
  LayoutGrid,
  List,
  Filter,
  Building2,
  FolderKanban
} from 'lucide-react';

export function Projects() {
  const { canCreateProject, canEditProject, canDeleteProject } = useAuth();
  const {
    visibleProjects,
    tasks,
    employees,
    addProject,
    updateProject,
    deleteProject
  } = useData();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [managerFilter, setManagerFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return visibleProjects.filter(p => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchManager = managerFilter === 'All' || p.manager === managerFilter;

      return matchSearch && matchStatus && matchManager;
    });
  }, [visibleProjects, searchQuery, statusFilter, managerFilter]);

  // Unique managers for filter
  const managers = useMemo(() => {
    const set = new Set(visibleProjects.map(p => p.manager).filter(Boolean));
    return Array.from(set);
  }, [visibleProjects]);

  const handleCreateOrUpdate = (formData) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
      setEditingProject(null);
    } else {
      addProject(formData);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks and milestones will also be removed.')) {
      deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#A77B50]" />
            <span className="text-[11px] font-semibold text-[#A77B50] uppercase tracking-wider">
              Capital Developments Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            All Construction Projects
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Manage high-rise towers, civil infrastructure, and residential developments across all active jurisdictions.
          </p>
        </div>

        {canCreateProject && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingProject(null);
              setIsModalOpen(true);
            }}
          >
            Create Project
          </Button>
        )}
      </div>

      {/* Control Bar: Search, Filters, View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#777F79] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, location, or code..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          />
        </div>

        {/* Filter Dropdowns & View Mode */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
            <option value="Planning">Planning</option>
          </select>

          {/* Manager Filter */}
          <select
            value={managerFilter}
            onChange={(e) => setManagerFilter(e.target.value)}
            className="p-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Managers</option>
            {managers.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#F6F6F2] p-0.5 rounded-lg border border-[#E7E9E3] shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#242B27] shadow-xs font-semibold'
                  : 'text-[#777F79] hover:text-[#242B27]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#242B27] shadow-xs font-semibold'
                  : 'text-[#777F79] hover:text-[#242B27]'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects match your filter"
          description="Try modifying search keywords or clearing status filters."
          actionText={canCreateProject ? "Create New Project" : undefined}
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('All');
            setManagerFilter('All');
            if (canCreateProject) setIsModalOpen(true);
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => (
            <ProjectCard
              key={proj.id}
              project={proj}
              tasks={tasks}
              onEdit={handleEdit}
              onDelete={handleDelete}
              canManage={canEditProject}
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          tasks={tasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canManage={canEditProject}
        />
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialProject={editingProject}
        employees={employees}
      />
    </div>
  );
}
