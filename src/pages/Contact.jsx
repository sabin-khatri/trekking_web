/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useToast } from '../components/ToastContext';
import { IMAGES } from '../config/images';

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane
} from 'react-icons/fa';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill all the required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Your message has been submitted successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const inputStyle = {
    fontFamily: FONT_BODY,
    borderColor: `${JUNIPER}44`,
    color: INK,
    backgroundColor: PARCHMENT
  };

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="min-h-screen transition-colors duration-300">
      <header
        ref={heroRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center overflow-hidden"
        style={{ backgroundColor: INK }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${IMAGES.hero.contact})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            y: backgroundY,
            opacity: 0.5
          }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${INK}D9 0%, ${INK}88 50%, ${INK}F5 100%)` }} />

        <div
          className="absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 rotate-[3deg] border-2 rounded-lg px-4 py-1.5 z-10"
          style={{ borderColor: SAFFRON }}
        >
          <span style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="text-[11px] tracking-[0.3em] uppercase">
            Basecamp Post
          </span>
        </div>

        <motion.div
          style={{ y: textY }}
          className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-normal leading-tight"
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-light"
            style={{ color: '#D8D2C4' }}
          >
            Plan your unforgettable Himalayan adventure with us.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="#contact-form"
            style={{ backgroundColor: SAFFRON, color: INK }}
            className="mt-8 sm:mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 shadow-xl"
          >
            <FaEnvelope className="text-xl sm:text-2xl" />
            Send a Message
          </motion.a>
        </motion.div>
      </header>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3">
              Reach The Basecamp
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl sm:text-4xl md:text-5xl italic font-normal mb-6">
              Connect With Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-10 leading-relaxed" style={{ color: '#5B6660' }}>
              Questions about packages, custom itineraries, or just want to say hello?
              Our team is here to assist you.
            </p>

            <div className="space-y-5">
              {[
                { icon: <FaEnvelope />, title: 'Email Us', desc: 'For inquiries, support, and bookings.', link: 'mailto:info@nepaltreks.com', linkText: 'info@nepaltreks.com' },
                { icon: <FaPhoneAlt />, title: 'Call Us', desc: 'Speak directly with our friendly team.', link: 'tel:+9779747433572', linkText: '+977 9747433572' },
                { icon: <FaMapMarkerAlt />, title: 'Visit Our Office', desc: 'Open Sun–Fri, 9:00 AM – 6:00 PM', link: null, linkText: 'Belbari, Morang, Nepal' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 8 }}
                  style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
                  className="relative flex items-start gap-5 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="hidden sm:block absolute top-0 bottom-0 left-24 border-l-2 border-dashed"
                    style={{ borderColor: `${JUNIPER}33` }}
                    aria-hidden="true"
                  />
                  <div className="flex-shrink-0">
                    <div style={{ backgroundColor: INK, color: SAFFRON }} className="h-14 w-14 rounded-full flex items-center justify-center text-2xl shadow-md">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic">{item.title}</h3>
                    <p className="mt-1 text-sm" style={{ color: '#5B6660' }}>{item.desc}</p>
                    {item.link ? (
                      <a href={item.link} style={{ fontFamily: FONT_MONO, color: JUNIPER }} className="font-medium text-base mt-2 block transition-colors hover:opacity-70">
                        {item.linkText}
                      </a>
                    ) : (
                      <p style={{ fontFamily: FONT_MONO, color: JUNIPER }} className="font-medium text-base mt-2 block">
                        {item.linkText}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="contact-form"
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2 relative rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl"
            style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
          >
            <div className="absolute -top-3 left-8 w-6 h-6 rounded-full" style={{ backgroundColor: PARCHMENT }} aria-hidden="true" />
            <div className="absolute -top-3 right-8 w-6 h-6 rounded-full" style={{ backgroundColor: PARCHMENT }} aria-hidden="true" />

            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs tracking-[0.2em] uppercase mb-3 text-center">
              Send a Dispatch
            </p>
            <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl sm:text-3xl md:text-4xl italic font-normal mb-8 text-center">
              Send Us A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="w-full px-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="w-full px-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2"
                  placeholder="your@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  style={inputStyle}
                  className="w-full px-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2"
                  placeholder="Regarding your trek..."
                />
              </div>

              <div>
                <label htmlFor="message" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="w-full px-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2 resize-y min-h-[120px]"
                  placeholder="Tell us about your adventure plans..."
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: INK, color: SAFFRON }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-base shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ borderColor: SAFFRON, borderTopColor: 'transparent' }} className="w-5 h-5 border-2 rounded-full animate-spin mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-3 text-lg" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-28" style={{ backgroundColor: PARCHMENT_DEEP }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: FONT_MONO, color: CLAY }}
            className="text-xs tracking-[0.2em] uppercase mb-3 text-center"
          >
            Coordinates
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontFamily: FONT_DISPLAY, color: INK }}
            className="text-3xl sm:text-4xl md:text-5xl italic font-normal mb-10 text-center"
          >
            Find Us On The Map
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{ border: `10px solid ${PARCHMENT}`, outline: `2px dashed ${JUNIPER}44` }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109522.94328700451!2d87.34927577876773!3d26.6307242661531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef65ca2e795c05%3A0xae018d58e323458a!2sBelbari%2056600!5e1!3m2!1sen!2snp!4v1750388510241!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
}