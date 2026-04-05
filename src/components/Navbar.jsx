"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-lg
        ${hasScrolled 
          ? 'bg-slate-950/95 shadow-xl border-b border-cyan-500/20' 
          : 'bg-slate-950/80'
        }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="src/assets/img/logo.png"
                alt="Nepal Treks Logo"
                className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover border border-cyan-400/30 
                           group-hover:rotate-12 group-hover:scale-110 transition-all duration-300"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
            </div>
            
            <div>
              <span className="text-2xl sm:text-3xl font-bold tracking-tighter bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent">
                NepalTreks
              </span>
              <p className="text-[10px] text-cyan-400 -mt-1 tracking-[2px]">EXPLORE NEPAL</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="group relative font-medium text-slate-200 hover:text-white transition-colors duration-200"
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-cyan-400 to-purple-500 
                    transition-all duration-300 group-hover:w-full
                    ${location.pathname === item.path ? 'w-full' : ''}`}
                />
              </Link>
            ))}

            {/* Contact Button */}
            <Link
              to="/contact"
              className="relative overflow-hidden group px-6 py-2.5 font-semibold text-white 
                         bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full 
                         hover:from-cyan-600 hover:to-purple-700 transition-all duration-300
                         shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-purple-500/40
                         active:scale-95"
            >
              <span className="relative z-10">Contact Us</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-3 rounded-xl text-slate-200 hover:bg-white/10 transition-colors"
            aria-label="Toggle mobile menu"
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

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-out bg-slate-950/95 border-t border-cyan-500/10
          ${isMobileOpen ? 'max-h-[420px] py-6' : 'max-h-0 py-0'}`}
      >
        <div className="flex flex-col px-6 space-y-2">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`block px-6 py-4 rounded-2xl text-lg font-medium transition-all
                  ${location.pathname === item.path 
                    ? 'bg-cyan-500/10 text-cyan-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                {item.name}
              </Link>
            </motion.div>
          ))}

          <Link
            to="/contact"
            onClick={() => setIsMobileOpen(false)}
            className="mt-6 mx-2 py-4 text-center rounded-2xl font-semibold text-lg
                       bg-gradient-to-r from-cyan-500 to-purple-600 text-white
                       active:scale-[0.97] transition-all shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}