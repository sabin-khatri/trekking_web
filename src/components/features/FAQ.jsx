import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the best time to trek in Nepal?",
    answer: "The best times are generally during the spring (March to May) and autumn (September to November) seasons. These months offer clear skies, stable weather, and optimal visibility."
  },
  {
    question: "Do I need previous trekking experience?",
    answer: "It depends on the trek. We offer treks for all levels. Moderate treks like Poon Hill are suitable for beginners with basic fitness, while EBC or Manaslu require good physical condition and mental stamina."
  },
  {
    question: "Is travel insurance mandatory?",
    answer: "Yes, comprehensive travel insurance that covers emergency helicopter evacuation up to 6,000 meters and medical expenses is mandatory for all our high-altitude treks."
  },
  {
    question: "What about altitude sickness (AMS)?",
    answer: "Our itineraries are designed with proper acclimatization days. Our guides are trained in wilderness first aid and carry pulse oximeters to monitor your oxygen levels daily. If severe symptoms occur, immediate descent is prioritized."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-forest-600 tracking-widest uppercase mb-2">FAQ</h2>
          <h3 className="text-4xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h3>
          <p className="text-slate-600 text-lg">Got questions? We've got answers to help you prepare for your Himalayan adventure.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-slate-800 text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`text-forest-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  size={24} 
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-5 text-slate-600 border-t border-slate-200/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
