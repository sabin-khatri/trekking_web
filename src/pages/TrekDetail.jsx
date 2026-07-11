/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTrek } from '../hooks/useTreks';
import BookingModal from '../components/features/BookingModal';
import GearChecklist from '../components/features/GearChecklist';
import { MapPin, Clock, ArrowLeft, Mountain, CheckCircle2 } from 'lucide-react';

export default function TrekDetail() {
  const { id } = useParams();
  const { trek, loading, error } = useTrek(id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !trek) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Trek Not Found</h2>
        <p className="text-slate-600 mb-8">We couldn't find the trek you're looking for.</p>
        <Link to="/packages" className="bg-forest-600 text-white px-6 py-3 rounded-xl hover:bg-forest-700 transition-colors">
          Browse All Treks
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <img src={trek.image} alt={trek.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 md:pb-20">
            <Link to="/packages" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={20} className="mr-2" /> Back to Packages
            </Link>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-block px-3 py-1 bg-emerald-500/80 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                {trek.category}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{trek.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center"><MapPin size={20} className="mr-2 text-emerald-400" /> {trek.location}</div>
                <div className="flex items-center"><Clock size={20} className="mr-2 text-emerald-400" /> {trek.duration} Days</div>
                {trek.maxAltitude && (
                  <div className="flex items-center"><Mountain size={20} className="mr-2 text-emerald-400" /> Max Alt: {trek.maxAltitude}</div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed">{trek.description}</p>
              <p className="text-lg text-slate-600 leading-relaxed mt-4">
                Experience the majestic Himalayas like never before. This carefully curated itinerary ensures proper acclimatization while taking you through ancient trails, authentic villages, and pristine landscapes.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">What's Included</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Airport pick-up and drop-off', 'All necessary trekking permits', 'Experienced English-speaking guide', 'Accommodation during the trek', 'Three meals a day (B, L, D)', 'First aid medical kit'].map((item, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="text-emerald-500 mt-1 mr-3 shrink-0" size={20} />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>
            </section>
            
            {trek.itinerary && trek.itinerary.length > 0 && (
              <section className="mt-16 pt-8 border-t border-slate-100">
                <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center md:text-left">Day-by-Day Itinerary</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-300 before:to-transparent">
                  {trek.itinerary.map((day, index) => (
                    <motion.div 
                      key={day.day}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white font-bold shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                        {day.day}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
                        <h3 className="font-bold text-slate-800 text-xl mb-2">{day.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{day.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <GearChecklist />
            
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <div className="mb-6">
                <p className="text-slate-500 font-medium mb-1">Starting from</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-slate-800">Rs. {trek.price.toLocaleString()}</span>
                  <span className="text-slate-500 ml-2">/ person</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Duration</span>
                  <span className="font-semibold text-slate-800">{trek.duration} Days</span>
                </li>
                <li className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Difficulty</span>
                  <span className="font-semibold text-slate-800 capitalize">{trek.category}</span>
                </li>
                <li className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-slate-600">Group Size</span>
                  <span className="font-semibold text-slate-800">2-12 Pax</span>
                </li>
              </ul>
              
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all duration-300"
              >
                Book This Trek
              </button>
            </div>
          </div>

        </div>
      </div>

      <BookingModal trek={trek} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
    </div>
  );
}
