import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { HelpModal } from './HelpModal';

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F6F6F2] text-[#242B27]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex shrink-0">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onOpenHelp={() => setHelpOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#202824]/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-[#202824] z-10 shadow-2xl">
            <Sidebar
              collapsed={false}
              onToggleCollapse={() => setMobileSidebarOpen(false)}
              onOpenHelp={() => {
                setMobileSidebarOpen(false);
                setHelpOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6 pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Help / Feature Guide Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </div>
  );
}
