import React from 'react';

export function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  hover = false,
  noPadding = false,
  badge,
  icon: Icon,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs transition-all duration-200 ${
        hover || onClick ? 'hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {(title || subtitle || action || badge || Icon) && (
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600/50 text-slate-600 dark:text-slate-300">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                {title && <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{title}</h3>}
                {badge}
              </div>
              {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-700/80 ${className}`}>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}

export default Card;
