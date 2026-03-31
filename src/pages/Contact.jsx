// src/pages/Contact.jsx
import { useState, useEffect } from 'react';
import React from 'react';

// react-icons imports
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaPaperPlane 
} from 'react-icons/fa';

import { GiHiking } from 'react-icons/gi';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill all the required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50">
     
      <header 
        className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center text-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1740&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/65" />

        <div className="relative z-10 px-5 sm:px-8 max-w-5xl mx-auto">
          <h1
            className="
              text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold
              bg-gradient-to-r from-green-300 via-emerald-200 to-teal-200 bg-clip-text text-transparent
              leading-tight drop-shadow-xl animate-on-scroll
            "
          >
            Get In Touch
          </h1>
          <p
            className="mt-4 sm:mt-6 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto text-slate-100 animate-on-scroll"
            style={{ animationDelay: '0.2s' }}
          >
            Plan your unforgettable Himalayan adventure with us.
          </p>
          <a
            href="#contact-form"
            className="
              mt-8 sm:mt-10 inline-flex items-center gap-3
              bg-gradient-to-r from-green-600 to-emerald-700
              hover:from-green-700 hover:to-emerald-800
              text-white px-7 py-4 rounded-full font-semibold text-base sm:text-lg
              transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg
              animate-on-scroll
            "
            style={{ animationDelay: '0.4s' }}
          >
            <FaEnvelope className="text-xl sm:text-2xl" />
            Send a Message
          </a>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Left - Contact Info */}
          <div className="animate-on-scroll fadeInUp order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-6">
              Connect With Us
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Questions about packages, custom itineraries, or just want to say hello?  
              Our team is here to assist you.
            </p>

            <div className="space-y-6 md:space-y-8">
            
              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl shadow-md">
                    <FaEnvelope />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Email Us</h3>
                  <p className="text-slate-600 mt-1">For inquiries, support, and bookings.</p>
                  <a
                    href="mailto:info@nepaltreks.com"
                    className="text-green-700 hover:text-green-800 font-medium text-lg mt-2 block"
                  >
                    info@nepaltreks.com
                  </a>
                </div>
              </div>

      
              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl shadow-md">
                    <FaPhoneAlt />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Call Us</h3>
                  <p className="text-slate-600 mt-1">Speak directly with our friendly team.</p>
                  <a
                    href="tel:+9779747433572"
                    className="text-green-700 hover:text-green-800 font-medium text-lg mt-2 block"
                  >
                    +977 9747433572
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-5 p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl shadow-md">
                    <FaMapMarkerAlt />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">Visit Our Office</h3>
                  <p className="text-slate-600 mt-1">Belbari, Morang, Nepal</p>
                  <p className="text-slate-600 mt-1">Open Sun–Fri, 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          
          <div
            id="contact-form"
            className="bg-white p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl border border-green-100 animate-on-scroll scaleIn order-1 md:order-2"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 mb-8 text-center">
              Send Us A Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="your@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Regarding your trek..."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-y min-h-[120px]"
                  placeholder="Tell us about your adventure plans..."
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    inline-flex items-center px-8 py-4 rounded-full text-white font-semibold text-base sm:text-lg
                    transition-all duration-300 transform hover:scale-105
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
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="py-16 md:py-20 lg:py-28 bg-slate-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-800 mb-10 text-center animate-on-scroll">
            Find Us On The Map
          </h2>
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-green-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109522.94328700451!2d87.34927577876773!3d26.6307242661531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef65ca2e795c05%3A0xae018d58e323458a!2sBelbari%2056600!5e1!3m2!1sen!2snp!4v1750388510241!5m2!1sen!2snp"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full text-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <GiHiking className="text-5xl text-green-700" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4">
              Success!
            </h2>
            <p className="text-base sm:text-lg text-slate-700 mb-8">
              Your message has been submitted successfully.<br />
              We'll get back to you soon.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-full font-semibold hover:from-green-700 hover:to-green-900 transition-all hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}