// src/pages/Contact.jsx
import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useToast } from '../components/ToastContext';

// react-icons imports
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaPaperPlane 
} from 'react-icons/fa';

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

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Your message has been submitted successfully!', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50  transition-colors duration-300">
      <header 
        ref={heroRef}
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center text-white overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1740&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            y: backgroundY
          }}
        />
        <div className="absolute inset-0 bg-black/65" />

        <motion.div 
          style={{ y: textY }}
          className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
              bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-xl
            "
          >
            Get In Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-slate-100"
          >
            Plan your unforgettable Himalayan adventure with us.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="#contact-form"
            className="
              mt-8 sm:mt-10 inline-flex items-center gap-3
              bg-gradient-to-r from-green-600 to-emerald-700
              hover:from-green-700 hover:to-emerald-800
              text-white px-7 py-4 rounded-full font-semibold text-base sm:text-lg
              transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg
            "
          >
            <FaEnvelope className="text-xl sm:text-2xl" />
            Send a Message
          </motion.a>
        </motion.div>
      </header>

      {/* Contact Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-green-50 to-white   transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800  mb-6">
              Connect With Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600  mb-10 leading-relaxed">
              Questions about packages, custom itineraries, or just want to say hello?  
              Our team is here to assist you.
            </p>

            <div className="space-y-6 md:space-y-8">
              {[
                { icon: <FaEnvelope />, title: 'Email Us', desc: 'For inquiries, support, and bookings.', link: 'mailto:info@nepaltreks.com', linkText: 'info@nepaltreks.com' },
                { icon: <FaPhoneAlt />, title: 'Call Us', desc: 'Speak directly with our friendly team.', link: 'tel:+9779747433572', linkText: '+977 9747433572' },
                { icon: <FaMapMarkerAlt />, title: 'Visit Our Office', desc: 'Open Sun–Fri, 9:00 AM – 6:00 PM', link: null, linkText: 'Belbari, Morang, Nepal' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 10 }}
                  className="flex items-start gap-5 p-5 rounded-2xl bg-white  shadow-md hover:shadow-lg transition-all duration-300 border border-transparent "
                >
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 rounded-full bg-green-600  text-white flex items-center justify-center text-2xl shadow-md">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 ">{item.title}</h3>
                    <p className="text-slate-600  mt-1">{item.desc}</p>
                    {item.link ? (
                      <a href={item.link} className="text-green-700  hover:text-green-800 :text-green-300 font-medium text-lg mt-2 block transition-colors">
                        {item.linkText}
                      </a>
                    ) : (
                      <p className="text-green-700  font-medium text-lg mt-2 block">
                        {item.linkText}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Right - Form */}
          <motion.div
            id="contact-form"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white  p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-green-100  order-1 md:order-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800  mb-8 text-center">
              Send Us A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700  mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300  rounded-xl bg-white  text-slate-900  focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700  mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300  rounded-xl bg-white  text-slate-900  focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="your@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700  mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-slate-300  rounded-xl bg-white  text-slate-900  focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Regarding your trek..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700  mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300  rounded-xl bg-white  text-slate-900  focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y min-h-[120px]"
                  placeholder="Tell us about your adventure plans..."
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base sm:text-lg
                    transition-all duration-300 transform hover:scale-105 w-full sm:w-auto justify-center
                    ${isSubmitting 
                      ? 'bg-green-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 shadow-lg'}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
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

      {/* Google Map */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-100  transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800  mb-10 text-center"
          >
            Find Us On The Map
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl border-4 border-green-200 "
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