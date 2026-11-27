import React from 'react';

export function Card({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-sm transition-all duration-200 ${
        hover ? 'hover:border-[#A77B50]/40 hover:shadow-md cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-3.5 mb-4 border-b border-[#F0F2EC] ${className}`}>
      <div>
        <h3 className="text-sm font-bold text-[#242B27] tracking-tight font-heading">{title}</h3>
        {subtitle && <p className="text-xs text-[#777F79] mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 ml-3">{action}</div>}
    </div>
  );
}
