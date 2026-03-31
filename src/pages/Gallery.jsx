/* eslint-disable react-hooks/immutability */
// src/pages/Gallery.jsx
import { useState, useEffect } from 'react';
import { galleryData } from '../data/galleryData';
import React from 'react';

// Icons from react-icons
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaTimes, 
  FaImages 
} from 'react-icons/fa';

import { GiMountainRoad } from 'react-icons/gi';

export default function Gallery() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(galleryData);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Scroll animations
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

  // Testimonial auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 4);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Filter logic
  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredData(galleryData);
    } else {
      setFilteredData(galleryData.filter((item) => item.category === currentFilter));
    }
  }, [currentFilter]);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredData.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === filteredData.length - 1 ? 0 : prev + 1
    );
  };

  const selectedImage = selectedImageIndex !== null ? filteredData[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50">
     
      <header 
        className="relative min-h-[50vh] sm:min-h-[60vh] flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('src/assets/img/gallery.avif')`,  
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/65" />  

        <div className="relative z-10 px-5 sm:px-8 max-w-4xl mx-auto">
          <h1
            className="
              text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold
              bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-lg animate-on-scroll
            "
          >
            Gallery
          </h1>
          <p
            className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-slate-100 animate-on-scroll"
            style={{ animationDelay: '0.2s' }}
          >
            Moments That Take Your Breath Away
          </p>
          <a
            href="#gallery"
            className="
              mt-6 sm:mt-8 inline-flex items-center gap-2 
              bg-gradient-to-r from-green-600 to-emerald-700
              hover:from-green-700 hover:to-emerald-800
              text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base
              transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md
              animate-on-scroll
            "
            style={{ animationDelay: '0.4s' }}
          >
            <FaImages className="text-lg sm:text-xl" />
            Explore Gallery
          </a>
        </div>
      </header>

     
      <section id="gallery" className="py-16 md:py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 animate-on-scroll">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-4">
              Our Stunning Photo Gallery
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Capturing the magic of the Himalayas – peaks, valleys, culture & memories.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-10 md:mb-14">
            {['all', 'everest', 'annapurna', 'langtang', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                className={`
                  px-6 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300
                  ${currentFilter === cat
                    ? 'bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg scale-105'
                    : 'border-2 border-green-600 text-green-700 hover:bg-gradient-to-r hover:from-green-600 hover:to-green-800 hover:text-white hover:scale-105'}
                `}
              >
                {cat === 'all' ? 'All Photos' : (
                  <>
                    <GiMountainRoad className="inline mr-2 text-base sm:text-lg" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-md cursor-pointer animate-on-scroll hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 60}ms` }}
                onClick={() => openModal(index)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4 sm:p-5">
                  <h3 className="text-white text-base sm:text-lg font-semibold line-clamp-1">
                    {item.alt}
                  </h3>
                  <p className="text-gray-200 text-xs sm:text-sm mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-20 lg:py-28 bg-green-50/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-10 md:mb-12 animate-on-scroll">
            What Our Trekkers Say
          </h2>

          <div className="relative max-w-4xl mx-auto h-64 sm:h-72 md:h-80 overflow-hidden px-4">
            {[
              { text: "The Everest Base Camp trek was life-changing! The views are unreal, and the team made everything seamless.", author: "Sabin Khatri, Belbari, Nepal" },
              { text: "Annapurna Circuit exceeded all expectations. Poon Hill sunrise is a must-see moment!", author: "Narendra Chapagain, Sankhuwasabha, Nepal" },
              { text: "Langtang Valley felt like a hidden gem – peaceful, beautiful, and authentic Nepal.", author: "Suman Parajuli, Chatara, Nepal" },
              { text: "Manaslu & Upper Mustang were the adventure of a lifetime – remote and incredibly rewarding.", author: "Sulok Pokhrel, Khorsane, Nepal" },
            ].map((t, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col justify-center items-center transition-opacity duration-1000 ${
                  i === currentTestimonial ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <p className="text-base sm:text-lg md:text-xl italic text-slate-700 max-w-3xl px-4">
                  "{t.text}"
                </p>
                <span className="mt-6 font-semibold text-green-700 text-sm sm:text-base">
                  — {t.author}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white w-12 h-12 rounded-full flex items-center justify-center bg-black/50 hover:bg-green-600 transition"
            onClick={closeModal}
          >
            <FaTimes className="text-2xl" />
          </button>

          <button
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full flex items-center justify-center bg-black/50 hover:bg-green-600 transition"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <FaChevronLeft className="text-2xl" />
          </button>

          <button
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full flex items-center justify-center bg-black/50 hover:bg-green-600 transition"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <FaChevronRight className="text-2xl" />
          </button>

          <div className="relative w-full max-w-[95vw] sm:max-w-5xl md:max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 sm:p-8 rounded-b-xl sm:rounded-b-2xl">
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {selectedImage.alt}
              </h3>
              <p className="text-gray-200 text-sm sm:text-base md:text-lg">
                {selectedImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}