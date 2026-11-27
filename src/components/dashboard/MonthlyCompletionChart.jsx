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

  const gridStroke = isDark ? '#2A332E' : '#E7E9E3';
  const axisColor = isDark ? '#9BA29C' : '#777F79';
  const plannedColor = isDark ? '#2C3630' : '#E7E9E3';

  return (
    <div className="bg-white rounded-xl border border-[#E7E9E3] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#242B27]">
            Monthly Deliverable Velocity
          </h3>
          <p className="text-xs text-[#777F79] mt-0.5">
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
                    <div className="bg-white p-3 rounded-lg border border-[#E7E9E3] shadow-md text-xs space-y-1.5">
                      <div className="font-bold text-[#242B27]">{label} 2026</div>
                      <div className="flex items-center gap-2 text-[#5D8068]">
                        <span className="w-2 h-2 rounded-full bg-[#5D8068]" />
                        <span>Completed:</span>
                        <span className="font-mono font-bold">{payload[0]?.value}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#777F79]">
                        <span className="w-2 h-2 rounded-full bg-[#D5D8CF]" />
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
            <Bar dataKey="completed" name="Completed" fill="#5D8068" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="planned" name="Planned" fill={plannedColor} radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
