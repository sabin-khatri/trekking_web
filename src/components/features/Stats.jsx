/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, useInView, animate } from 'motion/react';
import { Users, Mountain, Award, Map } from 'lucide-react';
import confetti from 'canvas-confetti';

const stats = [
  { label: 'Happy Trekkers', value: 5000, suffix: '+', icon: Users, milestone: true },
  { label: 'Years Experience', value: 15, suffix: '+', icon: Award },
  { label: 'Trekking Routes', value: 50, suffix: '+', icon: Map },
  { label: 'Highest Alt (m)', value: 5545, suffix: '', icon: Mountain, milestone: true },
];

function Counter({ value, suffix, milestone }) {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (val) => setCount(Math.floor(val)),
        onComplete: () => {
          if (milestone) {
            // Trigger confetti
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#10b981', '#059669', '#34d399', '#ffffff']
            });
          }
        }
      });
      return controls.stop;
    }
  }, [isInView, value, milestone]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="py-20 bg-green-700 text-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Icon size={32} className="text-green-100" />
                </div>
                <h4 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight text-white">
                  <Counter value={stat.value} suffix={stat.suffix} milestone={stat.milestone} />
                </h4>
                <p className="text-green-100 font-medium text-lg">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}