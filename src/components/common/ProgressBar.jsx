import React from 'react';

export function ProgressBar({ value = 0, max = 100, showLabel = false, size = 'md', className = '' }) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  let color = 'bg-blue-600';
  if (percent >= 100) {
    color = 'bg-emerald-600';
  } else if (percent < 30) {
    color = 'bg-amber-500';
  }

  const heightClass = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5',
  }[size] || 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs mb-1 font-medium text-slate-900 dark:text-white">
          <span className="text-slate-500 dark:text-slate-400">Progress</span>
          <span className="font-semibold">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`${heightClass} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function ProgressRing({ value = 0, size = 44, strokeWidth = 3.5, className = '' }) {
  const percent = Math.min(100, Math.max(0, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  let strokeColor = '#2563EB';
  if (percent >= 100) strokeColor = '#10B981';
  else if (percent < 30) strokeColor = '#F59E0B';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-slate-900 dark:text-white tracking-tighter">
        {percent}%
      </span>
    </div>
  );
}
