import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { MilestoneCard } from '../components/milestones/MilestoneCard';
import { MilestoneModal } from '../components/milestones/MilestoneModal';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Flag, Plus, Search, Filter } from 'lucide-react';

export function Milestones() {
  const { canManageMilestones } = useAuth();
  const {
    milestones,
    projects,
    tasks,
    addMilestone,
    updateMilestone,
    deleteMilestone
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Filtered
  const filteredMilestones = useMemo(() => {
    return milestones.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchProject = projectFilter === 'All' || m.projectId === projectFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;

      return matchSearch && matchProject && matchStatus;
    });
  }, [milestones, searchQuery, projectFilter, statusFilter]);

  const handleCreateOrUpdate = (formData) => {
    if (editingMilestone) {
      updateMilestone(editingMilestone.id, formData);
      setEditingMilestone(null);
    } else {
      addMilestone(formData);
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
              Critical Path Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242B27] font-heading tracking-tight">
            Construction Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#777F79] mt-1">
            Coordinate major stage gates: Site Excavation, Foundation, CLT Framing, Curtain Walls, MEP Rough-Ins, and Handover.
          </p>
        </div>

        {canManageMilestones && (
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingMilestone(null);
              setIsModalOpen(true);
            }}
          >
            Add Milestone
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white rounded-xl border border-[#E7E9E3] shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#777F79] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search milestones or deliverable criteria..."
            className="w-full pl-9 pr-3 py-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="p-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 text-xs text-[#242B27] bg-[#F6F6F2] border border-[#E7E9E3] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77B50]"
          >
            <option value="All">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Delayed">Delayed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Milestones Grid */}
      {filteredMilestones.length === 0 ? (
        <EmptyState
          icon={Flag}
          title="No milestones match current criteria"
          description="Try broadening your search term or select All Projects."
          actionText={canManageMilestones ? "Add Milestone" : undefined}
          onAction={() => {
            setSearchQuery('');
            setProjectFilter('All');
            setStatusFilter('All');
            if (canManageMilestones) setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMilestones.map(m => (
            <MilestoneCard
              key={m.id}
              milestone={m}
              tasks={tasks}
              onEdit={(mile) => {
                setEditingMilestone(mile);
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                if (window.confirm('Delete this milestone?')) {
                  deleteMilestone(id);
                }
              }}
              canManage={canManageMilestones}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <MilestoneModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMilestone(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialMilestone={editingMilestone}
        projects={projects}
      />
    </div>
  );
}
