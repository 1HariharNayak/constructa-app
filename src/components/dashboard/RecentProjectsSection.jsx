import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, ArrowRight, Building2 } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { getProjectCoverImage, ARCHITECTURAL_BLUEPRINT_SVG } from '../../utils/projectImages';

export function RecentProjectsSection({ projects }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-[#1C221F] rounded-xl border border-[#E7E9E3] dark:border-[#2A332E] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#242B27] dark:text-[#EDEDEA]">
            Active Capital Projects
          </h3>
          <p className="text-xs text-[#777F79] dark:text-[#9BA29C] mt-0.5">
            Real-time status of commercial towers, residential communities, and infrastructure sites
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="text-xs font-semibold text-[#A77B50] hover:text-[#8E653E] dark:text-[#C29567] dark:hover:text-[#DEAC7B] flex items-center gap-1 cursor-pointer"
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
            className="group rounded-xl border border-[#E7E9E3] dark:border-[#2A332E] overflow-hidden bg-white dark:bg-[#202723] hover:border-[#D5D8CF] dark:hover:border-[#38453E] hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            {/* Project Image */}
            <div className="relative h-40 w-full overflow-hidden bg-[#1C2420]">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2.5 right-2.5">
                <StatusBadge status={project.status} size="xs" />
              </div>
              <div className="absolute bottom-2.5 left-2.5 bg-[#202824]/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                {project.type}
              </div>
            </div>

            {/* Project Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#242B27] dark:text-[#EDEDEA] group-hover:text-[#A77B50] dark:group-hover:text-[#C29567] transition-colors line-clamp-1">
                  {project.name}
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-[#777F79] dark:text-[#9BA29C] mt-1 line-clamp-1">
                  <MapPin className="w-3 h-3 text-[#A77B50] shrink-0" />
                  <span>{project.location}</span>
                </div>
              </div>

              {/* Progress & Project Manager */}
              <div className="mt-4 pt-3 border-t border-[#E7E9E3] dark:border-[#2A332E]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#777F79] dark:text-[#9BA29C]">Completion</span>
                  <span className="font-mono font-bold text-[#242B27] dark:text-[#EDEDEA]">{project.progress}%</span>
                </div>
                <div className="w-full bg-[#E7E9E3] dark:bg-[#2A332E] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#A77B50] h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#777F79] dark:text-[#9BA29C] mt-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-[#777F79] dark:text-[#9BA29C]" />
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
