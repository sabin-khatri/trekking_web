import React, { useState, useEffect, useCallback, useRef } from 'react';
import { galleryData } from '../data/galleryData';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import SEO from '../components/common/SEO';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';

import {
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaImages
} from 'react-icons/fa';
import { GiMountainRoad } from 'react-icons/gi';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function Gallery() {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [filteredData, setFilteredData] = useState(galleryData);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentFilter === 'all') {
      setFilteredData(galleryData);
    } else {
      setFilteredData(galleryData.filter((item) => item.category === currentFilter));
    }
  }, [currentFilter]);

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

  const testimonials = [
    { text: "The Everest Base Camp trek was life-changing! The views are unreal, and the team made everything seamless.", author: "Sabin Khatri, Belbari, Nepal" },
    { text: "Annapurna Circuit exceeded all expectations. Poon Hill sunrise is a must-see moment!", author: "Narendra Chapagain, Sankhuwasabha, Nepal" },
    { text: "Langtang Valley felt like a hidden gem – peaceful, beautiful, and authentic Nepal.", author: "Suman Parajuli, Chatara, Nepal" },
    { text: "Manaslu & Upper Mustang were the adventure of a lifetime – remote and incredibly rewarding.", author: "Sulok Pokhrel, Khorsane, Nepal" },
  ];

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="min-h-screen transition-colors duration-300">
      <SEO title="Gallery" description={`Browse photos from ${COMPANY.name} treks across Everest, Annapurna, Langtang, and beyond.`} />

      <header
        ref={heroRef}
        className="relative min-h-[55vh] sm:min-h-[65vh] flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES.hero.gallery})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            y: backgroundY,
            opacity: 0.55
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}CC 0%, ${INK}B3 55%, ${INK}F0 100%)` }} />

        <div className="absolute top-0 left-0 right-0 flex justify-between px-3 pt-3 opacity-30" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} style={{ backgroundColor: PARCHMENT }} className="w-2.5 h-4 rounded-sm" />
          ))}
        </div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 px-6 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ borderColor: `${SAFFRON}55`, fontFamily: FONT_MONO }}
            className="inline-flex items-center gap-3 border px-5 py-2 rounded-full mb-6"
          >
            <GiMountainRoad className="text-xl" style={{ color: SAFFRON }} />
            <span style={{ color: SAFFRON }} className="text-xs tracking-[0.25em] uppercase">Himalayan Moments</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }}
            className="text-5xl sm:text-6xl md:text-7xl italic font-normal tracking-tight"
          >
            Our Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-xl sm:text-2xl max-w-2xl mx-auto font-light"
            style={{ color: '#D8D2C4' }}
          >
            Moments that take your breath away
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="#gallery"
            style={{ backgroundColor: SAFFRON, color: INK }}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-2xl"
          >
            <FaImages className="text-xl" />
            Explore the Collection
          </motion.a>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <div className="w-6 h-10 border-2 rounded-full flex justify-center" style={{ borderColor: `${PARCHMENT}66` }}>
            <div className="w-1 h-2 rounded-full mt-2 animate-scroll-down" style={{ backgroundColor: `${PARCHMENT}B3` }} />
          </div>
        </div>
      </header>

      <section id="gallery" className="py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              Contact Sheet
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-4xl sm:text-5xl italic font-normal tracking-tight">
              Capturing the Himalayas
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#5B6660' }}>
              From towering peaks to serene valleys — every photo tells a story of adventure.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['all', 'everest', 'annapurna', 'langtang', 'other'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCurrentFilter(cat)}
                style={
                  currentFilter === cat
                    ? { backgroundColor: INK, color: SAFFRON, borderColor: INK }
                    : { backgroundColor: PARCHMENT, color: INK, borderColor: `${JUNIPER}44` }
                }
                className="px-6 py-3 rounded-full font-medium transition-all duration-300 text-sm sm:text-base border-2 border-dashed"
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

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredData.map((item, index) => (
                <motion.div
                  key={item.src}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openModal(index)}
                  style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
                  className="group relative overflow-hidden rounded-lg shadow-sm cursor-pointer hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5"
                    style={{ background: `linear-gradient(to top, ${INK}E6, ${INK}33 55%, transparent)` }}
                  >
                    <h3 style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="italic text-lg line-clamp-1">{item.alt}</h3>
                    <p style={{ color: '#D8D2C4' }} className="text-sm mt-1.5 line-clamp-2">{item.description}</p>
                  </div>

                  <div
                    style={{ fontFamily: FONT_MONO, backgroundColor: `${INK}CC`, color: SAFFRON }}
                    className="absolute top-3 left-3 text-[10px] px-2 py-1 rounded tracking-widest"
                  >
                    #{String(index + 1).padStart(3, '0')}
                  </div>

                  <div
                    style={{ fontFamily: FONT_MONO, backgroundColor: `${INK}CC`, color: PARCHMENT }}
                    className="absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full tracking-wide"
                  >
                    {item.category === 'all' ? 'HIMALAYA' : item.category.toUpperCase()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: FONT_MONO, color: CLAY }}
            className="text-xs tracking-[0.2em] uppercase mb-3"
          >
            Postcards Home
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: FONT_DISPLAY, color: INK }}
            className="text-4xl sm:text-5xl italic font-normal mb-4"
          >
            Voices from the Trail
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-12"
            style={{ color: '#5B6660' }}
          >
            Real stories from real trekkers
          </motion.p>

          <div className="relative h-80 sm:h-72 mx-auto overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col justify-center items-center px-6"
              >
                <div className="max-w-3xl rounded-xl p-8 sm:p-10" style={{ backgroundColor: PARCHMENT, border: `1px dashed ${JUNIPER}44` }}>
                  <p style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl sm:text-2xl italic leading-relaxed">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div style={{ fontFamily: FONT_MONO, color: JUNIPER }} className="mt-8 text-sm tracking-wide">
                    — {testimonials[currentTestimonial].author}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImageIndex !== null && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ backgroundColor: `${INK}F2` }}
            onClick={closeModal}
          >
            <button
              onClick={closeModal}
              style={{ backgroundColor: `${PARCHMENT}22`, color: PARCHMENT }}
              className="absolute top-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all z-10 hover:opacity-80"
            >
              <FaTimes className="text-2xl" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              style={{ backgroundColor: `${PARCHMENT}22`, color: PARCHMENT }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              style={{ backgroundColor: `${PARCHMENT}22`, color: PARCHMENT }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-lg overflow-hidden shadow-2xl" style={{ backgroundColor: PARCHMENT, padding: '14px 14px 90px' }}>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="max-h-[70vh] w-auto object-contain"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-[11px] tracking-widest mb-2">
                    FRAME #{String(selectedImageIndex + 1).padStart(3, '0')} — {selectedImage.category === 'all' ? 'HIMALAYA' : selectedImage.category.toUpperCase()}
                  </p>
                  <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl sm:text-2xl italic">{selectedImage.alt}</h3>
                  <p style={{ color: '#5B6660' }} className="mt-2 text-sm sm:text-base">{selectedImage.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}