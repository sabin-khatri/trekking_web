// src/pages/Packages.jsx
import React, { useState, useEffect } from 'react';
import { treks } from '../data/treks';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../components/ToastContext';
import { Link } from 'react-router-dom';
import AnimatedMap from '../components/features/AnimatedMap';
import SEO from '../components/common/SEO';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';

// Import only used icons (tree-shaking friendly)
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
  FaList
} from 'react-icons/fa';

import { 
  GiHiking, 
  GiMountainRoad, 
  GiBackpack 
} from 'react-icons/gi';

import { BsCart, BsCartCheck } from 'react-icons/bs';
import { MdOutlineSearch } from 'react-icons/md';

export default function Packages() {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('default');
  const [currentSearch, setCurrentSearch] = useState('');
  const [cart, setCart] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const { addToast } = useToast();

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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-10 sm:mt-12 flex justify-center gap-2 sm:gap-3 flex-wrap">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-gray-300   hover:bg-green-600 :bg-green-500 hover:text-white transition-all duration-300 text-lg"
          >
            <FaChevronLeft />
          </button>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 sm:px-5 sm:py-3 rounded-lg border transition-all duration-300 text-base sm:text-lg ${
              page === currentPage
                ? 'bg-green-600  text-white border-transparent scale-105 shadow-md'
                : 'bg-white  text-slate-700  border-gray-300  hover:bg-green-600 :bg-green-500 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-gray-300   hover:bg-green-600 :bg-green-500 hover:text-white transition-all duration-300 text-lg"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50  transition-colors duration-300">
      <SEO 
        title="Trekking Packages" 
        description="Browse our carefully curated trekking packages across Nepal, including Everest Base Camp, Annapurna Circuit, and more."
      />
      {/* Hero */}
      <header 
        className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            backgroundImage: `url(${IMAGES.hero.packages})`,  
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-black/65" />  

        <div className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200 bg-clip-text text-transparent leading-tight drop-shadow-xl"
          >
            Our Trekking Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-slate-100"
          >
            Find Your Perfect Himalayan Journey
          </motion.p>
        </div>
      </header>

      <AnimatedMap />

      {/* Main Content */}
      <section id="treks" className="py-16 md:py-20 lg:py-28 bg-white  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 "
            >
              Our Trekking Packages
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 "
            >
              Choose your next adventure from our most beloved trekking routes in the Himalayas.
            </motion.p>
          </div>

          {/* Search + Sort */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500  text-xl" />
              <input
                type="text"
                placeholder="Search treks by name, location, or duration..."
                value={currentSearch}
                onChange={(e) => {
                  setCurrentSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base transition-all shadow-sm hover:shadow-md"
              />
            </div>

            <select
              value={currentSort}
              onChange={(e) => {
                setCurrentSort(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3.5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 text-base transition-all shadow-sm hover:shadow-md outline-none"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
            
            <div className="flex gap-2 bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-emerald-600 scale-105' : 'text-slate-500 hover:text-emerald-500'}`}
              >
                <FaThLarge />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-emerald-600 scale-105' : 'text-slate-500 hover:text-emerald-500'}`}
              >
                <FaList />
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            {['all', 'moderate', 'challenging'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setCurrentFilter(filter);
                  setCurrentPage(1);
                }}
                className={`px-7 py-3.5 rounded-full font-medium text-base transition-all duration-300 ${
                  currentFilter === filter
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white scale-105 shadow-lg shadow-emerald-600/30 border-transparent'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'
                }`}
              >
                {filter === 'all' ? (
                  <><GiMountainRoad className="inline mr-2 text-lg" /> All Treks</>
                ) : filter === 'moderate' ? (
                  <><GiHiking className="inline mr-2 text-lg" /> Moderate</>
                ) : (
                  <><FaMountain className="inline mr-2 text-lg" /> Challenging</>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-slate-600  text-base sm:text-lg">
            Showing <span className="font-bold text-green-600 ">{filteredTreks.length}</span> trekking packages
          </div>

          {/* Trek Grid/List */}
          <motion.div 
            layout
            className={`mt-10 grid gap-6 sm:gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
          >
            <AnimatePresence mode="popLayout">
              {paginatedTreks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="col-span-full text-center py-16"
                >
                  <BsCart className="mx-auto text-7xl text-gray-300  mb-4" />
                  <h3 className="text-2xl font-semibold text-slate-600 ">No treks found</h3>
                  <p className="mt-3 text-slate-500 ">Try adjusting your search or filter</p>
                </motion.div>
              ) : (
                paginatedTreks.map((trek, index) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    key={trek.name}
                    className={`bg-white  rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group border border-transparent  ${viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === 'list' ? 'sm:w-1/3' : ''}`}>
                      <img
                        src={trek.image}
                        alt={trek.name}
                        className={`w-full ${viewMode === 'list' ? 'h-full object-cover min-h-[200px]' : 'h-56 sm:h-64 object-cover'} transition-transform duration-500 group-hover:scale-105`}
                        loading="lazy"
                      />
                      {trek.featured && (
                        <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                          Featured
                        </span>
                      )}
                      <span className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                        {trek.duration} Days
                      </span>
                    </div>

                    <div className={`p-6 ${viewMode === 'list' ? 'sm:w-2/3 flex flex-col justify-center' : ''}`}>
                      <div className="flex justify-between items-start gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 ">{trek.name}</h3>
                        <span className="bg-green-100  text-green-800  px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap border ">
                          {trek.category.charAt(0).toUpperCase() + trek.category.slice(1)}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center text-slate-600  text-sm sm:text-base">
                        <FaMapMarkerAlt className="mr-2 text-green-600  text-lg" />
                        {trek.location}, Nepal
                      </div>

                      <p className="mt-3 text-slate-600  text-sm sm:text-base line-clamp-3">{trek.description}</p>

                      <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <span className="text-2xl sm:text-3xl font-bold text-green-700 ">
                            Rs. {trek.price.toLocaleString()}
                          </span>
                          <p className="text-sm text-slate-500 ">per person</p>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => addToCart(trek)}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base shadow-lg shadow-emerald-600/30"
                          >
                            <FaCartPlus className="text-lg" /> Add
                          </button>
                          <Link
                            to={`/packages/${trek.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                          >
                            <FaInfoCircle className="text-lg" /> Details
                          </Link>
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-green-50 to-blue-50   transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 "
            >
              Why Choose Nepal Treks?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl text-slate-600  max-w-3xl mx-auto"
            >
              Experience the Himalayas with confidence and comfort
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <FaShieldAlt className="text-4xl" />, title: 'Safety First', desc: 'Certified guides, emergency protocols, and comprehensive insurance.' },
              { icon: <FaAward className="text-4xl" />, title: 'Expert Guides', desc: 'Local guides with 10+ years experience and deep Himalayan knowledge.' },
              { icon: <FaHeart className="text-4xl" />, title: 'Sustainable Tourism', desc: 'Eco-friendly practices supporting local communities and nature.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center p-6 md:p-8 rounded-2xl bg-white  shadow-lg hover:scale-105 transition-transform duration-300 border border-transparent "
              >
                <div className="w-20 h-20 bg-green-100  rounded-full flex items-center justify-center mx-auto mb-6 text-green-700 ">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800  mb-4">{item.title}</h3>
                <p className="text-slate-600  text-base">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCartModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" 
            onClick={() => setShowCartModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white  rounded-2xl p-6 sm:p-8 max-w-lg w-full border border-transparent " 
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-800  flex items-center gap-3">
                  <BsCartCheck className="text-green-600  text-3xl" />
                  Your Cart
                </h3>
                <button onClick={() => setShowCartModal(false)} className="text-3xl text-slate-500  hover:text-slate-800 :text-white">
                  ×
                </button>
              </div>

              {cart ? (
                <div className="border-b  pb-6 mb-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="text-lg sm:text-xl font-semibold ">{cart.name}</div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-green-700 ">
                        Rs. {cart.price.toLocaleString()}
                      </div>
                      <button
                        onClick={removeFromCart}
                        className="text-red-600  hover:text-red-800 :text-red-300 text-sm mt-2 flex items-center gap-1.5"
                      >
                        <FaMountain className="text-base" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 ">
                  <BsCart className="mx-auto text-8xl mb-4 text-gray-300 " />
                  <p className="text-lg sm:text-xl">Your cart is empty</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
                <div className="text-lg sm:text-xl font-semibold w-full sm:w-auto text-center sm:text-left ">
                  Total: <span className="text-green-700 ">Rs. {cart ? cart.price.toLocaleString() : '0'}</span>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  {cart && (
                    <button
                      onClick={clearCart}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-base sm:text-lg"
                    >
                      Clear Cart
                    </button>
                  )}
                  <button
                    onClick={() => setShowCartModal(false)}
                    className="flex-1 px-6 py-3 bg-green-600  text-white rounded-lg hover:bg-green-700 :bg-green-600 transition text-base sm:text-lg"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowCartModal(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-5 sm:p-6 rounded-full shadow-2xl hover:shadow-emerald-600/50 transition-all z-40"
      >
        <BsCart className="text-2xl sm:text-3xl" />
        {cart && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs sm:text-sm font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md">
            1
          </span>
        )}
      </motion.button>
    </div>
  );
}
