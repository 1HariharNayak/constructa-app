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
      className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Cover Photo Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
          <img
            src={getProjectCoverImage(project)}
            alt={project.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = ARCHITECTURAL_BLUEPRINT_SVG;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-90" />

          {/* Top Badges Bar: Left (Type), Right (Status & Actions) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10 pointer-events-none">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-xs truncate">
              {project.type || 'Commercial'}
            </span>

            <div className="flex items-center gap-1 shrink-0 pointer-events-auto">
              <StatusBadge status={project.status} size="xs" />
              {canManage && (
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-white/95 dark:bg-slate-800/95 rounded-md p-0.5 ml-1 shadow-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => onEdit(project)}
                    className="p-1 hover:text-blue-600 text-slate-400 transition-colors"
                    title="Edit Project Charter"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(project.id)}
                    className="p-1 hover:text-rose-600 text-slate-400 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Project Title & Code overlay on bottom of image */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs text-slate-900 dark:text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs">
                {project.code}
              </span>
            </div>
            <h3 className="text-base font-bold line-clamp-1 leading-snug drop-shadow-xs">
              {project.name}
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-white/90 mt-0.5">
              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">{project.location}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Manager & Timeline */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Project Manager</span>
              <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-semibold mt-0.5 truncate">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{project.manager}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Handover</span>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{project.endDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Task Summary Footer */}
      <div className="p-4 pt-0">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              Work Orders: <strong className="text-slate-900 dark:text-white">{completedTasks}/{projTasks.length}</strong>
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {project.progress}%
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-600 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                project.status === 'Delayed'
                  ? 'bg-rose-500'
                  : project.status === 'Completed'
                  ? 'bg-emerald-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
