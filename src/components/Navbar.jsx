// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 30);
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
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-5'}
      `}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={IMAGES.logo} 
              alt={`${COMPANY.name} Logo`}
              className="h-10 w-10 rounded-xl"
            />
            <div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tighter
                               bg-gradient-to-r from-green-700 via-emerald-600 to-green-500 
                               bg-clip-text text-transparent">
                {COMPANY.shortName}
              </span>
              <p className="text-[10px] text-slate-500 -mt-1 tracking-[2px] font-medium">
                {COMPANY.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative font-semibold text-[15px] transition-all duration-300
                  group
                  ${hasScrolled ? 'text-slate-800 hover:text-emerald-600' : 'text-white/90 hover:text-white'}
                  ${location.pathname === item.path ? (hasScrolled ? 'text-emerald-600' : 'text-white') : ''}
                `}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-500 to-green-500"
                  />
                )}
              </Link>
            ))}

            <Link
              to="/contact"
              className="
                px-7 py-2.5 rounded-2xl font-semibold text-sm tracking-wide
                bg-gradient-to-r from-emerald-600 to-green-600 text-white
                shadow-lg shadow-emerald-600/30 
                hover:shadow-xl hover:shadow-emerald-600/40
                hover:-translate-y-0.5 active:scale-95
                transition-all duration-300
              "
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`p-2 rounded-2xl transition-colors ${hasScrolled ? 'hover:bg-slate-100 text-slate-700' : 'hover:bg-white/20 text-white'}`}
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
      </div>

      <div
        className={`
          md:hidden overflow-hidden glass border-t border-white/20 
          transition-all duration-500 ease-out
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
                  ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                  : 'text-slate-800 hover:bg-emerald-50/50 hover:text-emerald-600'}
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
