import React from 'react';
import NavBar from './NavBar';
import SideNav from './SideNav';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 flex">
        {/* Persistent sidebar on md+ screens */}
        <div className="hidden md:block w-60 border-r border-gray-200 bg-white/70 backdrop-blur-sm">
          <SideNav />
        </div>
        {/* Content area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
