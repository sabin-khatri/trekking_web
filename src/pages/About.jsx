import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { IMAGES } from '../config/images';
import { COMPANY } from '../config/company';
import SEO from '../components/common/SEO';
import {
  FaLeaf,
  FaFire,
  FaCertificate,
  FaUserShield,
  FaGlobeAsia,
  FaQuoteLeft
} from 'react-icons/fa';

import {
  GiMountainRoad,
  GiHiking,
  GiBackpack,
  GiCompass
} from 'react-icons/gi';

import { HiOutlineShieldCheck } from 'react-icons/hi';
import Stats from '../components/features/Stats';

const EASE = [0.22, 1, 0.36, 1];
const VIEWPORT = { once: true, margin: '-80px' };

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';
const ICE = '#6E93A3';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function About() {
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

  const milestones = [
    { year: '2010', alt: '1,400 m', title: 'Founded', desc: "Dorje Sherpa's vision begins in a one-room office in Kathmandu.", img: '/img/img8.webp' },
    { year: '2015', alt: '3,860 m', title: "First Int'l Group", desc: 'Everest Base Camp success — our first foreign trekking party.', img: '/img/img9.webp' },
    { year: '2018', alt: '4,900 m', title: 'Sustainability Pledge', desc: 'Eco-friendly, leave-no-trace protocol adopted across every route.', img: '/img/img11.webp' },
    { year: '2023', alt: '5,364 m', title: '1000th Trekker', desc: 'Celebrated at Base Camp — a decade of shared summits.', img: IMAGES.about.story },
  ];

  const team = [
    {
      no: '01',
      name: 'Dorje Sherpa',
      role: 'Founder & Lead Guide',
      desc: '20+ years of high-altitude expertise.',
      quote: 'The mountains teach us humility and strength.',
      img: '/img/img10.jpeg',
      icon: <GiHiking className="text-3xl" style={{ color: JUNIPER }} />,
    },
    {
      no: '02',
      name: 'Pema Lama',
      role: 'Operations Manager',
      desc: 'Ensures seamless trip planning.',
      quote: 'Planning your adventure is my adventure!',
      img: '/img/img12.jpg',
      icon: <GiCompass className="text-3xl" style={{ color: JUNIPER }} />,
    },
    {
      no: '03',
      name: 'Rinzin Gurung',
      role: 'Cultural Guide',
      desc: "Shares Nepal's rich heritage.",
      quote: "I'm a Nepali, but I'm also a traveler. I love to explore new places.",
      img: '/img/img2.jpg',
      icon: <GiBackpack className="text-3xl" style={{ color: JUNIPER }} />,
    },
  ];

  const moments = [
    { caption: 'Sunrise at Everest Base Camp', coord: '27.9881° N', img: '/img/everest.jpg' },
    { caption: 'Annapurna Circuit', coord: '28.5967° N', img: '/img/annapurna.jpg' },
    { caption: 'Langtang Valley Culture', coord: '28.2108° N', img: '/img/langtang.webp' },
  ];

  const values = [
    { title: 'Authenticity', desc: 'Real Nepal through local eyes.', icon: <GiMountainRoad className="h-7 w-7" /> },
    { title: 'Safety', desc: 'Top gear, strict protocols.', icon: <HiOutlineShieldCheck className="h-7 w-7" /> },
    { title: 'Sustainability', desc: 'Leave no trace, give back.', icon: <FaLeaf className="h-7 w-7" /> },
    { title: 'Passion', desc: 'We live for the mountains!', icon: <FaFire className="h-7 w-7" /> },
  ];

  const certifications = [
    { icon: <FaCertificate />, label: 'Nepal Tourism Board Registered' },
    { icon: <FaUserShield />, label: 'Fully Licensed & Insured' },
    { icon: <FaGlobeAsia />, label: 'Member, Trekking Agencies Association of Nepal' },
    { icon: <HiOutlineShieldCheck />, label: 'Wilderness First Aid Certified Guides' },
  ];

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="transition-colors duration-300">
      <SEO title="About Us" description={`Learn about ${COMPANY.name} — founded in ${COMPANY.founded} by ${COMPANY.founder}. Our mission, team, and commitment to safe Himalayan trekking.`} />

      <header
        ref={heroRef}
        id="top"
        className="relative min-h-[85vh] sm:min-h-screen flex items-end justify-start overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url('${IMAGES.hero.about}')`,
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

        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="relative z-10 px-5 sm:px-8 lg:px-16 pb-16 sm:pb-20 lg:pb-28 max-w-5xl will-change-transform"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontFamily: FONT_MONO, color: SAFFRON }}
            className="text-xs sm:text-sm tracking-[0.25em] uppercase mb-4"
          >
            Est. {COMPANY.founded} · Kathmandu, Nepal · 27.7172° N
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }}
            className="text-4xl sm:text-6xl md:text-7xl font-normal italic tracking-tight leading-[0.98]"
          >
            Our Story,<br />Written on the Trail
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl max-w-2xl font-light"
            style={{ color: '#D8D2C4' }}
          >
            Fifteen years of field notes, base camps, and friendships made one switchback at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
            className="mt-9 sm:mt-10"
          >
            <motion.a
              href="#mission"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-3 pb-1 font-semibold text-base sm:text-lg border-b-2"
              style={{ color: PARCHMENT, borderColor: SAFFRON }}
            >
              Read the mission
              <span aria-hidden="true">→</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </header>

      <section id="mission" className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="order-2 md:order-1"
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              The Mission
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal leading-tight">
              More than a walk in the mountains
            </h2>
            <p className="mt-6 text-base sm:text-lg leading-relaxed" style={{ color: '#3E4A44' }}>
              We believe trekking is a journey into the heart of nature, culture, and oneself —
              not a checklist of summits.
            </p>
            <p className="mt-4 text-base sm:text-lg leading-relaxed" style={{ color: '#3E4A44' }}>
              Our mission is to provide authentic, safe, and sustainable trekking experiences that
              forge a lasting connection between our guests and Nepal.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="order-1 md:order-2 relative"
          >
            <div className="absolute -inset-3 border rounded-2xl" style={{ borderColor: `${JUNIPER}33` }} />
            <img
              src={IMAGES.about.mission}
              alt="Trekking in Himalayas"
              className="relative rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3] md:aspect-auto"
              loading="lazy"
              decoding="async"
            />
          </motion.div>
        </div>
      </section>

      <Stats />

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              The Ascent — 2010 to 2023
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal">
              Key Milestones
            </h2>
          </motion.div>

          <div className="mt-14 sm:mt-16 relative">
            <div
              className="hidden sm:block absolute left-0 right-0 h-px"
              style={{ top: '10px', background: `linear-gradient(90deg, ${JUNIPER}55, ${SAFFRON}88)` }}
            />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-6">
              {milestones.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                  className="relative flex flex-col"
                  style={{
                    marginTop: `${(3 - idx) * 14}px`
                  }}
                >
                  <div className="flex items-center gap-3 sm:block">
                    <span
                      className="hidden sm:block w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: SAFFRON, boxShadow: `0 0 0 4px ${PARCHMENT_DEEP}` }}
                    />
                    <div className="sm:mt-4">
                      <p style={{ fontFamily: FONT_MONO, color: JUNIPER }} className="text-xs tracking-wide">
                        {item.alt} ASL
                      </p>
                      <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-2xl sm:text-3xl font-medium mt-1">
                        {item.year}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-4 sm:block">
                    <img
                      src={item.img}
                      alt={item.year}
                      className="w-16 h-16 sm:w-full sm:h-32 object-cover rounded-lg shrink-0"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="sm:mt-3">
                      <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg sm:text-xl italic">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: '#5B6660' }}>{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center rounded-2xl p-8 sm:p-10 md:p-14 relative"
            style={{ backgroundColor: INK }}
          >
            <img
              src="/img/img10.jpeg"
              alt={COMPANY.founder}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover mx-auto md:mx-0 border-2 shrink-0"
              style={{ borderColor: SAFFRON }}
              loading="lazy"
              decoding="async"
            />
            <div className="text-center md:text-left">
              <FaQuoteLeft className="text-2xl mb-4 mx-auto md:mx-0" style={{ color: SAFFRON }} />
              <p style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="text-lg sm:text-xl md:text-2xl italic leading-relaxed">
                "When I guided my first group up to Everest Base Camp, I realized this was never just about reaching a summit.
                It's about the friendships forged on the trail and the respect we build for these mountains and the people who call them home.
                That's the promise {COMPANY.shortName} makes to every trekker who joins us."
              </p>
              <p style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="mt-6 text-sm tracking-wide">
                {COMPANY.founder} — Founder, trekking since {COMPANY.founded}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              Field Dossier
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal">
              Meet Our Team
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative rounded-xl p-6 md:p-7 shadow-md hover:shadow-xl transition-shadow duration-300"
                style={{ backgroundColor: PARCHMENT, border: `1px solid ${JUNIPER}22` }}
              >
                <span
                  style={{ fontFamily: FONT_MONO, color: `${INK}55` }}
                  className="absolute top-4 right-5 text-xs tracking-widest"
                >
                  NO. {member.no}
                </span>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: SAFFRON }}>
                    <img src={member.img} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic">{member.name}</h3>
                    <p style={{ color: JUNIPER }} className="font-semibold text-sm">{member.role}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm" style={{ color: '#5B6660' }}>{member.desc}</p>

                <div className="mt-5 pt-5 flex items-start gap-3" style={{ borderTop: `1px dashed ${JUNIPER}44` }}>
                  {member.icon}
                  <p className="text-sm italic" style={{ color: '#3E4A44' }}>"{member.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              Field Notes
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal">
              Moments from Our Treks
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {moments.map((item, idx) => (
              <motion.div
                key={item.caption}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="relative overflow-hidden rounded-xl shadow-md group hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={item.img}
                  alt={item.caption}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 flex items-end p-5" style={{ background: `linear-gradient(to top, ${INK}E6, ${INK}10 60%, transparent)` }}>
                  <div>
                    <p style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="text-[11px] tracking-widest mb-1">{item.coord}</p>
                    <p style={{ color: PARCHMENT }} className="font-medium text-base">{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              What We Carry
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal">
              Our Core Values
            </h2>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: idx * 0.08 }}
                className="p-6 md:p-7 rounded-xl"
                style={{ backgroundColor: PARCHMENT, border: `1px solid ${JUNIPER}22` }}
              >
                <div
                  className="inline-flex items-center justify-center h-12 w-12 rounded-full mb-5"
                  style={{ backgroundColor: `${JUNIPER}15`, color: JUNIPER }}
                >
                  {value.icon}
                </div>
                <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic">{value.title}</h3>
                <p className="mt-2 text-sm" style={{ color: '#5B6660' }}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-16" style={{ backgroundColor: PARCHMENT, borderTop: `1px solid ${JUNIPER}22`, borderBottom: `1px solid ${JUNIPER}22` }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: EASE }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {certifications.map((cert, idx) => (
              <motion.div
                key={cert.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, ease: EASE, delay: idx * 0.08 }}
                className="flex flex-col items-center text-center gap-3 px-2"
              >
                <div
                  className="h-14 w-14 rounded-full flex items-center justify-center text-xl border-2"
                  style={{ borderColor: CLAY, color: CLAY }}
                >
                  {cert.icon}
                </div>
                <p style={{ fontFamily: FONT_MONO, color: '#5B6660' }} className="text-[11px] leading-snug tracking-wide">
                  {cert.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="call-to-action" className="relative py-20 md:py-32 overflow-hidden" style={{ backgroundColor: INK }}>
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