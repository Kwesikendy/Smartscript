import React, { useState } from 'react';
import NavBar from './NavBar';
import SideNav from './SideNav';
import { Menu } from 'lucide-react';

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <div className="flex-1 flex">
        {/* Persistent sidebar on md+ screens */}
        <div className="hidden md:block w-60 border-r border-gray-200 bg-white/70 backdrop-blur-sm">
          <SideNav />
        </div>
        {/* Mobile slide-over sidebar */}
        <div className={`md:hidden fixed inset-0 z-40 ${mobileOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4">
            <SideNav />
          </div>
        </div>
        {/* Content area */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      {/* Mobile menu button floating */}
      <button
        className="md:hidden fixed bottom-5 right-5 inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
