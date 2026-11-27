import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useData } from '../../context/DataContext';

export function Breadcrumbs() {
  const location = useLocation();
  const { projects } = useData();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) {
    return (
      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        <span className="flex items-center gap-1.5 text-slate-900 dark:text-white">
          <Home className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Dashboard Overview</span>
        </span>
      </div>
    );
  }

  const getLabel = (segment, index) => {
    if (segment === 'projects') return 'All Projects';
    if (segment === 'tasks') return 'My Tasks';
    if (segment === 'board') return 'Task Board';
    if (segment === 'calendar') return 'Schedule Calendar';
    if (segment === 'milestones') return 'Roadmap & Milestones';
    if (segment === 'team') return 'Team Members';
    if (segment === 'reports') return 'Task Reports & Analytics';
    if (segment === 'activity') return 'Site Activity Logs';
    if (segment === 'notifications') return 'Notifications';
    if (segment === 'settings') return 'Enterprise Settings';

    // If segment is a project ID
    if (index > 0 && pathnames[index - 1] === 'projects') {
      const proj = projects.find(p => p.id === segment);
      return proj ? proj.name : segment;
    }

    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium space-x-1.5 overflow-hidden">
      <Link
        to="/"
        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
        title="Dashboard"
      >
        <Home className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600" />
      </Link>
      {pathnames.map((segment, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = getLabel(segment, index);

        return (
          <React.Fragment key={routeTo}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {isLast ? (
              <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-xs">
                {label}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate shrink-0"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
