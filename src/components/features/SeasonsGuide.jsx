/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'motion/react';
import { Sun, CloudRain, Snowflake, Leaf } from 'lucide-react';

const seasons = [
  {
    name: 'Spring',
    months: 'Mar - May',
    description: 'Vibrant rhododendrons, mild weather, and clear mountain views. Second most popular season.',
    icon: Leaf,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    rating: 'Excellent'
  },
  {
    name: 'Monsoon',
    months: 'Jun - Aug',
    description: 'Heavy rain, leeches, and muddy trails. Great for rain-shadow areas like Upper Mustang.',
    icon: CloudRain,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    rating: 'Poor/Specialized'
  },
  {
    name: 'Autumn',
    months: 'Sep - Nov',
    description: 'Perfect weather, crystal clear skies, and comfortable temperatures. The absolute best time to trek.',
    icon: Sun,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    rating: 'Excellent (Peak)'
  },
  {
    name: 'Winter',
    months: 'Dec - Feb',
    description: 'Cold and snowy. High passes may be closed, but the trails are quiet and skies are crystal clear.',
    icon: Snowflake,
    color: 'text-sky-500',
    bg: 'bg-sky-50',
    rating: 'Fair/Challenging'
  }
];

export default function SeasonsGuide() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-forest-600 tracking-widest uppercase mb-2">When to go</h2>
          <h3 className="text-4xl font-extrabold text-slate-800 mb-4">Nepal Trekking Seasons</h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Nepal's climate varies greatly with altitude and season. Choosing the right time for your trek is crucial for the best experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasons.map((season, index) => {
            const Icon = season.icon;
            return (
              <motion.div
                key={season.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className={`${season.bg} rounded-3xl p-8 border border-white shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300`}
              >
                <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Icon size={120} className={season.color} />
                </div>
                
                <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm`}>
                  <Icon size={28} className={season.color} />
                </div>
                
                <h4 className="text-2xl font-bold text-slate-800 mb-1">{season.name}</h4>
                <p className="text-slate-500 font-medium text-sm mb-4">{season.months}</p>
                <p className="text-slate-700 mb-6 relative z-10">{season.description}</p>
                
                <div className="mt-auto">
                  <span className="inline-block px-3 py-1 bg-white text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {season.rating}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
