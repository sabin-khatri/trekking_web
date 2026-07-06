/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

const locations = [
  { name: 'Everest Base Camp', temp: -5, condition: 'Snow', icon: CloudRain, color: 'text-blue-400' },
  { name: 'Namche Bazaar', temp: 2, condition: 'Clear', icon: Sun, color: 'text-yellow-400' },
  { name: 'Annapurna Base Camp', temp: -2, condition: 'Cloudy', icon: Cloud, color: 'text-slate-400' },
  { name: 'Pokhara', temp: 18, condition: 'Windy', icon: Wind, color: 'text-teal-400' },
];

export default function WeatherWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % locations.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl w-64 absolute top-24 right-8 z-20 hidden lg:block">
      <div className="text-white/80 text-xs font-bold uppercase tracking-wider mb-3">Live Conditions</div>
      
      <div className="relative h-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-between"
          >
            <div>
              <h4 className="text-white font-bold text-sm">{locations[currentIndex].name}</h4>
              <div className="text-white/80 text-xs">{locations[currentIndex].condition}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">{locations[currentIndex].temp}°C</span>
              {React.createElement(locations[currentIndex].icon, { className: `w-6 h-6 ${locations[currentIndex].color}` })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
