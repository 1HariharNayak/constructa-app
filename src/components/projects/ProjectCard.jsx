import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, Calendar, CheckSquare, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { getProjectCoverImage, ARCHITECTURAL_BLUEPRINT_SVG } from '../../utils/projectImages';

export function ProjectCard({
  project,
  tasks = [],
  onEdit,
  onDelete,
  canManage = false
}) {
  const navigate = useNavigate();

  const projTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projTasks.filter(t => t.status === 'Completed').length;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group bg-white rounded-xl border border-[#E7E9E3] hover:border-[#D5D8CF] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Photo Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-[#1C2420]">
          <img
            src={getProjectCoverImage(project)}
            alt={project.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = ARCHITECTURAL_BLUEPRINT_SVG;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#202824]/80 via-transparent to-transparent opacity-90" />

          {/* Type & Code Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="bg-[#202824]/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
              {project.type || 'Commercial'}
            </span>
            <span className="bg-white/95 backdrop-blur-xs text-[#242B27] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-2xs">
              {project.code}
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1">
            <StatusBadge status={project.status} size="xs" />
            {canManage && (
              <div
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white/95 rounded-md p-0.5 ml-1 shadow-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onEdit(project)}
                  className="p-1 hover:text-[#A77B50] text-[#777F79] transition-colors"
                  title="Edit Project Charter"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1 hover:text-[#C66C62] text-[#777F79] transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Project Title overlay on bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-base font-bold font-heading line-clamp-1 leading-snug drop-shadow-xs">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-white/90 mt-0.5">
              <MapPin className="w-3 h-3 text-[#A77B50] shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Manager & Timeline */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#E7E9E3] text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#777F79] block">Lead Project Manager</span>
              <div className="flex items-center gap-1.5 text-[#242B27] font-semibold mt-0.5 truncate">
                <User className="w-3.5 h-3.5 text-[#A77B50] shrink-0" />
                <span className="truncate">{project.manager}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-[#777F79] block">Target Handover</span>
              <div className="flex items-center gap-1.5 text-[#242B27] font-mono mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#657A6A] shrink-0" />
                <span>{project.endDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Task Summary Footer */}
      <div className="p-4 pt-0">
        <div className="p-3 rounded-lg bg-[#F6F6F2] border border-[#E7E9E3]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#777F79] font-medium flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-[#657A6A]" />
              Work Orders: <strong className="text-[#242B27]">{completedTasks}/{projTasks.length}</strong>
            </span>
            <span className="font-mono font-bold text-[#242B27]">
              {project.progress}%
            </span>
          </div>

          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E7E9E3]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                project.status === 'Delayed'
                  ? 'bg-[#C66C62]'
                  : project.status === 'Completed'
                  ? 'bg-[#5D8068]'
                  : 'bg-[#A77B50]'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
