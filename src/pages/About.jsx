// src/pages/About.jsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { IMAGES } from '../config/images';
import { COMPANY } from '../config/company';
import SEO from '../components/common/SEO';
import { 
  FaMountain, 
  FaLeaf, 
  FaFire 
} from 'react-icons/fa';

import { 
  GiMountainRoad, 
  GiHiking, 
  GiBackpack, 
  GiCompass 
} from 'react-icons/gi';

import { HiOutlineShieldCheck } from 'react-icons/hi';
import Stats from '../components/features/Stats';

export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  return (
    <div className=" transition-colors duration-300">
      <SEO title="About Us" description={`Learn about ${COMPANY.name} — founded in ${COMPANY.founded} by ${COMPANY.founder}. Our mission, team, and commitment to safe Himalayan trekking.`} />
      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${IMAGES.hero.about}')`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            y: backgroundY
          }}
        />
        <div className="absolute inset-0 bg-black/65" /> 

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
            Our Story
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
            Our Journey, Our Passion, Our Promise
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
            className="mt-8 sm:mt-10"
          >
            <a
              href="#mission"  
              className="
                inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-green-600
                hover:from-emerald-500 hover:to-green-500 text-white
                px-8 py-4 rounded-full font-semibold text-base sm:text-lg
                transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-600/30
              "
            >
              <GiMountainRoad className="text-xl sm:text-2xl" />
              Discover Our Mission
            </a>
          </motion.div>
        </motion.div>
      </header>

      {/* Our Mission */}
      <section id="mission" className="py-16 md:py-20 lg:py-28 bg-white  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 ">
              Our Mission
            </h2>
            <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600  leading-relaxed">
              We believe trekking is more than just a walk; it's a journey into the heart of nature, culture, and oneself.
            </p>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600  leading-relaxed">
              Our mission is to provide authentic, safe, and sustainable trekking experiences that forge a lasting connection between our guests and Nepal.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <img
              src={IMAGES.about.mission}  
              alt="Trekking in Himalayas"
              className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-[4/3] md:aspect-auto border border-transparent "
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      <Stats />

      {/* Key Milestones */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-50  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 ">
              Key Milestones
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 ">
              Moments that define our journey
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                year: '2010',
                title: 'Founded',
                desc: "Dorje Sherpa's vision begins.",
                img: '/img/img8.webp',
              },
              {
                year: '2015',
                title: 'First Int\'l Group',
                desc: 'Everest Base Camp success.',
                img: '/img/img9.webp',
              },
              {
                year: '2018',
                title: 'Sustainability',
                desc: 'Eco-friendly pledge made.',
                img: '/img/img11.webp',
              },
              {
                year: '2023',
                title: '1000th Trekker',
                desc: 'Milestone celebration.',
                img: IMAGES.about.story,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="
                  bg-white  rounded-2xl shadow-lg p-5 text-center 
                  hover:-translate-y-2 transition-all duration-300 border border-transparent 
                "
              >
                <img
                  src={item.img}
                  alt={item.year}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full mx-auto border-4 border-green-100 "
                  loading="lazy"
                />
                <h3 className="mt-4 text-lg sm:text-xl font-bold text-green-700 ">
                  {item.year}: {item.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-slate-600 ">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-16 md:py-20 lg:py-28 bg-white  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 ">
              Meet Our Team
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 ">
              The Heart and Soul of Your Adventure
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                name: 'Dorje Sherpa',
                role: 'Founder & Lead Guide',
                desc: '20+ years of high-altitude expertise.',
                quote: 'The mountains teach us humility and strength.',
                img: '/img/img10.jpeg',
                icon: <GiHiking className="text-5xl text-green-600 " />,
              },
              {
                name: 'Pema Lama',
                role: 'Operations Manager',
                desc: 'Ensures seamless trip planning.',
                quote: 'Planning your adventure is my adventure!',
                img: '/img/img12.jpg',
                icon: <GiCompass className="text-5xl text-green-600 " />,
              },
              {
                name: 'Rinzin Gurung',
                role: 'Cultural Guide',
                desc: "Shares Nepal's rich heritage.",
                quote: "I'm a Nepali, but I'm also a traveler. I love to explore new places.",
                img: '/img/img2.jpg',
                icon: <GiBackpack className="text-5xl text-green-600 " />,
              },
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="
                  bg-white  rounded-2xl shadow-xl p-6 md:p-8 text-center 
                  hover:-translate-y-2 transition-all duration-300 border border-transparent 
                "
              >
                <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-green-100  mb-5">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 ">{member.name}</h3>
                <p className="text-green-600  font-semibold text-base sm:text-lg">{member.role}</p>
                <p className="mt-3 text-sm sm:text-base text-slate-600 ">{member.desc}</p>

                <div className="mt-5 flex justify-center">
                  {member.icon}
                </div>

                <p
                  className="
                    mt-5 text-sm sm:text-base italic text-white 
                    bg-gradient-to-r from-green-600 to-green-800 
                     
                    p-4 rounded-xl shadow-inner
                  "
                >
                  "{member.quote}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Moments Gallery */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-50  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 ">
              Moments from Our Treks
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 ">
              A glimpse into shared adventures
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                caption: 'Sunrise at Everest Base Camp',
                img: '/img/everest.jpg',
              },
              {
                caption: 'Annapurna Circuit',
                img: '/img/annapurna.jpg',
              },
              {
                caption: 'Langtang Valley Culture',
                img: '/img/langtang.webp',    
              },
            ].map((item, idx) => (
              <motion.div
                key={item.caption}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="
                  relative overflow-hidden rounded-2xl shadow-lg 
                  hover:shadow-2xl hover:scale-[1.02] transition-all duration-300
                "
              >
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                  <p className="text-white font-medium text-base sm:text-lg">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 lg:py-28 bg-white  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 ">
              Our Core Values
            </h2>
            <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-600 ">
              Principles that guide every step
            </p>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: 'Authenticity',
                desc: 'Real Nepal through local eyes.',
                icon: <GiMountainRoad className="h-8 w-8" />,
              },
              {
                title: 'Safety',
                desc: 'Top gear, strict protocols.',
                icon: <HiOutlineShieldCheck className="h-8 w-8" />,
              },
              {
                title: 'Sustainability',
                desc: 'Leave no trace, give back.',
                icon: <FaLeaf className="h-8 w-8" />,
              },
              {
                title: 'Passion',
                desc: 'We live for the mountains!',
                icon: <FaFire className="h-8 w-8" />,
              },
            ].map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="
                  text-center p-6 md:p-8 rounded-3xl bg-white 
                   
                  border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300
                "
              >
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100  text-green-700  mx-auto mb-5 text-2xl">
                  {value.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 ">{value.title}</h3>
                <p className="mt-3 text-base text-slate-600 ">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="call-to-action" className="relative bg-slate-950 py-20 md:py-32 overflow-hidden transition-colors duration-300">
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
          <a
            href="/packages"
            className="
              mt-10 inline-flex items-center gap-3 bg-white text-slate-900
              px-8 py-4 rounded-full font-semibold text-base sm:text-lg
              hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-2xl
            "
          >
            <GiHiking className="text-2xl text-emerald-600" />
            View Trekking Packages
          </a>
        </motion.div>
      </section>
    </div>
  );
}
