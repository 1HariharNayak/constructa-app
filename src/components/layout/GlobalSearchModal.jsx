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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search projects, tasks, drawings, or engineering staff..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <FolderKanban className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Capital Projects
              </div>
              <div className="space-y-1">
                {filteredProjects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/projects/${p.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40 flex items-center justify-center shrink-0 font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {p.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {p.location} • {p.status} ({p.progress}%)
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
                Deliverables & Work Orders
              </div>
              <div className="space-y-1">
                {filteredTasks.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(`/tasks?taskId=${t.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                        {t.id}
                      </span>
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {t.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {t.projectName} • Priority: {t.priority} • {t.status}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          {filteredEmployees.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-2">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                Specialists Directory
              </div>
              <div className="space-y-1">
                {filteredEmployees.map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleSelect(`/team?employeeId=${e.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={e.avatar}
                        alt={e.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="truncate">
                        <div className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {e.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {e.role} • {e.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredProjects.length === 0 && filteredTasks.length === 0 && filteredEmployees.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
          <span>Jump directly to capital projects, work orders, or engineering leads</span>
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono">ESC</kbd> to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
