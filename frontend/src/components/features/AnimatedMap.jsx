import React from 'react';
import { motion } from 'motion/react';
import { Mountain } from 'lucide-react';

const pathVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1,
    transition: { duration: 2.5, ease: "easeInOut", delay: 0.5 }
  }
};

const pointVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i) => ({
    scale: 1, 
    opacity: 1,
    transition: { delay: 0.5 + (i * 0.5), type: "spring", stiffness: 200 }
  })
};

const points = [
  { cx: 50, cy: 300, name: 'Lukla (2840m)', time: 'Day 1' },
  { cx: 200, cy: 250, name: 'Namche (3440m)', time: 'Day 3' },
  { cx: 400, cy: 200, name: 'Tengboche (3860m)', time: 'Day 5' },
  { cx: 600, cy: 150, name: 'Dingboche (4410m)', time: 'Day 6' },
  { cx: 750, cy: 50, name: 'EBC (5364m)', time: 'Day 9' }
];

export default function AnimatedMap() {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden rounded-3xl mx-4 my-12 shadow-2xl relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-forest-400 tracking-widest uppercase mb-2">The Journey</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4">Trail to Everest</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">Visualize the iconic route to the roof of the world.</p>
        </div>

        <div className="w-full overflow-x-auto pb-8">
          <div className="min-w-[800px] h-[400px] relative mx-auto">
            {/* Mountain Silhouettes */}
            <svg className="absolute inset-0 w-full h-full text-slate-800" viewBox="0 0 800 400" preserveAspectRatio="none">
              <path d="M0,400 L0,350 L150,200 L250,280 L400,100 L550,250 L650,80 L800,200 L800,400 Z" fill="currentColor" />
              <path d="M100,400 L200,150 L350,300 L500,50 L650,200 L800,100 L800,400 Z" fill="#1e293b" opacity="0.6" />
            </svg>

            {/* Animated Path */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
              <motion.path
                d="M 50 300 Q 150 250 200 250 T 400 200 T 600 150 Q 700 50 750 50"
                fill="transparent"
                stroke="#10b981" // emerald-500
                strokeWidth="4"
                strokeDasharray="10 5"
                variants={pathVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
              />
            </svg>

            {/* Animated Points */}
            {points.map((point, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={pointVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="absolute flex flex-col items-center"
                style={{ left: point.cx, top: point.cy, transform: 'translate(-50%, -50%)' }}
              >
                <div className="w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.8)] z-10" />
                <div className="mt-2 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap">
                  <div className="text-xs text-emerald-400 font-bold">{point.time}</div>
                  <div className="text-sm font-semibold">{point.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
