/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
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

// Shared, smoother easing curve used across the page instead of the default 'easeOut'
const EASE = [0.22, 1, 0.36, 1];

// Reusable viewport settings so sections animate in a beat earlier — feels snappier while scrolling
const VIEWPORT = { once: true, margin: '-80px' };

export default function Home() {
  const heroRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Skip parallax transforms entirely if the user prefers reduced motion
  const backgroundY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '35%']);
  const textY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '150%']);
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
    { img: IMAGES.treks.everest, slug: 'everest-base-camp', name: 'Everest Base Camp', desc: '14 days to the foot of the world\'s highest peak.', level: 'Challenging' },
    { img: IMAGES.treks.annapurna, slug: 'annapurna-circuit', name: 'Annapurna Circuit', desc: 'Diverse landscapes from subtropical forests to high-altitude deserts.', level: 'Challenging' },
    { img: IMAGES.treks.langtang, slug: 'langtang-valley', name: 'Langtang Valley', desc: 'A peaceful, less-crowded trail with stunning views and rich Tamang culture.', level: 'Moderate' }
  ];

  const process = [
    { icon: <FaCompass />, title: 'Tell Us Your Dream', desc: 'Share your fitness level, dates, and dream destination — we match you to the right trek.' },
    { icon: <FaMapMarkedAlt />, title: 'We Plan Every Detail', desc: 'Permits, guides, gear checklists, and itineraries — all handled before you land.' },
    { icon: <FaPlaneDeparture />, title: 'Fly In & Trek', desc: 'Land in Kathmandu and let your Himalayan adventure begin the very next day.' },
    { icon: <FaCameraRetro />, title: 'Return With Stories', desc: 'Come home with memories, photos, and a passport stamp you\'ll never forget.' }
  ];

  return (
    <div className="transition-colors duration-300">
      <SEO
        title={COMPANY.name}
        description={`${COMPANY.description} Guided tours to Everest, Annapurna, Langtang, and more.`}
      />

      {/* Hero */}
      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${IMAGES.hero.home})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            y: backgroundY
          }}
        />
        <div className="absolute inset-0 bg-black/65" />

        <WeatherWidget />

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 px-5 sm:px-8 lg:px-12 max-w-5xl mx-auto will-change-transform"
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight
              bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-xl
            "
          >
            Discover the Himalayas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="
              mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto
              text-slate-200 font-light
            "
          >
            Embark on a transformative journey with {COMPANY.name}, where adventure meets serenity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href="#treks"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600
                hover:from-emerald-500 hover:to-green-500 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                transition-colors duration-300 shadow-xl shadow-emerald-600/30
              "
            >
              <GiHiking className="text-xl sm:text-2xl" />
              Explore Treks
            </motion.a>

            <motion.a
              href="#process"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="
                inline-flex items-center gap-2.5 bg-white/10 border border-white/30 backdrop-blur-sm
                hover:bg-white/20 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                transition-colors duration-300
              "
            >
              How It Works
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#trust"
          aria-label="Scroll down"
          animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors"
        >
          <FaChevronDown size={22} />
        </motion.a>
      </header>

      <div id="trust">
        <TrustBar />
      </div>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 lg:py-28 bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800"
            >
              Why Choose {COMPANY.shortName}?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600"
            >
              Your adventure, our expertise – a perfect blend for an unforgettable journey.
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className="text-center p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-shadow duration-300"
                style={{ transitionProperty: 'box-shadow' }}
              >
                <motion.div
                  whileHover={{ rotate: 6, scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="inline-flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-6 text-3xl md:text-4xl shadow-inner"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800">{feature.title}</h3>
                <p className="mt-3 text-slate-600 text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      {/* How It Works */}
      <section id="process" className="py-16 md:py-20 lg:py-28 bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600"
            >
              From first message to homecoming — here's what the journey looks like.
            </motion.p>
          </div>

          <div className="mt-14 relative">
            {/* Connector line for desktop */}
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative">
              {process.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                  className="relative text-center lg:text-left"
                >
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-0">
                    <div className="relative shrink-0">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-600/30 z-10 relative">
                        {step.icon}
                      </div>
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border-2 border-emerald-500 text-emerald-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>
                    <div className="lg:mt-5">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800">{step.title}</h3>
                      <p className="mt-2 text-slate-600 text-sm md:text-base">{step.desc}</p>
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

      {/* Featured Treks Section */}
      <section id="treks" className="py-16 md:py-20 lg:py-28 bg-slate-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800"
            >
              Featured Treks
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600"
            >
              Handpicked adventures for every explorer.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {treksList.map((trek, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-2xl group border border-transparent"
              >
                <div className="overflow-hidden">
                  <img
                    src={trek.img}
                    alt={trek.name}
                    className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                    <FaMountain className="text-green-600" />
                    {trek.name}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    {trek.desc}
                  </p>
                  <div className="mt-5 flex justify-between items-center text-sm font-medium">
                    <span className="text-green-600">{trek.level}</span>
                    <Link to={`/packages/${trek.slug}`} className="text-green-600 hover:text-green-800 inline-flex items-center gap-1 group/link">
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
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="inline-block">
              <Link
                to="/packages"
                className="
                  inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white
                  px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                  hover:from-emerald-500 hover:to-green-500 transition-colors duration-300 shadow-xl shadow-emerald-600/30
                "
              >
                <FaCompass className="text-xl" />
                View All Treks
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <InteractiveMap />

      <Testimonials />
      <FAQ />

      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-emerald-50 transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800"
          >
            Get Trail-Tested Tips
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
            className="mt-3 text-slate-600 text-base sm:text-lg"
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
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                🎉 You're on the list — see you on the trail!
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
                  className="flex-1 px-5 py-3.5 rounded-full border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-shadow"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-6 py-3.5 rounded-full font-semibold shadow-lg shadow-emerald-600/30 transition-colors duration-300"
                >
                  <FaPaperPlane className="text-sm" />
                  Subscribe
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 max-w-4xl mx-auto text-center px-5"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Ready for your adventure?
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 font-light">
            Let's find the perfect trek. Start planning today.
          </p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="inline-block mt-10">
            <Link
              to="/packages"
              className="
                inline-flex items-center gap-3 bg-white text-slate-900
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                hover:bg-emerald-50 transition-colors duration-300 shadow-2xl
              "
            >
              <GiHiking className="text-2xl text-emerald-600" />
              View Trekking Packages
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}