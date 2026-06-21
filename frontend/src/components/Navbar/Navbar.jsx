import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Main navigation options with "Notices" restored
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sports', path: '/sports' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Circulars', path: '/notices' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white border-b border-[#7A1E2D]/10 text-[#7A1E2D] w-full shadow-sm transition-all duration-300">
      
      {/* ROW 1: Centered Logo Banner (Full White BG) */}
      <div className="relative flex items-center justify-center h-20 px-4 border-b border-slate-100">
        <div className="flex-shrink-0">
          <Link to="/">
            <img 
              src="/logo-full.jpg" 
              alt="KHIT College Logo Banner" 
              className="max-h-16 w-auto object-contain py-2 max-w-full"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="absolute right-4 lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-[#7A1E2D] hover:text-[#D9A441] focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ROW 2: Centered Desktop Links */}
      <div className="hidden lg:flex items-center justify-center min-h-[3rem] py-2 bg-white">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-bold tracking-wide text-[#7A1E2D] hover:text-[#D9A441] transition-colors duration-150"
            >
              {link.name}
            </Link>
          ))}
          {/* Admin Dashboard Access Link */}
          <Link
            to="/admin"
            className="ml-4 px-4 py-1.5 rounded-md bg-[#7A1E2D] hover:bg-[#8B1F2F] text-white font-semibold text-xs tracking-wide transition-all duration-200 shadow-sm"
          >
            Admin Login
          </Link>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} lg:hidden border-t border-[#F2B84B]/20 bg-[#8B1F2F] transition-all duration-300`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-semibold text-white hover:bg-[#7A1E2D] hover:text-[#F2B84B]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 pb-2 border-t border-[#F2B84B]/20 px-3">
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center py-2.5 px-4 rounded-lg bg-[#F2B84B] text-[#7A1E2D] font-bold hover:bg-[#D9A441] transition-all duration-200"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;