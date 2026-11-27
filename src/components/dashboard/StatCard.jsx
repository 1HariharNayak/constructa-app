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
      iconBg: 'bg-[#F6F6F2] dark:bg-[#232B27]',
      iconColor: 'text-[#242B27] dark:text-[#EDEDEA]',
      borderHover: 'hover:border-[#A77B50]/40'
    },
    bronze: {
      iconBg: 'bg-[#A77B50]/10 dark:bg-[#A77B50]/20',
      iconColor: 'text-[#A77B50] dark:text-[#C29567]',
      borderHover: 'hover:border-[#A77B50]'
    },
    sage: {
      iconBg: 'bg-[#657A6A]/10 dark:bg-[#657A6A]/20',
      iconColor: 'text-[#657A6A] dark:text-[#7A9681]',
      borderHover: 'hover:border-[#657A6A]'
    },
    success: {
      iconBg: 'bg-[#5D8068]/10 dark:bg-[#5D8068]/20',
      iconColor: 'text-[#5D8068] dark:text-[#7EB88F]',
      borderHover: 'hover:border-[#5D8068]'
    },
    warning: {
      iconBg: 'bg-[#C28D4E]/10 dark:bg-[#C28D4E]/20',
      iconColor: 'text-[#C28D4E] dark:text-[#DFAB62]',
      borderHover: 'hover:border-[#C28D4E]'
    },
    danger: {
      iconBg: 'bg-[#C66C62]/10 dark:bg-[#C66C62]/20',
      iconColor: 'text-[#C66C62] dark:text-[#E48479]',
      borderHover: 'hover:border-[#C66C62]'
    },
    info: {
      iconBg: 'bg-[#718B9A]/10 dark:bg-[#718B9A]/20',
      iconColor: 'text-[#718B9A] dark:text-[#92B4C8]',
      borderHover: 'hover:border-[#718B9A]'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#1C221F] rounded-xl border border-[#E7E9E3] dark:border-[#2A332E] p-4.5 shadow-xs transition-all duration-200 select-none flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${style.borderHover}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-medium text-[#777F79] dark:text-[#9BA29C]">
            {title}
          </span>
          <div className={`w-8 h-8 rounded-lg ${style.iconBg} ${style.iconColor} flex items-center justify-center shrink-0`}>
            {Icon && <Icon className="w-4 h-4" />}
          </div>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold text-[#242B27] dark:text-[#EDEDEA] font-heading tracking-tight leading-none mb-1">
          {value}
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-3 pt-2.5 border-t border-[#F0F2EC] dark:border-[#242D28] flex items-center justify-between text-[11px] text-[#777F79] dark:text-[#9BA29C] leading-none">
          <span className="truncate pr-1">{description}</span>
          {trend && (
            <span
              className={`font-mono font-semibold shrink-0 ${
                trendPositive ? 'text-[#5D8068] dark:text-[#7EB88F]' : 'text-[#C66C62] dark:text-[#E48479]'
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
