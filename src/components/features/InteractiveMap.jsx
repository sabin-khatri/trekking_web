import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Mountain, DollarSign, ArrowRight, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { treks } from '../../data/treks';

// Coordinates plotted on our custom 800x400 SVG Map of Nepal
const mapPins = [
  { id: 'everest-base-camp', name: 'Everest Base Camp', x: 590, y: 195, region: 'Khumbu/Everest' },
  { id: 'annapurna-circuit', name: 'Annapurna Circuit', x: 320, y: 200, region: 'Annapurna' },
  { id: 'langtang-valley', name: 'Langtang Valley', x: 470, y: 215, region: 'Langtang' },
  { id: 'gokyo-lakes-trek', name: 'Gokyo Lakes', x: 570, y: 185, region: 'Khumbu/Everest' },
  { id: 'manaslu-circuit', name: 'Manaslu Circuit', x: 400, y: 195, region: 'Manaslu' },
  { id: 'poon-hill-trek', name: 'Poon Hill', x: 290, y: 220, region: 'Annapurna' },
  { id: 'mardi-himal-trek', name: 'Mardi Himal', x: 305, y: 210, region: 'Annapurna' },
  { id: 'upper-mustang-trek', name: 'Upper Mustang', x: 280, y: 120, region: 'Mustang' },
  { id: 'kanchenjunga-base-camp', name: 'Kanchenjunga', x: 730, y: 250, region: 'Eastern Nepal' },
];

export default function InteractiveMap() {
  const [activePin, setActivePin] = useState(null);

  // Find trek data
  const getTrekData = (id) => {
    return treks.find(t => t.id === id);
  };

  return (
    <section className="py-24 bg-slate-900 text-white overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-950 to-slate-950 z-0"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/20">
            <Compass size={12} className="animate-spin-slow" /> Geographical Guide
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-white">Interactive Nepal Trekking Map</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Locate the country's most legendary trails. Select any pin to explore routes, durations, altitudes, and booking links.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-950/50 border border-white/10 rounded-3xl p-4 sm:p-8 shadow-2xl overflow-x-auto">
          <div className="min-w-[800px] relative mx-auto h-[420px]">
            
            {/* SVG Background Path representing stylized Nepal */}
            <svg 
              viewBox="0 0 800 400" 
              className="w-full h-full opacity-35 select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <linearGradient id="nepalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#064e3b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#083344" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Stylized Nepal Shape */}
              <path 
                d="M 50,160 C 150,110 280,130 420,160 C 560,190 680,210 770,230 C 780,270 760,320 740,340 C 650,300 520,290 410,280 C 300,270 180,260 80,240 C 60,200 50,180 50,160 Z" 
                fill="url(#nepalGradient)" 
                stroke="rgba(16, 185, 129, 0.4)" 
                strokeWidth="2.5"
                strokeDasharray="4 2"
              />

              {/* Major Mountain Icon Decorations */}
              <g fill="rgba(255,255,255,0.15)">
                {/* Everest */}
                <polygon points="585,150 595,130 605,150" />
                <polygon points="575,155 585,120 595,155" />
                {/* Annapurna */}
                <polygon points="310,160 320,135 330,160" />
                <polygon points="300,165 310,140 320,165" />
                {/* Langtang */}
                <polygon points="460,170 470,145 480,170" />
              </g>

              {/* Region Labels */}
              <text x="260" y="100" fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="bold" letterSpacing="2">MUSTANG</text>
              <text x="310" y="270" fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="bold" letterSpacing="2">ANNAPURNA</text>
              <text x="440" y="260" fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="bold" letterSpacing="2">LANGTANG</text>
              <text x="560" y="260" fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="bold" letterSpacing="2">KHUMBU (EVEREST)</text>
              <text x="700" y="300" fill="rgba(255,255,255,0.2)" fontSize="11" fontWeight="bold" letterSpacing="2">EASTERN</text>
            </svg>

            {/* Pins overlay */}
            {mapPins.map((pin) => {
              const isActive = activePin?.id === pin.id;
              const trek = getTrekData(pin.id);
              if (!trek) return null;

              return (
                <div
                  key={pin.id}
                  className="absolute"
                  style={{ left: `${(pin.x / 800) * 100}%`, top: `${(pin.y / 400) * 100}%` }}
                >
                  {/* Pin Button */}
                  <button
                    onClick={() => setActivePin(isActive ? null : pin)}
                    className="relative -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none z-20"
                  >
                    {/* Ripple Rings */}
                    <span className="absolute inset-0 rounded-full h-8 w-8 -translate-x-1/4 -translate-y-1/4 bg-emerald-500/20 group-hover:bg-emerald-500/30 animate-ping"></span>
                    <span className={`absolute inset-0 rounded-full h-4 w-4 bg-emerald-500/40 border border-emerald-400 group-hover:scale-125 transition-transform ${isActive ? 'scale-125 bg-red-500/40 border-red-400' : ''}`}></span>
                    <MapPin 
                      size={18} 
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive 
                          ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]' 
                          : 'text-emerald-400 group-hover:text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]'
                      }`} 
                    />
                  </button>
                </div>
              );
            })}

            {/* Hover/Click Tooltip details card */}
            <AnimatePresence>
              {activePin && (() => {
                const trek = getTrekData(activePin.id);
                if (!trek) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute bg-slate-950/80 backdrop-blur-xl border border-white/20 p-5 rounded-2xl w-72 shadow-2xl z-30"
                    style={{
                      left: activePin.x > 500 ? 'auto' : `${(activePin.x / 800) * 100}%`,
                      right: activePin.x > 500 ? `${100 - (activePin.x / 800) * 100}%` : 'auto',
                      top: activePin.y > 250 ? `${((activePin.y - 200) / 400) * 100}%` : `${((activePin.y + 20) / 400) * 100}%`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase tracking-wider font-semibold">
                          {activePin.region}
                        </span>
                        <h4 className="text-white font-bold text-base mt-1.5 leading-snug">{trek.name}</h4>
                      </div>
                      <button 
                        onClick={() => setActivePin(null)}
                        className="text-slate-400 hover:text-white text-xs font-semibold px-1 rounded hover:bg-white/10"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-slate-300 text-xs font-light leading-relaxed mb-4 line-clamp-2">
                      {trek.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 text-xs border-y border-white/5 py-2.5 mb-4">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar size={13} className="text-emerald-400" />
                        <span>{trek.duration} Days</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Mountain size={13} className="text-emerald-400" />
                        <span>{trek.maxAltitude || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Price and Link */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-bold">Estimated</span>
                        <span className="text-emerald-400 font-extrabold text-sm flex items-center">
                          Rs. {trek.price.toLocaleString()}
                        </span>
                      </div>
                      <Link
                        to={`/packages/${trek.id}`}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
                      >
                        View Details <ArrowRight size={12} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}
