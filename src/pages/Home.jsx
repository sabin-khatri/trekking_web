/* eslint-disable no-unused-vars */
// src/pages/Home.jsx
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';

import { 
  FaMountain, 
  FaCompass, 
  FaLeaf 
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

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  return (
    <div className=" transition-colors duration-300">
      <SEO 
        title={COMPANY.name}
        description={`${COMPANY.description} Guided tours to Everest, Annapurna, Langtang, and more.`}
      />
      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
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
          style={{ y: textY }}
          className="relative z-10 px-5 sm:px-8 lg:px-12 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight
              bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-xl
            "
          >
            Discover the Himalayas
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="
              mt-5 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto
              text-slate-200 font-light
            "
          >
            Embark on a transformative journey with {COMPANY.name}, where adventure meets serenity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="mt-8 sm:mt-10"
          >
            <a
              href="#treks"
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600
                hover:from-emerald-500 hover:to-green-500 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-600/30
              "
            >
              <GiHiking className="text-xl sm:text-2xl" />
              Explore Treks
            </a>
          </motion.div>
        </motion.div>
      </header>

      <TrustBar />
      
      <section className="py-16 md:py-20 lg:py-28 bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 "
            >
              Why Choose {COMPANY.shortName}?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 "
            >
              Your adventure, our expertise – a perfect blend for an unforgettable journey.
            </motion.p>
          </div>

          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            {[
              { icon: <GiMountainRoad />, title: 'Expert Guides', desc: 'Local experts with deep Himalayan knowledge.' },
              { icon: <GiBackpack />, title: 'Authentic Experiences', desc: 'Homestays and real cultural immersion.' },
              { icon: <HiOutlineShieldCheck />, title: 'Safety First', desc: 'Top gear and strict safety protocols.' },
              { icon: <FaLeaf />, title: 'Eco-Conscious', desc: 'Sustainable and community-focused.' }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="text-center p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300 "
              >
                <div className="inline-flex items-center justify-center h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto mb-6 text-3xl md:text-4xl shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 ">{feature.title}</h3>
                <p className="mt-3 text-slate-600  text-base">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Stats />

      <SeasonsGuide />
      
      <SafetyGuide />

      {/* Featured Treks Section */}
      <section id="treks" className="py-16 md:py-20 lg:py-28 bg-slate-50  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 "
            >
              Featured Treks
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 "
            >
              Handpicked adventures for every explorer.
            </motion.p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[
              { img: IMAGES.treks.everest, slug: 'everest-base-camp', name: 'Everest Base Camp', desc: '14 days to the foot of the world\'s highest peak.', level: 'Challenging' },
              { img: IMAGES.treks.annapurna, slug: 'annapurna-circuit', name: 'Annapurna Circuit', desc: 'Diverse landscapes from subtropical forests to high-altitude deserts.', level: 'Challenging' },
              { img: IMAGES.treks.langtang, slug: 'langtang-valley', name: 'Langtang Valley', desc: 'A peaceful, less-crowded trail with stunning views and rich Tamang culture.', level: 'Moderate' }
            ].map((trek, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white  rounded-2xl shadow-xl overflow-hidden hover:-translate-y-2 transition-all duration-300 group border border-transparent "
              >
                <div className="overflow-hidden">
                  <img
                    src={trek.img}
                    alt={trek.name}
                    className="w-full aspect-[4/3] sm:aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700  flex items-center gap-2">
                    <FaMountain className="text-green-600 " />
                    {trek.name}
                  </h3>
                  <p className="mt-2 text-slate-600 ">
                    {trek.desc}
                  </p>
                  <div className="mt-5 flex justify-between items-center text-sm font-medium">
                    <span className="text-green-600 ">{trek.level}</span>
                    <Link to={`/packages/${trek.slug}`} className="text-green-600 hover:text-green-800">
                      Learn More →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/packages"
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                hover:from-emerald-500 hover:to-green-500 transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-600/30
              "
            >
              <FaCompass className="text-xl" />
              View All Treks
            </Link>
          </motion.div>
        </div>
      </section>

      <InteractiveMap />

      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <section className="relative bg-slate-950 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center px-5"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Ready for your adventure?
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 font-light">
            Let’s find the perfect trek. Start planning today.
          </p>
          <Link
            to="/packages"
            className="
              mt-10 inline-flex items-center gap-3 bg-white text-slate-900
              px-8 py-4 rounded-full font-semibold text-base sm:text-lg
              hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-2xl
            "
          >
            <GiHiking className="text-2xl text-emerald-600" />
            View Trekking Packages
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
