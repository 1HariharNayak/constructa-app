import React from 'react';

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex border-b border-[#E7E9E3] space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? 'border-[#A77B50] text-[#242B27] font-semibold'
                : 'border-transparent text-[#777F79] hover:text-[#242B27] hover:border-[#D5D8CF]'
            }`}
          >
            {Icon && <Icon className={`w-4 h-4 ${isActive ? 'text-[#A77B50]' : 'text-[#777F79]'}`} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                  isActive ? 'bg-[#A77B50]/15 text-[#A77B50]' : 'bg-[#F6F6F2] text-[#777F79] border border-[#E7E9E3]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
