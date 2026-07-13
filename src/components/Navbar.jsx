// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';
import { useWishlist } from './WishlistContext';
import { treks } from '../data/treks';
import { FaHeart, FaRegHeart, FaTrashAlt, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when wishlist drawer is open
  useEffect(() => {
    if (isWishlistOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 transition-all duration-500 ease-out
        ${isWishlistOpen ? 'z-[9999]' : 'z-50'}
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

            <button
              onClick={() => setIsWishlistOpen(true)}
              className={`
                relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                hover:scale-105 active:scale-95 hover:bg-slate-100/10
                ${hasScrolled ? 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100' : 'text-white/90 hover:text-white'}
              `}
              aria-label="Wishlist"
            >
              <FaHeart className={wishlist.length > 0 ? "text-red-500 animate-pulse" : "text-current"} size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

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

          <div className="flex items-center gap-2 sm:gap-4 md:hidden">
            <button
              onClick={() => setIsWishlistOpen(true)}
              className={`
                relative p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center
                active:scale-95
                ${hasScrolled ? 'text-slate-700 hover:text-emerald-600 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'}
              `}
              aria-label="Wishlist"
            >
              <FaHeart className={wishlist.length > 0 ? "text-red-500" : "text-current"} size={22} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

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

      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full z-[100] bg-white shadow-2xl flex flex-col w-full md:w-96 md:max-w-md text-slate-800"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-red-500 text-xl" />
                  <h2 className="text-xl font-bold text-slate-900">My Saved Treks</h2>
                  <span className="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {wishlist.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all cursor-pointer"
                  aria-label="Close Wishlist"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {/* Saved Treks List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <FaRegHeart className="text-3xl animate-pulse" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Your wishlist is empty</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-[240px] mx-auto">
                      Explore our trekking packages and tap the heart icon to save them for later!
                    </p>
                    <Link
                      to="/packages"
                      onClick={() => setIsWishlistOpen(false)}
                      className="mt-6 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
                    >
                      Browse Packages
                    </Link>
                  </div>
                ) : (
                  wishlist.map((trekId) => {
                    const trek = treks.find((t) => t.id === trekId);
                    if (!trek) return null;
                    return (
                      <div
                        key={trek.id}
                        className="flex gap-4 p-3 rounded-2xl border border-slate-100 hover:border-emerald-100 bg-white hover:shadow-md transition-all group"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-100">
                          <img
                            src={trek.image}
                            alt={trek.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/packages/${trek.id}`}
                              onClick={() => setIsWishlistOpen(false)}
                              className="font-bold text-slate-800 hover:text-emerald-600 text-base line-clamp-1 block"
                            >
                              {trek.name}
                            </Link>
                            <span className="text-xs text-slate-500">{trek.location}</span>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span className="text-emerald-700 font-bold text-sm">
                              Rs. {trek.price.toLocaleString()}
                            </span>
                            <button
                              onClick={() => toggleWishlist(trek.id)}
                              className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-55/10 transition-all cursor-pointer"
                              title="Remove from Saved"
                            >
                              <FaTrashAlt className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              {wishlist.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Saved treks</span>
                    <span className="font-semibold">{wishlist.length} Items</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={clearWishlist}
                      className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer bg-white"
                    >
                      Clear All
                    </button>
                    <Link
                      to="/packages"
                      onClick={() => setIsWishlistOpen(false)}
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl text-sm font-semibold text-center hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                    >
                      View Packages
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
