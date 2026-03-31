// src/components/Footer.jsx
import React from "react";

// react-icons imports
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
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          
        
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              {/* Logo Image */}
              <img
                src="src/assets/img/logo.png"
                alt="Nepal Treks Logo"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover bg-white p-1.5 shadow-md"
              />
              {/* Brand Name */}
             
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Nepal<span className="text-green-400">Treks</span>
              </h3>
            </div>
            <p className="text-green-200 text-sm sm:text-base leading-relaxed">
              Unforgettable Himalayan journeys since 2010.<br />
              Authentic, safe, and sustainable trekking experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-green-300 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm sm:text-base text-green-100">
              <li>
                <a 
                  href="/" 
                  className="hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="/packages" 
                  className="hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Our Treks
                </a>
              </li>
              <li>
                <a 
                  href="/gallery" 
                  className="hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a 
                  href="/contact" 
                  className="hover:text-green-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-green-300 mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm sm:text-base text-green-200">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-green-400 text-xl flex-shrink-0" />
                <a 
                  href="mailto:info@nepaltreks.com" 
                  className="hover:text-green-400 transition-colors"
                >
                  info@nepaltreks.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-green-400 text-xl flex-shrink-0" />
                <a 
                  href="tel:+9779747433572" 
                  className="hover:text-green-400 transition-colors"
                >
                  +977 9747433572
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-green-400 text-xl flex-shrink-0 mt-1" />
                <span>
                  Belbari, Morang, Nepal<br />
                  <span className="text-green-300 text-sm">Sun–Fri, 9:00 AM – 6:00 PM</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg sm:text-xl font-semibold text-green-300 mb-5">
              Follow Us
            </h4>
            <div className="flex gap-6">
              <a 
                href="#" 
                className="text-3xl text-green-200 hover:text-green-400 hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="text-3xl text-green-200 hover:text-green-400 hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="text-3xl text-green-200 hover:text-green-400 hover:scale-110 transition-all duration-300"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="text-3xl text-green-200 hover:text-green-400 hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </div>
          </div>

        </div>

     
        <div className="mt-12 pt-8 border-t border-green-700 text-center text-green-200 text-sm md:text-base">
          <p>© {new Date().getFullYear()} Nepal Treks. All Rights Reserved.</p>
          <p className="mt-2 text-green-300 text-xs md:text-sm">
            Crafted with passion for the mountains.
          </p>
        </div>
      </div>
    </footer>
  );
}