import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export function MonthlyTaskChart() {
  const { isDark } = useTheme();

  const data = [
    { month: 'Jun', completed: 24, planned: 30 },
    { month: 'Jul', completed: 32, planned: 35 },
    { month: 'Aug', completed: 28, planned: 34 },
    { month: 'Sep', completed: 38, planned: 40 },
    { month: 'Oct', completed: 42, planned: 45 },
    { month: 'Nov', completed: 35, planned: 38 },
  ];

  const gridStroke = isDark ? '#334155' : '#E2E8F0';
  const axisColor = isDark ? '#94A3B8' : '#64748B';
  const plannedColor = isDark ? '#334155' : '#CBD5E1';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Monthly Deliverable Velocity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Actual certified completion throughput vs planned schedule targets
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
            <XAxis
              dataKey="month"
              axisLine={{ stroke: gridStroke }}
              tickLine={false}
              tick={{ fill: axisColor, fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: axisColor, fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1.5">
                      <div className="font-bold text-slate-900 dark:text-white">{label} 2026</div>
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        <span>Completed:</span>
                        <span className="font-mono font-bold">{payload[0]?.value}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span>Planned:</span>
                        <span className="font-mono font-bold">{payload[1]?.value}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px' }}
            />
            <Bar dataKey="completed" name="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="planned" name="Planned" fill={plannedColor} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
