import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Map, Compass } from 'lucide-react';
import SEO from '../components/common/SEO';
import { COMPANY } from '../config/company';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-6 relative overflow-hidden">
      <SEO 
        title="404 - Lost off the trail" 
        description="The page you are looking for does not exist."
      />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Map size={600} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-10 max-w-lg text-center relative z-10 border border-slate-100"
      >
        <div className="w-24 h-24 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Compass size={48} />
        </div>
        
        <h1 className="text-6xl font-black text-slate-800 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-700 mb-4">Lost off the trail?</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Looks like you've ventured into uncharted territory. The page you're looking for has moved, been deleted, or never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-forest-500/30 transition-all text-center"
          >
            Back to {COMPANY.shortName}
          </Link>
          <Link
            to="/packages"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full transition-all text-center"
          >
            Find a Trek
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
