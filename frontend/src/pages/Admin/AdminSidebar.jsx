import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Players', path: '/admin/players', icon: '🏃' },
    { name: 'Teams', path: '/admin/teams', icon: '👥' },
    { name: 'Matches', path: '/admin/matches', icon: '🏆' },
    { name: 'Events', path: '/admin/events', icon: '📅' },
    { name: 'Notices', path: '/admin/notices', icon: '📢' },
    { name: 'Gallery', path: '/admin/gallery', icon: '🖼️' },
  ];

  // Clears the administrative session and redirects to the login screen
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("adminAuth"); // Deletes the auth token key
    setIsOpen(false);
    navigate("/login"); // Triggers navigation back to public login view
  };

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-[#7A1E2D] text-white h-16 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-md border-b-2 border-[#F2B84B]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm tracking-wider uppercase text-[#F2B84B]">KHIT Admin</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:text-[#F2B84B] focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar Navigation Panel Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200 text-[#0F172A] w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:z-30 pt-16 lg:pt-0`}
      >
        {/* Desktop Header Panel */}
        <div className="hidden lg:flex items-center gap-3 h-20 px-6 border-b-2 border-[#F2B84B] bg-[#7A1E2D] text-white">
          <div className="flex flex-col">
            <span className="font-black text-sm tracking-wider uppercase text-[#F2B84B]">KHIT Sports</span>
            <span className="text-[9px] text-gray-300 font-bold tracking-widest uppercase">Admin Panel</span>
          </div>
        </div>

        {/* Menu Navigation Links */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-5rem)]">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#7A1E2D] text-white shadow-md shadow-[#7A1E2D]/20 border-b-2 border-[#F2B84B]/25'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#7A1E2D]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Logout Section Link */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs md:text-sm font-bold tracking-wide text-slate-500 hover:bg-red-50 hover:text-red-700 transition-colors text-left"
            >
              <span>🚪</span>
              <span>Exit Admin</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
        />
      )}
    </>
  );
}