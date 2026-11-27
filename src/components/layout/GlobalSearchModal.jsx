import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, CheckSquare, Users, ArrowRight, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const { projects, tasks, employees } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const filteredProjects = cleanQuery
    ? projects.filter(p =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.location.toLowerCase().includes(cleanQuery) ||
        p.type.toLowerCase().includes(cleanQuery)
      )
    : projects.slice(0, 3);

  const filteredTasks = cleanQuery
    ? tasks.filter(t =>
        t.id.toLowerCase().includes(cleanQuery) ||
        t.title.toLowerCase().includes(cleanQuery) ||
        t.projectName.toLowerCase().includes(cleanQuery)
      )
    : tasks.slice(0, 4);

  const filteredEmployees = cleanQuery
    ? employees.filter(e =>
        e.name.toLowerCase().includes(cleanQuery) ||
        e.role.toLowerCase().includes(cleanQuery) ||
        e.department.toLowerCase().includes(cleanQuery)
      )
    : employees.slice(0, 3);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202824]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-[#E7E9E3] overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E7E9E3] bg-[#F6F6F2]">
          <Search className="w-5 h-5 text-[#A77B50] mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, tasks, drawings, or engineering staff..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#242B27] placeholder-[#777F79] focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#777F79] hover:text-[#242B27] p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#777F79] bg-white border border-[#E7E9E3] rounded shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777F79] mb-2 px-2">
                <FolderKanban className="w-3.5 h-3.5 text-[#A77B50]" />
                Capital Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#F6F6F2] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#F6F6F2] text-[#A77B50] border border-[#E7E9E3] flex items-center justify-center shrink-0 font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium text-[#242B27] group-hover:text-[#A77B50]">
                          {p.name}
                        </div>
                        <div className="text-xs text-[#777F79] truncate">
                          {p.location} • {p.status} ({p.progress}%)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#A77B50] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777F79] mb-2 px-2">
                <CheckSquare className="w-3.5 h-3.5 text-[#657A6A]" />
                Deliverables & Work Orders
              </div>
              <div className="space-y-1">
                {filteredTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(`/tasks?taskId=${t.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#F6F6F2] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-[#F6F6F2] text-[#242B27] border border-[#E7E9E3]">
                        {t.id}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-medium text-[#242B27] group-hover:text-[#657A6A] truncate">
                          {t.title}
                        </div>
                        <div className="text-xs text-[#777F79] truncate">
                          {t.projectName} • Priority: {t.priority} • {t.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#657A6A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {filteredEmployees.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#777F79] mb-2 px-2">
                <Users className="w-3.5 h-3.5 text-[#718B9A]" />
                Specialists Directory
              </div>
              <div className="space-y-1">
                {filteredEmployees.map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleSelect(`/team?employeeId=${e.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-[#F6F6F2] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={e.avatar}
                        alt={e.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-[#E7E9E3]"
                      />
                      <div className="truncate">
                        <div className="text-sm font-medium text-[#242B27] group-hover:text-[#718B9A]">
                          {e.name}
                        </div>
                        <div className="text-xs text-[#777F79] truncate">
                          {e.role} • {e.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#718B9A] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && filteredTasks.length === 0 && filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-[#777F79] text-sm">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#F6F6F2] border-t border-[#E7E9E3] text-[11px] text-[#777F79]">
          <span>Jump directly to capital projects, work orders, or engineering leads</span>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-white border border-[#E7E9E3] rounded font-mono">ESC</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
