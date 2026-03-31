// src/components/Navbar.jsx
import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const location = useLocation(); 
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 40);
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
        fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md
        ${hasScrolled 
          ? 'bg-white/95 shadow-md' 
          : 'bg-white/80'}
      `}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="src/assets/img/logo.png"
              alt="Nepal Treks Logo"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover bg-white p-1 shadow-sm 
                         group-hover:rotate-[15deg] group-hover:scale-110 transition-transform duration-300"
            />
            <span className="
              text-xl sm:text-2xl font-bold tracking-tight
              bg-gradient-to-r from-green-600 via-green-500 to-green-400 
              bg-clip-text text-transparent
            ">
              NepalTreks
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  relative font-medium text-slate-800 transition-colors
                  hover:text-green-600
                  ${location.pathname === item.path ? 'text-green-600 font-semibold' : ''}
                `}
              >
                {item.name}
                <span
                  className={`
                    absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 
                    bg-gradient-to-r from-green-600 to-green-400 
                    transition-transform duration-300
                    ${location.pathname === item.path ? 'scale-x-100' : 'group-hover:scale-x-100'}
                  `}
                />
              </Link>
            ))}

            {/* Contact Button */}
            <Link
              to="/contact"
              className="
                rounded-full bg-gradient-to-r from-green-600 to-green-800 
                px-5 py-2.5 text-sm font-semibold text-white shadow-md
                hover:from-green-700 hover:to-green-900 hover:shadow-lg 
                hover:scale-105 active:scale-95 transition-all duration-200
              "
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-slate-800 hover:bg-slate-100 transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileOpen ? (
              // Close icon
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
             
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

     
      <div
        className={`
          md:hidden overflow-hidden transition-all duration-400 ease-in-out
          bg-white/95 backdrop-blur-md border-t border-slate-100
          ${isMobileOpen ? 'max-h-[500px] py-5 shadow-lg' : 'max-h-0 py-0'}
        `}
      >
        <div className="flex flex-col px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                block px-5 py-3.5 rounded-lg text-base font-medium transition-colors
                ${location.pathname === item.path
                  ? 'bg-green-50 text-green-700 font-semibold'
                  : 'text-slate-800 hover:bg-green-50 hover:text-green-700'}
              `}
              onClick={() => setIsMobileOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <Link
            to="/contact"
            className="
              block mt-3 mx-5 py-3.5 text-center rounded-full font-semibold
              bg-gradient-to-r from-green-600 to-green-800 text-white
              hover:from-green-700 hover:to-green-900 active:scale-95 transition-all
            "
            onClick={() => setIsMobileOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}