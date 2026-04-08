// src/components/Footer.jsx
import React from "react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt 
} from 'react-icons/fa';
import { GiMountainRoad } from 'react-icons/gi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-950 via-green-900 to-emerald-950 text-white pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/src/assets/img/logo.png"
                  alt="Nepal Treks Logo"
                  className="h-14 w-14 rounded-2xl object-cover shadow-xl ring-2 ring-white/20 bg-white p-1.5"
                />
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl opacity-10 blur-xl" />
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tighter">
                  Nepal<span className="text-emerald-400">Treks</span>
                </h3>
                <p className="text-emerald-300 text-sm tracking-widest font-medium -mt-1">
                  SINCE 2010
                </p>
              </div>
            </div>

            <p className="text-green-200/90 text-[15px] leading-relaxed max-w-md">
              Unforgettable Himalayan journeys since 2010.<br />
              Authentic, safe, and sustainable trekking experiences in the heart of Nepal.
            </p>

            <div className="flex items-center gap-2 text-emerald-400">
              <GiMountainRoad className="text-3xl" />
              <span className="text-sm font-medium tracking-wide">Explore • Trek • Discover</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold text-emerald-300 mb-6 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-green-100">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Our Treks", href: "/packages" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="group flex items-center gap-2 text-[15px] hover:text-emerald-400 transition-all duration-300 hover:pl-1"
                  >
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold text-emerald-300 mb-6 tracking-wide">
              Get In Touch
            </h4>
            
            <div className="space-y-5 text-green-200">
              <a 
                href="mailto:info@nepaltreks.com" 
                className="flex items-center gap-4 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Email</p>
                  <p>info@nepaltreks.com</p>
                </div>
              </a>

              <a 
                href="tel:+9779747433572" 
                className="flex items-center gap-4 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Phone</p>
                  <p>+977 9747433572</p>
                </div>
              </a>

              <div className="flex items-start gap-4 pt-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mt-0.5">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Visit Us</p>
                  <p>Belbari, Morang, Nepal</p>
                  <p className="text-xs text-emerald-300 mt-1">
                    Sun – Fri, 9:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="mt-16 pt-10 border-t border-green-800 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex gap-6 text-3xl">
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-200 hover:text-emerald-400 hover:scale-125 transition-all duration-300"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-200 hover:text-emerald-400 hover:scale-125 transition-all duration-300"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-200 hover:text-emerald-400 hover:scale-125 transition-all duration-300"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-200 hover:text-emerald-400 hover:scale-125 transition-all duration-300"
              aria-label="YouTube"
            >
              <FaYoutube />
            </a>
          </div>

          <div className="text-center md:text-right text-green-300 text-sm">
            <p>© {new Date().getFullYear()} Nepal Treks. All Rights Reserved.</p>
            <p className="mt-1 text-xs text-green-400/80">
              Crafted with passion for the mountains • Sustainable Tourism
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}