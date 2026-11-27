import React from 'react';

export function StatCard({
  title,
  value,
  description,
  trend,
  trendPositive = true,
  icon: Icon,
  variant = 'default',
  onClick
}) {
  const variantStyles = {
    default: {
      iconBg: 'bg-slate-100 dark:bg-slate-700/60',
      iconColor: 'text-slate-700 dark:text-slate-300',
      iconBorder: 'border-slate-200 dark:border-slate-600',
      borderHover: 'hover:border-slate-300 dark:hover:border-slate-600'
    },
    bronze: {
      iconBg: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBorder: 'border-blue-100 dark:border-blue-800/40',
      borderHover: 'hover:border-blue-200 dark:hover:border-blue-800'
    },
    sage: {
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBorder: 'border-emerald-100 dark:border-emerald-800/40',
      borderHover: 'hover:border-emerald-200 dark:hover:border-emerald-800'
    },
    success: {
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBorder: 'border-emerald-100 dark:border-emerald-800/40',
      borderHover: 'hover:border-emerald-200 dark:hover:border-emerald-800'
    },
    warning: {
      iconBg: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBorder: 'border-amber-100 dark:border-amber-800/40',
      borderHover: 'hover:border-amber-200 dark:hover:border-amber-800'
    },
    danger: {
      iconBg: 'bg-rose-50 dark:bg-rose-950/40',
      iconColor: 'text-rose-600 dark:text-rose-400',
      iconBorder: 'border-rose-100 dark:border-rose-800/40',
      borderHover: 'hover:border-rose-200 dark:hover:border-rose-800'
    },
    info: {
      iconBg: 'bg-sky-50 dark:bg-sky-950/40',
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBorder: 'border-sky-100 dark:border-sky-800/40',
      borderHover: 'hover:border-sky-200 dark:hover:border-sky-800'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-4.5 shadow-xs transition-all duration-200 select-none flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-sm hover:-translate-y-0.5' : ''
      } ${style.borderHover}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <div className={`w-8 h-8 rounded-lg ${style.iconBg} ${style.iconColor} border ${style.iconBorder} flex items-center justify-center shrink-0`}>
            {Icon && <Icon className="w-4 h-4" />}
          </div>
        </div>

        <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-1">
          {value}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 leading-none">
          <span className="truncate pr-1">{description}</span>
          {trend && (
            <span
              className={`font-medium shrink-0 ${
                trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
