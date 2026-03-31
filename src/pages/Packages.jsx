// src/pages/Packages.jsx
import { useState, useEffect } from 'react';
import { treks } from '../data/treks';
import React from 'react';

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
  FaHeart 
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
  const [showAlert, setShowAlert] = useState({ show: false, title: '', message: '', type: 'success' });

  const itemsPerPage = 6;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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
      setShowAlert({
        show: true,
        title: 'Cart Limit',
        message: 'You can only book one package at a time. Remove current item first.',
        type: 'error',
      });
      return;
    }
    setCart({ name: trek.name, price: trek.price });
    setShowAlert({
      show: true,
      title: 'Added to Cart!',
      message: `${trek.name} added successfully. Click cart icon to view.`,
      type: 'success',
    });
  };

  const removeFromCart = () => {
    setCart(null);
    setShowAlert({
      show: true,
      title: 'Item Removed',
      message: 'The item has been removed from your cart.',
      type: 'success',
    });
  };

  const clearCart = () => {
    setCart(null);
    setShowAlert({
      show: true,
      title: 'Cart Cleared',
      message: 'All items removed from cart.',
      type: 'success',
    });
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="mt-10 sm:mt-12 flex justify-center gap-2 sm:gap-3 flex-wrap">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300 text-lg"
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
                ? 'bg-green-600 text-white scale-105 shadow-md'
                : 'bg-white text-slate-700 hover:bg-green-600 hover:text-white'
            }`}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 sm:px-5 sm:py-3 rounded-lg border border-gray-300 hover:bg-green-600 hover:text-white transition-all duration-300 text-lg"
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
     <header 
  className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center text-center text-white overflow-hidden"
  style={{
    backgroundImage: `url('src/assets/img/image.png')`,  
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="absolute inset-0 bg-black/65" />  

  <div className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent leading-tight drop-shadow-lg animate-on-scroll">
      Our Trekking Packages
    </h1>
    <p className="mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-slate-100 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
      Find Your Perfect Himalayan Journey
    </p>
    <a
      href="#treks"
      className="mt-8 sm:mt-10 inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg animate-on-scroll"
      style={{ animationDelay: '0.4s' }}
    >
      <GiHiking className="text-xl sm:text-2xl" />
      Explore Adventures
    </a>
  </div>
</header>

      {/* Main Content */}
      <section id="treks" className="py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 animate-on-scroll">
              Our Trekking Packages
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              Choose your next adventure from our most beloved trekking routes in the Himalayas.
            </p>
          </div>

          {/* Search + Sort */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <MdOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
              <input
                type="text"
                placeholder="Search treks by name, location, or duration..."
                value={currentSearch}
                onChange={(e) => {
                  setCurrentSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
            </div>

            <select
              value={currentSort}
              onChange={(e) => {
                setCurrentSort(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 text-base"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration-asc">Duration: Short to Long</option>
              <option value="duration-desc">Duration: Long to Short</option>
            </select>
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
                className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-300 ${
                  currentFilter === filter
                    ? 'bg-green-800 text-white scale-105 shadow-lg'
                    : 'border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white'
                }`}
              >
                {filter === 'all' ? (
                  <>
                    <GiMountainRoad className="inline mr-2 text-lg" /> All Treks
                  </>
                ) : filter === 'moderate' ? (
                  <>
                    <GiHiking className="inline mr-2 text-lg" /> Moderate
                  </>
                ) : (
                  <>
                    <FaMountain className="inline mr-2 text-lg" /> Challenging
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center text-slate-600 text-base sm:text-lg">
            Showing <span className="font-bold text-green-600">{filteredTreks.length}</span> trekking packages
          </div>

          {/* Trek Grid */}
          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginatedTreks.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <BsCart className="mx-auto text-7xl text-gray-300 mb-4" />
                <h3 className="text-2xl font-semibold text-slate-600">No treks found</h3>
                <p className="mt-3 text-slate-500">Try adjusting your search or filter</p>
              </div>
            ) : (
              paginatedTreks.map((trek, index) => (
                <div
                  key={trek.name}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 animate-on-scroll group"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={trek.image}
                      alt={trek.name}
                      className="w-full h-56 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
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

                  <div className="p-6">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{trek.name}</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                        {trek.category.charAt(0).toUpperCase() + trek.category.slice(1)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center text-slate-600 text-sm sm:text-base">
                      <FaMapMarkerAlt className="mr-2 text-green-600 text-lg" />
                      {trek.location}, Nepal
                    </div>

                    <p className="mt-3 text-slate-600 text-sm sm:text-base line-clamp-3">{trek.description}</p>

                    <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <span className="text-2xl sm:text-3xl font-bold text-green-700">
                          Rs. {trek.price.toLocaleString()}
                        </span>
                        <p className="text-sm text-slate-500">per person</p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => addToCart(trek)}
                          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                        >
                          <FaCartPlus className="text-lg" /> Add
                        </button>
                        <a
                          href={trek.link}
                          className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2 text-sm sm:text-base"
                        >
                          <FaInfoCircle className="text-lg" /> Details
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

         
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 animate-on-scroll">
              Why Choose Nepal Treks?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto animate-on-scroll" style={{ animationDelay: '0.2s' }}>
              Experience the Himalayas with confidence and comfort
            </p>
          </div>

          <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <FaShieldAlt className="text-4xl" />, title: 'Safety First', desc: 'Certified guides, emergency protocols, and comprehensive insurance.' },
              { icon: <FaAward className="text-4xl" />, title: 'Expert Guides', desc: 'Local guides with 10+ years experience and deep Himalayan knowledge.' },
              { icon: <FaHeart className="text-4xl" />, title: 'Sustainable Tourism', desc: 'Eco-friendly practices supporting local communities and nature.' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="text-center p-6 md:p-8 rounded-2xl bg-white shadow-lg hover:scale-105 transition-all duration-300 animate-on-scroll"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-700">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4">{item.title}</h3>
                <p className="text-slate-600 text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setShowCartModal(false)}>
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-3">
                <BsCartCheck className="text-green-600 text-3xl" />
                Your Cart
              </h3>
              <button onClick={() => setShowCartModal(false)} className="text-3xl text-slate-500 hover:text-slate-800">
                ×
              </button>
            </div>

            {cart ? (
              <div className="border-b pb-6 mb-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div className="text-lg sm:text-xl font-semibold">{cart.name}</div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-green-700">
                      Rs. {cart.price.toLocaleString()}
                    </div>
                    <button
                      onClick={removeFromCart}
                      className="text-red-600 hover:text-red-800 text-sm mt-2 flex items-center gap-1.5"
                    >
                      <FaMountain className="text-base" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500">
                <BsCart className="mx-auto text-8xl mb-4 text-gray-300" />
                <p className="text-lg sm:text-xl">Your cart is empty</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-lg sm:text-xl font-semibold w-full sm:w-auto text-center sm:text-left">
                Total: <span className="text-green-700">Rs. {cart ? cart.price.toLocaleString() : '0'}</span>
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
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-base sm:text-lg"
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlert.show && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center animate-scaleIn">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              showAlert.type === 'error' ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {showAlert.type === 'error' ? (
                <FaMountain className="text-4xl text-red-600" />
              ) : (
                <GiBackpack className="text-4xl text-green-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-4">{showAlert.title}</h3>
            <p className="text-slate-600 mb-8 text-base sm:text-lg">{showAlert.message}</p>
            <button
              onClick={() => setShowAlert({ show: false })}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-base sm:text-lg"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Floating Cart Button */}
      <button
        onClick={() => setShowCartModal(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-green-600 text-white p-5 sm:p-6 rounded-full shadow-2xl hover:bg-green-700 transition-all duration-300 z-40 hover:scale-110"
      >
        <BsCart className="text-2xl sm:text-3xl" />
        {cart && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs sm:text-sm font-bold w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-md">
            1
          </span>
        )}
      </button>
    </div>
  );
}