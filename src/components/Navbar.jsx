import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';
import { useWishlist } from './WishlistContext';
import { treks } from '../data/treks';
import { FaHeart, FaRegHeart, FaTrashAlt, FaTimes } from 'react-icons/fa';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

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

  useEffect(() => {
    if (isWishlistOpen || isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isWishlistOpen, isMobileOpen]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Packages', path: '/packages' },
    { name: 'Trek Planner', path: '/planner' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <nav
      style={{
        backgroundColor: hasScrolled ? `${INK}F2` : 'transparent',
        backdropFilter: hasScrolled ? 'blur(10px)' : 'none',
        boxShadow: hasScrolled ? '0 4px 24px rgba(22,33,44,0.25)' : 'none',
        fontFamily: FONT_BODY
      }}
      className={`fixed top-0 left-0 right-0 transition-all duration-500 ease-out ${isWishlistOpen ? 'z-[9999]' : 'z-50'} ${hasScrolled ? 'py-3' : 'py-5'}`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <img
              src={IMAGES.logo}
              alt={`${COMPANY.name} Logo`}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
            />
            <div>
              <span style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="text-xl sm:text-2xl md:text-3xl italic font-normal tracking-tight">
                {COMPANY.shortName}
              </span>
              <p style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="hidden sm:block text-[9px] -mt-1 tracking-[3px] font-medium">
                {COMPANY.tagline}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                style={{
                  fontFamily: FONT_MONO,
                  color: location.pathname === item.path ? SAFFRON : `${PARCHMENT}CC`
                }}
                className="relative text-xs lg:text-[13px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 group focus-visible:outline-none rounded-md hover:opacity-80"
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.span
                    layoutId="underline"
                    style={{ backgroundColor: SAFFRON }}
                    className="absolute -bottom-1.5 left-0 h-[2px] w-full"
                  />
                )}
              </Link>
            ))}

            <button
              onClick={() => setIsWishlistOpen(true)}
              style={{ color: PARCHMENT }}
              className="relative p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 hover:opacity-80 focus-visible:outline-none"
              aria-label="Wishlist"
            >
              <FaHeart style={wishlist.length > 0 ? { color: CLAY } : {}} size={19} />
              {wishlist.length > 0 && (
                <span style={{ fontFamily: FONT_MONO, backgroundColor: SAFFRON, color: INK }} className="absolute -top-1 -right-1 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link
              to="/contact"
              style={{ backgroundColor: SAFFRON, color: INK }}
              className="px-5 lg:px-7 py-2.5 rounded-full font-semibold text-sm tracking-wide whitespace-nowrap shadow-lg hover:-translate-y-0.5 active:scale-95 focus-visible:outline-none transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:hidden">
            <button
              onClick={() => setIsWishlistOpen(true)}
              style={{ color: PARCHMENT }}
              className="relative p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center active:scale-95 focus-visible:outline-none"
              aria-label="Wishlist"
            >
              <FaHeart style={wishlist.length > 0 ? { color: CLAY } : {}} size={22} />
              {wishlist.length > 0 && (
                <span style={{ fontFamily: FONT_MONO, backgroundColor: SAFFRON, color: INK }} className="absolute top-0 right-0 text-[9px] font-bold w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-sm">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              style={{ color: PARCHMENT }}
              className="p-2 rounded-lg transition-colors relative w-9 h-9 flex items-center justify-center focus-visible:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
            >
              <motion.span
                animate={{ rotate: isMobileOpen ? 45 : 0, y: isMobileOpen ? 0 : -6 }}
                transition={{ duration: 0.25 }}
                className="absolute w-6 h-[2.5px] rounded-full bg-current"
              />
              <motion.span
                animate={{ opacity: isMobileOpen ? 0 : 1 }}
                transition={{ duration: 0.15 }}
                className="absolute w-6 h-[2.5px] rounded-full bg-current"
              />
              <motion.span
                animate={{ rotate: isMobileOpen ? -45 : 0, y: isMobileOpen ? 0 : 6 }}
                transition={{ duration: 0.25 }}
                className="absolute w-6 h-[2.5px] rounded-full bg-current"
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ backgroundColor: `${INK}F7`, borderTop: `1px solid ${SAFFRON}22` }}
            className="md:hidden overflow-hidden"
          >
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
                closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
              className="px-6 py-8 flex flex-col space-y-2"
            >
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: -16 },
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    style={
                      location.pathname === item.path
                        ? { backgroundColor: `${SAFFRON}1A`, color: SAFFRON, fontWeight: 600 }
                        : { color: PARCHMENT }
                    }
                    className="block px-6 py-4 rounded-xl text-lg font-medium transition-all active:scale-[0.98]"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -16 },
                }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  to="/contact"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ backgroundColor: SAFFRON, color: INK }}
                  className="mt-6 mx-6 py-4 text-center rounded-xl font-semibold text-base shadow-lg active:scale-[0.97] transition-all block"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWishlistOpen(false)}
              style={{ backgroundColor: `${INK}99` }}
              className="fixed inset-0 z-50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY, color: INK }}
              className="fixed right-0 top-0 h-full z-[100] shadow-2xl flex flex-col w-full sm:w-96 sm:max-w-md"
            >
              <div style={{ backgroundColor: PARCHMENT_DEEP, borderBottom: `1px dashed ${JUNIPER}44` }} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaHeart style={{ color: CLAY }} className="text-xl" />
                  <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic">My Saved Treks</h2>
                  <span style={{ fontFamily: FONT_MONO, backgroundColor: `${CLAY}14`, color: CLAY }} className="text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {wishlist.length}
                  </span>
                </div>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  style={{ color: '#5B6660' }}
                  className="p-2 rounded-lg hover:opacity-70 transition-all cursor-pointer"
                  aria-label="Close Wishlist"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div style={{ backgroundColor: `${CLAY}12`, color: CLAY }} className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <FaRegHeart className="text-3xl animate-pulse" />
                    </div>
                    <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg italic">Your wishlist is empty</h3>
                    <p className="text-sm mt-2 max-w-[240px] mx-auto" style={{ color: '#5B6660' }}>
                      Explore our trekking packages and tap the heart icon to save them for later!
                    </p>
                    <Link
                      to="/packages"
                      onClick={() => setIsWishlistOpen(false)}
                      style={{ backgroundColor: INK, color: SAFFRON }}
                      className="mt-6 px-6 py-2.5 rounded-lg font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md"
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
                        style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
                        className="flex gap-4 p-3 rounded-xl hover:shadow-md transition-all group"
                      >
                        <div style={{ backgroundColor: PARCHMENT, border: `1px solid ${JUNIPER}22` }} className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative">
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
                              style={{ fontFamily: FONT_DISPLAY, color: INK }}
                              className="italic text-base line-clamp-1 block hover:opacity-70"
                            >
                              {trek.name}
                            </Link>
                            <span style={{ fontFamily: FONT_MONO, color: '#5B6660' }} className="text-xs">{trek.location}</span>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <span style={{ fontFamily: FONT_MONO, color: CLAY }} className="font-bold text-sm">
                              Rs. {trek.price.toLocaleString()}
                            </span>
                            <button
                              onClick={() => toggleWishlist(trek.id)}
                              style={{ color: '#8A8272' }}
                              className="p-1.5 rounded-lg hover:opacity-70 transition-all cursor-pointer"
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

              {wishlist.length > 0 && (
                <div style={{ backgroundColor: PARCHMENT_DEEP, borderTop: `1px dashed ${JUNIPER}44` }} className="p-6 space-y-3">
                  <div className="flex justify-between text-sm" style={{ color: '#5B6660' }}>
                    <span>Saved treks</span>
                    <span style={{ fontFamily: FONT_MONO, color: INK }} className="font-semibold">{wishlist.length} Items</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={clearWishlist}
                      style={{ backgroundColor: PARCHMENT, borderColor: `${JUNIPER}44`, color: '#5B6660' }}
                      className="flex-1 py-3 border rounded-lg text-sm font-semibold active:scale-95 transition-all cursor-pointer"
                    >
                      Clear All
                    </button>
                    <Link
                      to="/packages"
                      onClick={() => setIsWishlistOpen(false)}
                      style={{ backgroundColor: INK, color: SAFFRON }}
                      className="flex-1 py-3 rounded-lg text-sm font-semibold text-center hover:scale-[1.02] active:scale-95 transition-all shadow-md"
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