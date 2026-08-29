/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { treks } from '../data/treks';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useToast } from '../components/ToastContext';
import { Link } from 'react-router-dom';
import AnimatedMap from '../components/features/AnimatedMap';
import SEO from '../components/common/SEO';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';
import { useWishlist } from '../components/WishlistContext';

import {
  FaMountain,
  FaMapMarkerAlt,
  FaCartPlus,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
  FaAward,
  FaHeart,
  FaThLarge,
  FaList,
  FaRegClock,
  FaTag
} from 'react-icons/fa';

import {
  GiHiking,
  GiMountainRoad,
  GiBackpack
} from 'react-icons/gi';

import { BsCart, BsCartCheck } from 'react-icons/bs';
import { MdOutlineSearch } from 'react-icons/md';

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: '-80px' };

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';
const ICE = '#6E93A3';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function Packages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('default');
  const [currentSearch, setCurrentSearch] = useState('');
  const [cart, setCart] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const { addToast } = useToast();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const prefersReducedMotion = useReducedMotion();

  const itemsPerPage = 6;

  const getFilteredTreks = () => {
    let filtered = [...treks];

    if (currentSearch.trim()) {
      const term = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.location.toLowerCase().includes(term) ||
          t.description.toLowerCase().includes(term) ||
          t.duration.toString().includes(term)
      );
    }

    if (currentFilter !== 'all') {
      filtered = filtered.filter((t) => t.category === currentFilter);
    }

    if (currentSort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (currentSort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (currentSort === 'duration-asc') filtered.sort((a, b) => a.duration - b.duration);
    if (currentSort === 'duration-desc') filtered.sort((a, b) => b.duration - a.duration);

    return filtered;
  };

  const filteredTreks = getFilteredTreks();
  const totalPages = Math.ceil(filteredTreks.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedTreks = filteredTreks.slice(start, start + itemsPerPage);

  const addToCart = (trek) => {
    if (cart && cart.name !== trek.name) {
      addToast('You can only book one package at a time. Remove current item first.', 'error');
      return;
    }
    setCart({ name: trek.name, price: trek.price });
    addToast(`${trek.name} added successfully.`, 'success');
  };

  const removeFromCart = () => {
    setCart(null);
    addToast('The item has been removed from your cart.', 'info');
  };

  const clearCart = () => {
    setCart(null);
    addToast('All items removed from cart.', 'info');
  };

  const categoryStyles = {
    moderate: { color: ICE, borderColor: `${ICE}55`, backgroundColor: `${ICE}14` },
    challenging: { color: CLAY, borderColor: `${CLAY}55`, backgroundColor: `${CLAY}14` },
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-10 sm:mt-12 flex justify-center gap-2 sm:gap-3 flex-wrap">
        {currentPage > 1 && (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setCurrentPage((p) => p - 1)}
            style={{ borderColor: `${JUNIPER}44`, color: INK, fontFamily: FONT_MONO }}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-md border transition-colors duration-300 text-lg hover:text-white"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = INK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FaChevronLeft />
          </motion.button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setCurrentPage(page)}
            style={
              page === currentPage
                ? { backgroundColor: INK, color: PARCHMENT, borderColor: INK, fontFamily: FONT_MONO }
                : { backgroundColor: PARCHMENT, color: INK, borderColor: `${JUNIPER}44`, fontFamily: FONT_MONO }
            }
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-md border transition-colors duration-300 text-base sm:text-lg"
          >
            {page}
          </motion.button>
        ))}

        {currentPage < totalPages && (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => setCurrentPage((p) => p + 1)}
            style={{ borderColor: `${JUNIPER}44`, color: INK, fontFamily: FONT_MONO }}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-md border transition-colors duration-300 text-lg hover:text-white"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = INK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FaChevronRight />
          </motion.button>
        )}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="min-h-screen transition-colors duration-300">
      <SEO
        title="Trekking Packages"
        description="Browse our carefully curated trekking packages across Nepal, including Everest Base Camp, Annapurna Circuit, and more."
      />

      <header
        className="relative h-[55vh] sm:h-[62vh] flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={{ scale: prefersReducedMotion ? 1 : 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: EASE }}
          style={{
            backgroundImage: `url(${IMAGES.hero.packages})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.5
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}D9 0%, ${INK}88 50%, ${INK}F5 100%)` }} />

        <div
          className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 rotate-[-3deg] border-2 rounded px-4 py-1.5 z-10 sm:z-20"
          style={{ borderColor: SAFFRON }}
        >
          <span style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="text-[11px] tracking-[0.3em] uppercase">
            Route Manifest
          </span>
        </div>

        <div className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-normal leading-tight"
          >
            Our Trekking Packages
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light"
            style={{ color: '#D8D2C4' }}
          >
            Find Your Perfect Himalayan Journey
          </motion.p>
        </div>
      </header>

      <AnimatedMap />

      <section id="treks" className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontFamily: FONT_MONO, color: CLAY }}
              className="text-xs tracking-[0.2em] uppercase mb-3"
            >
              Choose Your Route
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{ fontFamily: FONT_DISPLAY, color: INK }}
              className="text-3xl sm:text-4xl md:text-5xl italic font-normal"
            >
              Our Trekking Packages
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl"
              style={{ color: '#5B6660' }}
            >
              Choose your next adventure from our most beloved trekking routes in the Himalayas.
            </motion.p>
          </div>

          <div className="mt-10 flex flex-col gap-4 max-w-4xl mx-auto">
            <div className="relative">
              <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: JUNIPER }} />
              <input
                type="text"
                placeholder="Search treks by name, location, or duration..."
                value={currentSearch}
                onChange={(e) => {
                  setCurrentSearch(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ borderColor: `${JUNIPER}44`, color: INK, fontFamily: FONT_BODY }}
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border bg-white text-base focus:outline-none focus:ring-2 transition-shadow shadow-sm hover:shadow-md"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={currentSort}
                onChange={(e) => {
                  setCurrentSort(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ borderColor: `${JUNIPER}44`, color: INK, fontFamily: FONT_MONO }}
                className="flex-1 min-w-0 px-4 py-3.5 rounded-lg border bg-white text-sm sm:text-base transition-shadow shadow-sm hover:shadow-md outline-none"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration: Short to Long</option>
                <option value="duration-desc">Duration: Long to Short</option>
              </select>

              <div className="flex gap-2 p-1.5 rounded-lg shrink-0" style={{ backgroundColor: PARCHMENT_DEEP }}>
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  style={viewMode === 'grid' ? { backgroundColor: INK, color: SAFFRON } : { color: JUNIPER }}
                  className="p-3 rounded-md transition-all duration-200"
                >
                  <FaThLarge />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  style={viewMode === 'list' ? { backgroundColor: INK, color: SAFFRON } : { color: JUNIPER }}
                  className="p-3 rounded-md transition-all duration-200"
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            {['all', 'moderate', 'challenging'].map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={() => {
                  setCurrentFilter(filter);
                  setCurrentPage(1);
                }}
                style={
                  currentFilter === filter
                    ? { backgroundColor: INK, color: PARCHMENT, borderColor: INK }
                    : { backgroundColor: PARCHMENT, color: INK, borderColor: `${JUNIPER}44` }
                }
                className="px-6 py-3 rounded-full font-medium text-sm sm:text-base border-2 border-dashed transition-colors duration-300"
              >
                {filter === 'all' ? (
                  <><GiMountainRoad className="inline mr-2 text-lg" /> All Treks</>
                ) : filter === 'moderate' ? (
                  <><GiHiking className="inline mr-2 text-lg" /> Moderate</>
                ) : (
                  <><FaMountain className="inline mr-2 text-lg" /> Challenging</>
                )}
              </motion.button>
            ))}
          </div>

          <div style={{ fontFamily: FONT_MONO, color: '#5B6660' }} className="mt-6 text-center text-sm sm:text-base">
            SHOWING <span style={{ color: CLAY }} className="font-bold">{filteredTreks.length}</span> ROUTES
          </div>

          <motion.div
            layout
            className={`mt-10 grid gap-6 sm:gap-8 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            <AnimatePresence mode="popLayout">
              {paginatedTreks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="col-span-full text-center py-16"
                >
                  <BsCart className="mx-auto text-7xl mb-4" style={{ color: `${JUNIPER}55` }} />
                  <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic">No treks found</h3>
                  <p className="mt-3" style={{ color: '#5B6660' }}>Try adjusting your search or filter</p>
                </motion.div>
              ) : (
                paginatedTreks.map((trek, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: EASE, delay: index * 0.06 }}
                    whileHover={{ y: -6 }}
                    key={trek.name}
                    className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                    style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
                  >
                    <div className={`relative overflow-hidden shrink-0 ${viewMode === 'list' ? 'sm:w-2/5' : ''}`}>
                      <img
                        src={trek.image}
                        alt={trek.name}
                        className={`w-full ${viewMode === 'list' ? 'h-52 sm:h-full object-cover' : 'h-56 sm:h-64 object-cover'} transition-transform duration-700 ease-out group-hover:scale-110`}
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="absolute inset-x-0 bottom-0 h-20 pointer-events-none" style={{ background: `linear-gradient(to top, ${INK}99, transparent)` }} />

                      {trek.featured && (
                        <span
                          style={{ fontFamily: FONT_MONO, backgroundColor: SAFFRON, color: INK }}
                          className="absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded shadow-md tracking-wide"
                        >
                          ★ FEATURED
                        </span>
                      )}

                      <span style={{ fontFamily: FONT_MONO, color: PARCHMENT }} className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 text-sm">
                        <FaRegClock className="text-xs opacity-90" />
                        {trek.duration} DAYS
                      </span>

                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(trek.id);
                        }}
                        style={{ backgroundColor: `${PARCHMENT}EE`, color: isInWishlist(trek.id) ? CLAY : JUNIPER }}
                        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors cursor-pointer"
                        aria-label="Add to Wishlist"
                      >
                        <FaHeart className={isInWishlist(trek.id) ? 'scale-110' : ''} />
                      </motion.button>
                    </div>

                    <div className={`relative p-6 flex flex-col ${viewMode === 'list' ? 'sm:w-3/5 justify-center' : ''}`}>
                      <div
                        className={`hidden sm:block absolute top-0 bottom-0 border-l-2 border-dashed ${viewMode === 'list' ? 'left-0' : '-left-px'}`}
                        style={{ borderColor: `${JUNIPER}33` }}
                        aria-hidden="true"
                      />

                      <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl sm:text-2xl italic leading-snug">{trek.name}</h3>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          style={{ fontFamily: FONT_MONO, color: JUNIPER, backgroundColor: `${JUNIPER}14` }}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded"
                        >
                          <FaMapMarkerAlt />
                          {trek.location}
                        </span>
                        <span
                          style={categoryStyles[trek.category] || { color: '#5B6660', borderColor: `${JUNIPER}33`, backgroundColor: PARCHMENT }}
                          className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium capitalize"
                        >
                          <FaTag className="text-[10px]" />
                          {trek.category}
                        </span>
                      </div>

                      <p className="mt-3 text-sm sm:text-base line-clamp-3" style={{ color: '#5B6660' }}>{trek.description}</p>

                      <div className="mt-5 flex items-end justify-between flex-wrap gap-4 pt-4" style={{ borderTop: `1px dashed ${JUNIPER}44` }}>
                        <div>
                          <span style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xl sm:text-2xl font-bold">
                            Rs. {trek.price.toLocaleString()}
                          </span>
                          <p className="text-xs sm:text-sm" style={{ color: '#5B6660' }}>per person</p>
                        </div>

                        <div className="flex gap-2.5">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                            onClick={() => addToCart(trek)}
                            style={{ backgroundColor: INK, color: SAFFRON }}
                            className="px-4 sm:px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 text-sm sm:text-base shadow-md"
                          >
                            <FaCartPlus className="text-lg" /> Add
                          </motion.button>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                            <Link
                              to={`/packages/${trek.id}`}
                              style={{ borderColor: JUNIPER, color: JUNIPER }}
                              className="border px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base hover:text-white"
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = JUNIPER, e.currentTarget.style.color = PARCHMENT)}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = JUNIPER)}
                            >
                              <FaInfoCircle className="text-lg" /> Details
                            </Link>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {renderPagination()}
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontFamily: FONT_MONO, color: CLAY }}
              className="text-xs tracking-[0.2em] uppercase mb-3"
            >
              Fine Print, Made Simple
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{ fontFamily: FONT_DISPLAY, color: INK }}
              className="text-3xl sm:text-4xl md:text-5xl italic font-normal"
            >
              Why Choose Nepal Treks?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl max-w-3xl mx-auto"
              style={{ color: '#5B6660' }}
            >
              Experience the Himalayas with confidence and comfort
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <FaShieldAlt className="text-3xl" />, title: 'Safety First', desc: 'Certified guides, emergency protocols, and comprehensive insurance.' },
              { icon: <FaAward className="text-3xl" />, title: 'Expert Guides', desc: 'Local guides with 10+ years experience and deep Himalayan knowledge.' },
              { icon: <FaHeart className="text-3xl" />, title: 'Sustainable Tourism', desc: 'Eco-friendly practices supporting local communities and nature.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                className="text-center p-6 md:p-8 rounded-xl"
                style={{ backgroundColor: PARCHMENT, border: `1px solid ${JUNIPER}22` }}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${JUNIPER}14`, color: JUNIPER }}>
                  {item.icon}
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl md:text-2xl italic mb-3">{item.title}</h3>
                <p className="text-sm sm:text-base" style={{ color: '#5B6660' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showCartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            style={{ backgroundColor: `${INK}99` }}
            onClick={() => setShowCartModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="rounded-xl p-6 sm:p-8 max-w-lg w-full relative"
              style={{ backgroundColor: PARCHMENT }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="absolute -top-3 left-8 w-6 h-6 rounded-full"
                style={{ backgroundColor: `${INK}99` }}
                aria-hidden="true"
              />
              <div
                className="absolute -top-3 right-8 w-6 h-6 rounded-full"
                style={{ backgroundColor: `${INK}99` }}
                aria-hidden="true"
              />

              <div className="flex justify-between items-center mb-6 pb-6" style={{ borderBottom: `1px dashed ${JUNIPER}44` }}>
                <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl sm:text-3xl italic flex items-center gap-3">
                  <BsCartCheck style={{ color: JUNIPER }} className="text-3xl" />
                  Your Cart
                </h3>
                <button onClick={() => setShowCartModal(false)} style={{ color: '#5B6660' }} className="text-3xl leading-none hover:opacity-70 transition-opacity">
                  ×
                </button>
              </div>

              {cart ? (
                <div className="pb-6 mb-6" style={{ borderBottom: `1px dashed ${JUNIPER}44` }}>
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg sm:text-xl italic">{cart.name}</div>
                    <div className="text-right">
                      <div style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xl sm:text-2xl font-bold">
                        Rs. {cart.price.toLocaleString()}
                      </div>
                      <button
                        onClick={removeFromCart}
                        style={{ color: CLAY }}
                        className="text-sm mt-2 flex items-center gap-1.5 ml-auto hover:opacity-70 transition-opacity"
                      >
                        <FaMountain className="text-base" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10" style={{ color: '#5B6660' }}>
                  <BsCart className="mx-auto text-7xl mb-4" style={{ color: `${JUNIPER}44` }} />
                  <p className="text-lg sm:text-xl">Your cart is empty</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div style={{ fontFamily: FONT_MONO, color: INK }} className="text-lg sm:text-xl font-semibold w-full sm:w-auto text-center sm:text-left">
                  TOTAL: <span style={{ color: CLAY }}>Rs. {cart ? cart.price.toLocaleString() : '0'}</span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  {cart && (
                    <button
                      onClick={clearCart}
                      style={{ backgroundColor: CLAY, color: PARCHMENT }}
                      className="flex-1 px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-base sm:text-lg"
                    >
                      Clear Cart
                    </button>
                  )}
                  <button
                    onClick={() => setShowCartModal(false)}
                    style={{ backgroundColor: INK, color: PARCHMENT }}
                    className="flex-1 px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-base sm:text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        onClick={() => setShowCartModal(true)}
        style={{ backgroundColor: INK, color: SAFFRON }}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 p-5 sm:p-6 rounded-full shadow-2xl transition-shadow z-40"
        aria-label="Open cart"
      >
        <BsCart className="text-2xl sm:text-3xl" />
        {cart && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            style={{ fontFamily: FONT_MONO, backgroundColor: SAFFRON, color: INK }}
            className="absolute -top-2 -right-2 text-xs sm:text-sm font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md"
          >
            1
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}