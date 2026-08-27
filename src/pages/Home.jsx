import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

import {
  FaMountain,
  FaCompass,
  FaLeaf,
  FaMapMarkedAlt,
  FaPlaneDeparture,
  FaCameraRetro,
  FaChevronDown,
  FaPaperPlane
} from 'react-icons/fa';

import {
  GiMountainRoad,
  GiHiking,
  GiBackpack
} from 'react-icons/gi';

import { HiOutlineShieldCheck } from 'react-icons/hi';
import Testimonials from '../components/features/Testimonials';
import FAQ from '../components/features/FAQ';
import WeatherWidget from '../components/features/WeatherWidget';
import SeasonsGuide from '../components/features/SeasonsGuide';
import SafetyGuide from '../components/features/SafetyGuide';
import TrustBar from '../components/TrustBar';
import SEO from '../components/common/SEO';
import InteractiveMap from '../components/features/InteractiveMap';
import Stats from '../components/features/Stats';
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: '-80px' };

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function Home() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '30%']);
  const ridgeY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '12%']);
  const textY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '120%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  const features = [
    { icon: <GiMountainRoad />, title: 'Expert Guides', desc: 'Local experts with deep Himalayan knowledge.' },
    { icon: <GiBackpack />, title: 'Authentic Experiences', desc: 'Homestays and real cultural immersion.' },
    { icon: <HiOutlineShieldCheck />, title: 'Safety First', desc: 'Top gear and strict safety protocols.' },
    { icon: <FaLeaf />, title: 'Eco-Conscious', desc: 'Sustainable and community-focused.' }
  ];

  const treksList = [
    { img: IMAGES.treks.everest, slug: 'everest-base-camp', name: 'Everest Base Camp', desc: '14 days to the foot of the world\'s highest peak.', level: 'Challenging', alt: '5,364 m' },
    { img: IMAGES.treks.annapurna, slug: 'annapurna-circuit', name: 'Annapurna Circuit', desc: 'Diverse landscapes from subtropical forests to high-altitude deserts.', level: 'Challenging', alt: '5,416 m' },
    { img: IMAGES.treks.langtang, slug: 'langtang-valley', name: 'Langtang Valley', desc: 'A peaceful, less-crowded trail with stunning views and rich Tamang culture.', level: 'Moderate', alt: '3,870 m' }
  ];

  const process = [
    { icon: <FaCompass />, title: 'Tell Us Your Dream', desc: 'Share your fitness level, dates, and dream destination — we match you to the right trek.' },
    { icon: <FaMapMarkedAlt />, title: 'We Plan Every Detail', desc: 'Permits, guides, gear checklists, and itineraries — all handled before you land.' },
    { icon: <FaPlaneDeparture />, title: 'Fly In & Trek', desc: 'Land in Kathmandu and let your Himalayan adventure begin the very next day.' },
    { icon: <FaCameraRetro />, title: 'Return With Stories', desc: 'Come home with memories, photos, and a passport stamp you\'ll never forget.' }
  ];

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="transition-colors duration-300">
      <SEO
        title={COMPANY.name}
        description={`${COMPANY.description} Guided tours to Everest, Annapurna, Langtang, and more.`}
      />

      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-end justify-start overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${IMAGES.hero.home})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            y: backgroundY,
            opacity: 0.55
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}CC 0%, ${INK}66 45%, ${INK}F2 100%)` }} />

        <motion.svg
          style={{ y: ridgeY }}
          className="absolute bottom-0 left-0 w-full h-[28vh] sm:h-[34vh] will-change-transform"
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,260 L0,180 L90,110 L160,150 L240,60 L320,140 L410,40 L480,120 L560,20 L650,130 L740,70 L820,160 L900,50 L1000,150 L1080,90 L1200,170 L1200,260 Z"
            fill={PARCHMENT}
            opacity="0.06"
          />
          <path
            d="M0,180 L90,110 L160,150 L240,60 L320,140 L410,40 L480,120 L560,20 L650,130 L740,70 L820,160 L900,50 L1000,150 L1080,90 L1200,170"
            fill="none"
            stroke={SAFFRON}
            strokeWidth="1.5"
            opacity="0.5"
          />
        </motion.svg>

        <WeatherWidget />

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 px-5 sm:px-8 lg:px-16 pb-20 sm:pb-24 lg:pb-32 max-w-5xl will-change-transform"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontFamily: FONT_MONO, color: SAFFRON }}
            className="text-xs sm:text-sm tracking-[0.25em] uppercase mb-4"
          >
            Kathmandu → Everest → Annapurna → Langtang
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }}
            className="text-4xl sm:text-6xl md:text-7xl font-normal italic tracking-tight leading-[0.98]"
          >
            Discover the Himalayas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl font-light"
            style={{ color: '#D8D2C4' }}
          >
            Embark on a transformative journey with {COMPANY.name}, where adventure meets serenity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
            className="mt-9 sm:mt-10 flex flex-wrap items-center gap-5"
          >
            <motion.a
              href="#treks"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl transition-colors duration-300"
              style={{ backgroundColor: SAFFRON, color: INK }}
            >
              <GiHiking className="text-xl sm:text-2xl" />
              Explore Treks
            </motion.a>

            <motion.a
              href="#process"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 pb-1 font-semibold text-base sm:text-lg border-b-2"
              style={{ color: PARCHMENT, borderColor: `${PARCHMENT}55` }}
            >
              How It Works
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.a
          href="#trust"
          aria-label="Scroll down"
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-colors"
          style={{ color: `${PARCHMENT}B0` }}
        >
          <FaChevronDown size={22} />
        </motion.a>
      </header>

      <div id="trust">
        <TrustBar />
      </div>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontFamily: FONT_MONO, color: CLAY }}
              className="text-xs tracking-[0.2em] uppercase mb-3"
            >
              Why Trek With Us
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{ fontFamily: FONT_DISPLAY, color: INK }}
              className="text-3xl sm:text-4xl md:text-5xl italic font-normal"
            >
              Why Choose {COMPANY.shortName}?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-4 max-w-2xl text-base sm:text-lg"
              style={{ color: '#5B6660' }}
            >
              Your adventure, our expertise – a perfect blend for an unforgettable journey.
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.08 }}
                className="p-6 md:p-7 rounded-xl"
                style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
              >
                <div
                  className="inline-flex items-center justify-center h-14 w-14 rounded-full mb-5 text-2xl"
                  style={{ backgroundColor: `${JUNIPER}18`, color: JUNIPER }}
                >
                  {feature.icon}
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic">{feature.title}</h3>
                <p className="mt-2 text-sm" style={{ color: '#5B6660' }}>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <section id="process" className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontFamily: FONT_MONO, color: CLAY }}
              className="text-xs tracking-[0.2em] uppercase mb-3"
            >
              Four Steps
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{ fontFamily: FONT_DISPLAY, color: INK }}
              className="text-3xl sm:text-4xl md:text-5xl italic font-normal"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-4 max-w-2xl text-base sm:text-lg"
              style={{ color: '#5B6660' }}
            >
              From first message to homecoming — here's what the journey looks like.
            </motion.p>
          </div>

          <div className="mt-14 relative">
            <div
              className="hidden lg:block absolute top-8 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${JUNIPER}55, ${SAFFRON}88, transparent)` }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
              {process.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                    <div className="relative shrink-0">
                      <div
                        className="h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative z-10"
                        style={{ backgroundColor: INK, color: SAFFRON }}
                      >
                        {step.icon}
                      </div>
                      <span
                        style={{ fontFamily: FONT_MONO, backgroundColor: SAFFRON, color: INK }}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-xs font-bold flex items-center justify-center"
                      >
                        {idx + 1}
                      </span>
                    </div>
                    <div className="lg:mt-5">
                      <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg md:text-xl italic">{step.title}</h3>
                      <p className="mt-2 text-sm md:text-base" style={{ color: '#5B6660' }}>{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SeasonsGuide />

      <SafetyGuide />

      <section id="treks" className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              style={{ fontFamily: FONT_MONO, color: CLAY }}
              className="text-xs tracking-[0.2em] uppercase mb-3"
            >
              Handpicked Routes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
              style={{ fontFamily: FONT_DISPLAY, color: INK }}
              className="text-3xl sm:text-4xl md:text-5xl italic font-normal"
            >
              Featured Treks
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className="mt-4 max-w-2xl text-base sm:text-lg"
              style={{ color: '#5B6660' }}
            >
              Handpicked adventures for every explorer.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {treksList.map((trek, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group"
                style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
              >
                <div className="overflow-hidden relative">
                  <img
                    src={trek.img}
                    alt={trek.name}
                    className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                  <span
                    style={{ fontFamily: FONT_MONO, backgroundColor: `${INK}CC`, color: SAFFRON }}
                    className="absolute top-3 right-3 text-[11px] tracking-widest px-2 py-1 rounded"
                  >
                    {trek.alt} ASL
                  </span>
                </div>
                <div className="p-6">
                  <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic flex items-center gap-2">
                    <FaMountain style={{ color: JUNIPER }} className="text-lg" />
                    {trek.name}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: '#5B6660' }}>
                    {trek.desc}
                  </p>
                  <div className="mt-5 pt-4 flex justify-between items-center text-sm font-medium" style={{ borderTop: `1px dashed ${JUNIPER}44` }}>
                    <span style={{ fontFamily: FONT_MONO, color: CLAY }}>{trek.level}</span>
                    <Link to={`/packages/${trek.slug}`} className="inline-flex items-center gap-1 group/link" style={{ color: JUNIPER }}>
                      Learn More
                      <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="mt-12 text-center"
          >
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="inline-block">
              <Link
                to="/packages"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl transition-colors duration-300"
                style={{ backgroundColor: INK, color: PARCHMENT }}
              >
                <FaCompass className="text-xl" style={{ color: SAFFRON }} />
                View All Treks
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <InteractiveMap />

      <Testimonials />
      <FAQ />

      <section className="py-16 md:py-20" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontFamily: FONT_MONO, color: CLAY }}
            className="text-xs tracking-[0.2em] uppercase mb-3"
          >
            Dispatches
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
            style={{ fontFamily: FONT_DISPLAY, color: INK }}
            className="text-2xl sm:text-3xl md:text-4xl italic font-normal"
          >
            Get Trail-Tested Tips
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="mt-3 text-base sm:text-lg"
            style={{ color: '#5B6660' }}
          >
            Packing lists, permit tips, and seasonal advice — straight to your inbox, once a month.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.16 }}
            className="mt-8"
          >
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
                style={{ backgroundColor: JUNIPER, color: PARCHMENT }}
              >
                You're on the list — see you on the trail!
              </motion.div>
            ) : (
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="base-form-input flex-1 !rounded-full"
                />
                <button
                  type="submit"
                  className="base-form-btn !py-3.5 !px-6"
                >
                  <FaPaperPlane className="text-sm" />
                  Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: INK }}>
        <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,100 L100,60 L200,80 L320,30 L420,70 L540,20 L650,65 L760,40 L880,75 L1000,35 L1200,60 L1200,100 Z" fill={SAFFRON} />
        </svg>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 max-w-4xl mx-auto text-center px-5"
        >
          <p style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="text-xs tracking-[0.25em] uppercase mb-4">
            Plot your route
          </p>
          <h2 style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="text-4xl sm:text-5xl md:text-6xl italic font-normal tracking-tight">
            Ready for your adventure?
          </h2>
          <p className="mt-6 text-lg sm:text-xl font-light" style={{ color: '#B9B2A0' }}>
            Let's find the perfect trek. Start planning today.
          </p>
          <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="inline-block mt-10">
            <Link
              to="/packages"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base sm:text-lg shadow-xl transition-colors duration-300"
              style={{ backgroundColor: SAFFRON, color: INK }}
            >
              <GiHiking className="text-2xl" />
              View Trekking Packages
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}