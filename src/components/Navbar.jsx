// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${hasScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl py-2' 
          : 'bg-white/80 backdrop-blur-md py-3'}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo - More Premium Look */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <img
                src="/src/assets/img/logo.png"   // Changed to /src (better practice)
                alt="Nepal Treks Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl object-cover shadow-md 
                           ring-1 ring-white/50 transition-all duration-300 
                           group-hover:scale-110 group-hover:-rotate-6"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-400/20 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tighter
                               bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 
                               bg-clip-text text-transparent">
                NepalTreks
              </span>
              <p className="text-[10px] text-slate-500 -mt-1 tracking-[2px] font-medium">EXPLORE NEPAL</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative text-slate-700 font-medium text-[15px] transition-all duration-300
                  hover:text-green-700 group
                  ${location.pathname === item.path ? 'text-green-700' : ''}
                `}
              >
                {item.name}
                {/* Underline Animation */}
                <span
                  className={`
                    absolute -bottom-1.5 left-0 h-[2px] w-0 bg-gradient-to-r from-green-600 to-emerald-500 
                    transition-all duration-300 group-hover:w-full
                    ${location.pathname === item.path ? 'w-full' : ''}
                  `}
                />
              </Link>
            ))}

            {/* Contact Button - Enhanced */}
            <Link
              to="/contact"
              className="
                ml-4 px-7 py-2.5 rounded-2xl font-semibold text-sm tracking-wide
                bg-gradient-to-r from-green-600 to-emerald-700 text-white
                shadow-lg shadow-green-600/30 
                hover:shadow-xl hover:shadow-green-600/40 
                hover:-translate-y-0.5 active:scale-95
                transition-all duration-300
              "
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Hamburger - Better Design */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-3 rounded-2xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Smooth Slide Down */}
      <div
        className={`
          md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-slate-100
          transition-all duration-500 ease-out shadow-xl
          ${isMobileOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-6 py-8 flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={`
                block px-6 py-4 rounded-2xl text-lg font-medium transition-all
                ${location.pathname === item.path
                  ? 'bg-green-50 text-green-700 font-semibold shadow-sm'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-green-700'}
              `}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="
              mt-6 mx-6 py-4 text-center rounded-2xl font-semibold text-base
              bg-gradient-to-r from-green-600 to-emerald-700 text-white
              shadow-lg active:scale-[0.97] transition-all
            "
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}