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
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#F6F6F2]',
      iconColor: 'text-[#242B27]',
      accent: 'border-t-[#A77B50]'
    },
    bronze: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#A77B50]/10',
      iconColor: 'text-[#A77B50]',
      accent: 'border-t-[#A77B50]'
    },
    sage: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#657A6A]/10',
      iconColor: 'text-[#657A6A]',
      accent: 'border-t-[#657A6A]'
    },
    success: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#5D8068]/10',
      iconColor: 'text-[#5D8068]',
      accent: 'border-t-[#5D8068]'
    },
    warning: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#C28D4E]/10',
      iconColor: 'text-[#C28D4E]',
      accent: 'border-t-[#C28D4E]'
    },
    danger: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#C66C62]/10',
      iconColor: 'text-[#C66C62]',
      accent: 'border-t-[#C66C62]'
    },
    info: {
      border: 'border-[#E7E9E3]',
      iconBg: 'bg-[#718B9A]/10',
      iconColor: 'text-[#718B9A]',
      accent: 'border-t-[#718B9A]'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${style.border} border-t-2 ${style.accent} p-4 sm:p-4.5 shadow-xs transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer hover:border-[#D5D8CF] hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#777F79] block truncate">
            {title}
          </span>
          <div className="text-2xl sm:text-2.5xl font-extrabold text-[#242B27] font-heading mt-1 tracking-tight leading-tight">
            {value}
          </div>
        </div>
        <div className={`w-9 h-9 rounded-lg ${style.iconBg} ${style.iconColor} flex items-center justify-center shrink-0 border border-[#E7E9E3]/40`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-2.5 pt-2 border-t border-[#F6F6F2] flex items-center justify-between text-[11px] text-[#777F79]">
          <span className="truncate">{description}</span>
          {trend && (
            <span
              className={`font-mono font-semibold shrink-0 ml-1.5 ${
                trendPositive ? 'text-[#5D8068]' : 'text-[#C66C62]'
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
