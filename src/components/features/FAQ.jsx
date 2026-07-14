import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Search, HelpCircle, Shield, Backpack, CreditCard, Compass } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: Compass },
  { id: 'general', label: 'General Info', icon: HelpCircle },
  { id: 'safety', label: 'Safety & Altitude', icon: Shield },
  { id: 'gear', label: 'Gear & Packing', icon: Backpack },
  { id: 'booking', label: 'Bookings & Payments', icon: CreditCard }
];

const faqs = [
  {
    question: "What is the best time to trek in Nepal?",
    answer: "The best times are generally during the spring (March to May) and autumn (September to November) seasons. These months offer clear skies, stable weather, and optimal visibility.",
    category: "general"
  },
  {
    question: "Do I need previous trekking experience?",
    answer: "It depends on the trek. We offer treks for all levels. Moderate treks like Poon Hill are suitable for beginners with basic fitness, while EBC or Manaslu require good physical condition and mental stamina.",
    category: "general"
  },
  {
    question: "Is travel insurance mandatory?",
    answer: "Yes, comprehensive travel insurance that covers emergency helicopter evacuation up to 6,000 meters and medical expenses is mandatory for all our high-altitude treks.",
    category: "safety"
  },
  {
    question: "What about altitude sickness (AMS)?",
    answer: "Our itineraries are designed with proper acclimatization days. Our guides are trained in wilderness first aid and carry pulse oximeters to monitor your oxygen levels daily. If severe symptoms occur, immediate descent is prioritized.",
    category: "safety"
  },
  {
    question: "Can I rent trekking gear in Kathmandu or Pokhara?",
    answer: "Yes! High-quality gear such as down jackets, sleeping bags, trekking poles, and backpacks are widely available for rent at very reasonable daily rates in both Thamel (Kathmandu) and Lakeside (Pokhara).",
    category: "gear"
  },
  {
    question: "How do I secure my booking?",
    answer: "We require a 20% non-refundable deposit to secure your trek reservation, permits, and guides. The remaining balance can be paid in cash or credit card upon arrival in Kathmandu before the trek begins.",
    category: "booking"
  },
  {
    question: "Are meals and drinking water included in the package?",
    answer: "Yes, all meals (breakfast, lunch, and dinner) during the trek are included. For drinking water, we recommend bringing reusable bottles and water purification tablets/filters to minimize environmental waste.",
    category: "gear"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Filter FAQs based on search query & active category
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 text-forest-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-forest-100">
            Support Center
          </span>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto font-light">
            Got questions? Search our compiled resource center to prepare for your Himalayan trek.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Search FAQs (e.g., altitude, gear, deposit)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4.5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:border-forest-600 focus:ring-2 focus:ring-forest-600/10 outline-none text-slate-800 font-medium transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setOpenIndex(0); // reset open accordion
                }}
                className={`
                  flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer
                  ${isSelected 
                    ? 'bg-forest-900 text-white shadow-lg shadow-forest-950/20' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }
                `}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div 
                    layout
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 text-base sm:text-lg pr-4">{faq.question}</span>
                      <ChevronDown 
                        className={`text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-forest-600' : ''}`} 
                        size={20} 
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-5 text-slate-600 border-t border-slate-200/50 pt-4 text-sm sm:text-base font-light leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                layout
                className="text-center py-12 text-slate-500 font-light"
              >
                No matching FAQs found for query: <strong>"{searchQuery}"</strong>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
