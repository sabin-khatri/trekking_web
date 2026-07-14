import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Users, MapPin } from 'lucide-react';
import { treks } from '../../data/treks';

const CUSTOMERS = [
  { name: 'John Wilson', origin: 'United States' },
  { name: 'Mingma Sherpa', origin: 'Namche Bazaar' },
  { name: 'Sarah Jenkins', origin: 'United Kingdom' },
  { name: 'Hiroshi Tanaka', origin: 'Japan' },
  { name: 'Elena Rostova', origin: 'Russia' },
  { name: 'Sanjay Shrestha', origin: 'Kathmandu' },
  { name: 'Sophie Martin', origin: 'France' },
  { name: 'David Miller', origin: 'Canada' },
  { name: 'Maya Patel', origin: 'Australia' },
  { name: 'Clara Schmidt', origin: 'Germany' },
  { name: 'Sonam Tamang', origin: 'Lukla' }
];

export default function LiveBookingNotifier() {
  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    // Schedule periodic alerts
    const interval = setInterval(() => {
      // Pick a random customer
      const customer = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
      // Pick a random trek
      const trek = treks[Math.floor(Math.random() * treks.length)];
      
      // Calculate a random passenger count (1-4)
      const paxCount = Math.floor(Math.random() * 4) + 1;
      
      setActiveNotification({
        name: customer.name,
        origin: customer.origin,
        trekName: trek.name,
        duration: trek.duration,
        pax: paxCount,
        timeAgo: 'Just now'
      });

      // Clear after 6 seconds
      setTimeout(() => {
        setActiveNotification(null);
      }, 6000);

    }, 22000); // Trigger every 22 seconds

    // Initial trigger after 4 seconds
    const initialTimeout = setTimeout(() => {
      const customer = CUSTOMERS[0];
      const trek = treks[0];
      setActiveNotification({
        name: customer.name,
        origin: customer.origin,
        trekName: trek.name,
        duration: trek.duration,
        pax: 2,
        timeAgo: 'Just now'
      });
      setTimeout(() => setActiveNotification(null), 6000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[99999] pointer-events-none max-w-sm">
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-white/10 text-white p-4.5 rounded-2xl shadow-2xl flex gap-3.5 relative overflow-hidden"
          >
            {/* Ambient side indicator bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-emerald-500 to-teal-500"></div>
            
            <div className="flex-1 pl-1.5">
              <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles size={11} className="animate-pulse" /> Live Booking Activity
              </div>
              
              <p className="text-slate-200 text-xs leading-normal font-light">
                <strong className="text-white font-bold">{activeNotification.name}</strong> ({activeNotification.origin}) 
                {' '}has booked the <strong className="text-emerald-400 font-semibold">{activeNotification.trekName}</strong>.
              </p>
              
              <div className="flex items-center gap-4 text-[10px] text-slate-400 font-medium mt-2.5 pt-2 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <Calendar size={11} /> {activeNotification.duration} Days
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} /> {activeNotification.pax} Pax
                </span>
                <span className="ml-auto text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                  {activeNotification.timeAgo}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
