import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useScroll } from 'motion/react';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 origin-left z-[100]"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
