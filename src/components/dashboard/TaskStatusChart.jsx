import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function TaskStatusChart({ tasks }) {
  const { isDark } = useTheme();
  const counts = {
    Completed: tasks.filter(t => t.status === 'Completed').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'Under Review': tasks.filter(t => t.status === 'Under Review').length,
    Blocked: tasks.filter(t => t.status === 'Blocked').length,
  };

  const data = [
    { name: 'Completed', value: counts.Completed, color: '#16A34A' },
    { name: 'In Progress', value: counts['In Progress'], color: '#2563EB' },
    { name: 'Under Review', value: counts['Under Review'], color: '#8B5CF6' },
    { name: 'Pending', value: counts.Pending, color: '#64748B' },
    { name: 'Blocked', value: counts.Blocked, color: '#DC2626' },
  ].filter(d => d.value > 0);

  const totalTasks = tasks.length;

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
            Task Status Distribution
          </h3>
          <span className="text-xs font-mono font-semibold bg-[#F6F6F2] text-[#242B27] px-2 py-0.5 rounded border border-[#E7E9E3]">
            {totalTasks} total
          </span>
        </div>
        <p className="text-xs text-[#777F79]">
          Deliverable workflow breakdown across active sites
        </p>
      </div>

      <div className="h-56 relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  const pct = totalTasks > 0 ? Math.round((item.value / totalTasks) * 100) : 0;
                  return (
                    <div className="bg-white p-2.5 rounded-lg border border-[#E7E9E3] shadow-md text-xs">
                      <div className="font-semibold text-[#242B27] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.name}
                      </div>
                      <div className="text-[#777F79] mt-1 font-mono">
                        {item.value} deliverables ({pct}%)
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={isDark ? '#1C221F' : '#FFFFFF'}
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-[#242B27] font-heading">
            {counts.Completed}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#777F79] tracking-wider">
            Completed
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-[#E7E9E3] text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[#777F79] truncate text-[11px]">{item.name}:</span>
            <span className="font-semibold text-[#242B27] font-mono text-[11px]">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
