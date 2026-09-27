import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // alert('Login logic here');
    }, 1500);
  };

  const inputStyle = {
    backgroundColor: PARCHMENT,
    borderColor: `${JUNIPER}44`,
    color: INK,
    fontFamily: FONT_BODY,
  };

  return (
    <div style={{ backgroundColor: PARCHMENT, minHeight: '100vh', fontFamily: FONT_BODY }} className="pt-24 pb-16 flex items-center justify-center">
      <SEO 
        title="Login - Trekking App" 
        description="Login to your account to manage your trekking plans and bookings."
      />
      
      <div className="w-full max-w-md px-5 sm:px-6">
        <div className="mb-6">
          <Link 
            to="/" 
            style={{ color: '#5B6660', fontFamily: FONT_MONO }} 
            className="inline-flex items-center text-sm font-semibold hover:opacity-70 transition-opacity"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl p-8 sm:p-10 shadow-xl relative"
          style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}
        >
          {/* Decorative pins */}
          <div className="absolute -top-3 left-8 w-6 h-6 rounded-full" style={{ backgroundColor: PARCHMENT }} aria-hidden="true" />
          <div className="absolute -top-3 right-8 w-6 h-6 rounded-full" style={{ backgroundColor: PARCHMENT }} aria-hidden="true" />

          <div className="text-center mb-8">
            <h1 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl italic mb-2">Welcome Back</h1>
            <p style={{ color: '#5B6660', fontFamily: FONT_BODY }} className="text-sm">Enter your credentials to continue your adventure.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaEnvelope style={{ color: JUNIPER }} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaLock style={{ color: JUNIPER }} />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                  className="w-full pl-11 pr-4 py-3.5 rounded-lg border outline-none transition-shadow focus:ring-2"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" style={{ fontFamily: FONT_MONO, color: CLAY }} className="text-xs font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: INK, color: SAFFRON }}
              className="w-full py-4 rounded-lg font-semibold text-base shadow-lg transition-all hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div style={{ borderColor: SAFFRON, borderTopColor: 'transparent' }} className="w-5 h-5 border-2 rounded-full animate-spin mr-2"></div>
              ) : null}
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{ color: '#5B6660', fontFamily: FONT_BODY }} className="text-sm">
              Don't have an account?{' '}
              <Link to="/signup" style={{ fontFamily: FONT_MONO, color: JUNIPER }} className="font-bold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
