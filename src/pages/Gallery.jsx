// src/pages/Gallery.jsx
import { useState, useEffect, useCallback } from 'react';
import { galleryData } from '../data/galleryData';
import React from 'react';

// Icons
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
      { threshold: 0.15 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Testimonial auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 4);
    }, 5000);

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

  // Keyboard navigation for lightbox (Fixed with useCallback)
  const closeModal = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = '';
  }, []);

  const prevImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? filteredData.length - 1 : prev - 1
    );
  }, [filteredData.length]);

  const nextImage = useCallback(() => {
    setSelectedImageIndex((prev) =>
      prev === filteredData.length - 1 ? 0 : prev + 1
    );
  }, [filteredData.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, closeModal, prevImage, nextImage]);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const selectedImage = selectedImageIndex !== null ? filteredData[selectedImageIndex] : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header - Same as before (kept clean) */}
      <header 
        className="relative min-h-[55vh] sm:min-h-[65vh] flex items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url('/src/assets/img/gallery.avif')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6">
            <GiMountainRoad className="text-2xl text-emerald-300" />
            <span className="text-emerald-200 text-sm font-medium tracking-widest">HIMALAYAN MOMENTS</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white animate-on-scroll">
            Our Gallery
          </h1>
          <p className="mt-4 text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto animate-on-scroll" style={{ animationDelay: '0.2s' }}>
            Moments that take your breath away
          </p>

          <a
            href="#gallery"
            className="mt-10 inline-flex items-center gap-3 bg-white text-green-800 hover:bg-emerald-50 px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 shadow-xl"
            style={{ animationDelay: '0.4s' }}
          >
            <FaImages className="text-xl" />
            Explore the Collection
          </a>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white/70 rounded-full mt-2 animate-scroll-down" />
          </div>
        </div>
      </header>

      {/* Gallery Section - Same beautiful design */}
      <section id="gallery" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-green-900 tracking-tight animate-on-scroll">
              Capturing the Himalayas
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              From towering peaks to serene valleys — every photo tells a story of adventure.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'everest', 'annapurna', 'langtang', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                className={`
                  px-7 py-3.5 rounded-2xl font-medium transition-all duration-300 text-sm sm:text-base
                  ${currentFilter === cat
                    ? 'bg-gradient-to-r from-green-700 to-emerald-700 text-white shadow-lg scale-105'
                    : 'bg-white border border-green-200 text-green-700 hover:border-green-600 hover:text-green-800 hover:shadow-md'}
                `}
              >
                {cat === 'all' ? 'All Photos' : (
                  <>
                    <GiMountainRoad className="inline mr-2" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredData.map((item, index) => (
              <div
                key={index}
                onClick={() => openModal(index)}
                className="group relative overflow-hidden rounded-2xl shadow-md cursor-pointer hover:shadow-2xl transition-all duration-500 animate-on-scroll"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-white text-lg font-semibold line-clamp-1">{item.alt}</h3>
                  <p className="text-white/80 text-sm mt-1.5 line-clamp-2">{item.description}</p>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  {item.category === 'all' ? 'Himalaya' : item.category.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Same */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-green-900 mb-4 animate-on-scroll">
            Voices from the Trail
          </h2>
          <p className="text-slate-600 mb-12">Real stories from real trekkers</p>

          <div className="relative h-80 sm:h-72 mx-auto">
            {[
              { text: "The Everest Base Camp trek was life-changing! The views are unreal, and the team made everything seamless.", author: "Sabin Khatri, Belbari, Nepal" },
              { text: "Annapurna Circuit exceeded all expectations. Poon Hill sunrise is a must-see moment!", author: "Narendra Chapagain, Sankhuwasabha, Nepal" },
              { text: "Langtang Valley felt like a hidden gem – peaceful, beautiful, and authentic Nepal.", author: "Suman Parajuli, Chatara, Nepal" },
              { text: "Manaslu & Upper Mustang were the adventure of a lifetime – remote and incredibly rewarding.", author: "Sulok Pokhrel, Khorsane, Nepal" },
            ].map((testimonial, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-all duration-700 flex flex-col justify-center items-center px-6
                  ${i === currentTestimonial ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
              >
                <div className="max-w-3xl">
                  <p className="text-xl sm:text-2xl italic leading-relaxed text-slate-700">
                    “{testimonial.text}”
                  </p>
                  <div className="mt-8 text-green-700 font-medium">
                    — {testimonial.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 text-white bg-black/50 hover:bg-red-600 w-14 h-14 rounded-full flex items-center justify-center transition-all z-10"
          >
            <FaTimes className="text-3xl" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-green-700 w-14 h-14 rounded-full flex items-center justify-center transition-all"
          >
            <FaChevronLeft className="text-3xl" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-green-700 w-14 h-14 rounded-full flex items-center justify-center transition-all"
          >
            <FaChevronRight className="text-3xl" />
          </button>

          <div 
            className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8 rounded-b-2xl">
              <h3 className="text-white text-2xl sm:text-3xl font-bold">{selectedImage.alt}</h3>
              <p className="text-white/80 mt-2 text-base sm:text-lg">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}