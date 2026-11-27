import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from '../common/Badge';
import { Edit2, Trash2, ArrowUpRight } from 'lucide-react';

export function ProjectTable({
  projects,
  tasks = [],
  onEdit,
  onDelete,
  canManage = false
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F6F6F2] border-b border-[#E7E9E3] text-[#777F79] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Facility Type</th>
              <th className="py-3.5 px-4">Project Manager</th>
              <th className="py-3.5 px-4">Target Date</th>
              <th className="py-3.5 px-4">Tasks</th>
              <th className="py-3.5 px-4">Progress</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E9E3]">
            {projects.map((proj) => {
              const projTasks = tasks.filter(t => t.projectId === proj.id);
              const completedTasks = projTasks.filter(t => t.status === 'Completed').length;

              return (
                <tr
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="hover:bg-[#F6F6F2] transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.coverImage}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-[#E7E9E3] shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-[#242B27] group-hover:text-[#A77B50] transition-colors block truncate">
                          {proj.name}
                        </span>
                        <span className="text-[11px] text-[#777F79] block truncate">
                          {proj.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={proj.status} size="xs" />
                  </td>
                  <td className="py-3 px-4 text-[#777F79] whitespace-nowrap">
                    {proj.type}
                  </td>
                  <td className="py-3 px-4 text-[#242B27] font-semibold whitespace-nowrap">
                    {proj.manager}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#777F79] whitespace-nowrap">
                    {proj.endDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[#242B27] font-bold">
                      {completedTasks}/{projTasks.length}
                    </span>
                  </td>
                  <td className="py-3 px-4 min-w-[130px]">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E7E9E3] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#A77B50] h-full rounded-full"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#242B27] w-8 text-right">
                        {proj.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div
                      className="inline-flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {canManage && (
                        <>
                          <button
                            onClick={() => onEdit(proj)}
                            className="p-1 text-[#777F79] hover:text-[#A77B50] rounded"
                            title="Edit Project"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(proj.id)}
                            className="p-1 text-[#777F79] hover:text-[#C66C62] rounded"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/projects/${proj.id}`)}
                        className="p-1 text-[#777F79] hover:text-[#242B27] rounded"
                        title="Open Workspace"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
