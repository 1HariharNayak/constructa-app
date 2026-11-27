import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ArrowRight, Building2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { getProjectCoverImage, ARCHITECTURAL_BLUEPRINT_SVG } from '../../utils/projectImages';

export function RecentProjectsSection({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Active Capital Projects
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status of commercial towers, residential communities, and infrastructure sites
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
        >
          <span>View All Projects</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.slice(0, 3).map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="group rounded-xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            {/* Project Image */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-900">
              <img
                src={getProjectCoverImage(project)}
                alt={project.name}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = ARCHITECTURAL_BLUEPRINT_SVG;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2.5 right-2.5">
                <StatusBadge status={project.status} size="xs" />
              </div>
              <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                {project.type}
              </div>
            </div>

            {/* Project Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {project.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Progress & Project Manager */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500 dark:text-slate-400">Completion</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-slate-400" />
                    <span className="truncate">{project.managerName || project.manager}</span>
                  </div>
                  <span className="font-mono text-[10px]">{project.expectedCompletion || project.endDate}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
