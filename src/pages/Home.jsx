// src/pages/Home.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

// Import only the icons you actually use (tree-shaking friendly)
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
import SEO from '../components/common/SEO';

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
        title="Himalayan Treks & Adventures" 
        description="Your ultimate trekking partner in Nepal. We offer guided tours to Everest, Annapurna, Langtang, and more."
      />
      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/img/home.avif')`, 
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
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
              bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-lg
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
              text-slate-100 font-light
            "
          >
            Embark on a transformative journey with Nepal Treks, where adventure meets serenity.
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
                inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-emerald-700
                hover:from-green-700 hover:to-emerald-800 text-white
                px-7 py-3.5 rounded-full font-semibold text-base sm:text-lg
                transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg
              "
            >
              <GiHiking className="text-xl sm:text-2xl" />
              Explore Treks
            </a>
          </motion.div>
        </motion.div>
      </header>
      
      <section className="py-16 md:py-20 lg:py-28 bg-white  transition-colors duration-300">
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
                whileHover={{ y: -5 }}
                className="text-center p-6 md:p-8 rounded-2xl bg-gradient-to-b from-green-50 to-white   shadow-md hover:shadow-xl transition-shadow duration-300 border border-transparent "
              >
                <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-100  text-green-700  mx-auto mb-5 text-2xl md:text-3xl">
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
              { img: '/img/everest.jpg', name: 'Everest Base Camp', desc: '14 days to the foot of the world’s highest peak.', level: 'Challenging' },
              { img: '/img/annapurna.jpg', name: 'Annapurna Circuit', desc: 'Diverse landscapes from subtropical forests to high-altitude deserts.', level: 'Challenging' },
              { img: '/img/langtang.webp', name: 'Langtang Valley', desc: 'A peaceful, less-crowded trail with stunning views and rich Tamang culture.', level: 'Moderate' }
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
                    <a href="/packages" className="text-green-600  hover:text-green-800 :text-green-300">
                      Learn More →
                    </a>
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
            <a
              href="/packages"
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-green-600 to-green-800 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                hover:from-green-700 hover:to-green-900 transition-all duration-300 hover:scale-105 shadow-lg
              "
            >
              <FaCompass className="text-xl" />
              View All Treks
            </a>
          </motion.div>
        </div>
      </section>

      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-green-700 via-green-800 to-emerald-900    py-16 md:py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center px-5"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            Ready for your adventure?
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-green-100">
            Let’s find the perfect trek. Start planning today.
          </p>
          <a
            href="/packages"
            className="
              mt-8 inline-flex items-center gap-2.5 bg-white text-green-800
              px-8 py-4 rounded-full font-semibold text-base sm:text-lg
              hover:bg-green-50 transition-all duration-300 hover:scale-105 shadow-xl
            "
          >
            <GiHiking className="text-xl" />
            View Trekking Packages
          </a>
        </motion.div>
      </section>
    </div>
  );
}
