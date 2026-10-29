// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
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
import { COMPANY } from '../config/company';
import { IMAGES } from '../config/images';

export default function Footer() {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Our Treks", path: "/packages" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-200 pt-16 pb-12 overflow-hidden border-t border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={IMAGES.logo}
                  alt={`${COMPANY.name} Logo`}
                  className="h-14 w-14 rounded-2xl object-cover shadow-xl ring-2 ring-white/20"
                />
                <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl opacity-10 blur-xl" />
              </div>

              <div>
                <h3 className="text-3xl font-bold tracking-tighter">
                  Apex <span className="text-emerald-400">Himalaya Treks</span>
                </h3>
                <p className="text-emerald-300 text-sm tracking-widest font-medium -mt-1">
                  SINCE {COMPANY.founded}
                </p>
              </div>
            </div>

            <p className="text-green-200/90 text-[15px] leading-relaxed max-w-md">
              {COMPANY.description}
            </p>

            <div className="flex items-center gap-2 text-emerald-400">
              <GiMountainRoad className="text-3xl" />
              <span className="text-sm font-medium tracking-wide text-slate-300">Explore • Trek • Discover</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-lg font-semibold text-emerald-300 mb-6 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3.5 text-green-100">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="group flex items-center gap-2 text-[15px] text-slate-400 hover:text-emerald-400 transition-all duration-300 hover:pl-1"
                  >
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-lg font-semibold text-emerald-300 mb-6 tracking-wide">
              Get In Touch
            </h4>
            
            <div className="space-y-5 text-green-200">
              <a 
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-4 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Email</p>
                  <p>{COMPANY.email}</p>
                </div>
              </a>

              <a 
                href={`tel:${COMPANY.phoneRaw}`}
                className="flex items-center gap-4 hover:text-emerald-400 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Phone / WhatsApp</p>
                  <p>{COMPANY.phone}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 pt-2">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mt-0.5">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-green-300">Visit Us</p>
                  <p>{COMPANY.address}</p>
                  <p className="text-xs text-emerald-300 mt-1">{COMPANY.hours}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex gap-6 text-3xl">
            {[
              { Icon: FaFacebookF, href: COMPANY.social.facebook, label: 'Facebook' },
              { Icon: FaInstagram, href: COMPANY.social.instagram, label: 'Instagram' },
              { Icon: FaTwitter, href: COMPANY.social.twitter, label: 'Twitter' },
              { Icon: FaYoutube, href: COMPANY.social.youtube, label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a 
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-200 hover:text-emerald-400 hover:scale-125 transition-all duration-300"
                aria-label={label}
              >
                <Icon />
              </a>
            ))}
          </div>

          <div className="text-center md:text-right text-green-300 text-sm">
            <p>© {new Date().getFullYear()} {COMPANY.name}. All Rights Reserved.</p>
            <p className="mt-1 text-xs text-green-400/80">
              {COMPANY.license} • Sustainable Tourism •{' '}
              <Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
