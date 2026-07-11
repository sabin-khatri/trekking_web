/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Phone, MapPin, Calendar, DollarSign, Mountain } from 'lucide-react';
import DetailRow from './DetailRow';

export default function CustomerDetailModal({ customer, onClose }) {
  if (!customer) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-slate-950 px-6 py-6 sm:px-8 sm:py-7 relative overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
            <button
              onClick={onClose}
              className="absolute top-5 right-5 sm:top-6 sm:right-6 text-slate-400 hover:text-white transition-colors z-10"
            >
              <X size={22} />
            </button>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-bold shrink-0">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-1">{customer.id}</p>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{customer.name}</h2>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  customer.type === 'returning' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-sky-500/20 text-sky-300'
                }`}>
                  {customer.type === 'returning' ? 'Returning Customer' : 'New Customer'}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-8">

            {/* Contact info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow icon={Mail} label="Email" value={customer.email} />
                <DetailRow icon={Phone} label="Phone" value={customer.phone} />
                <DetailRow icon={MapPin} label="Country" value={customer.country} />
                <DetailRow icon={Calendar} label="Customer Since" value={customer.joined} />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Summary */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Summary</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{customer.totalTreks}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Total Treks</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-slate-800">{customer.totalSpend}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Total Spend</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
                  <p className="text-sm font-bold text-slate-800 truncate">{customer.lastTrek}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">Last Trek</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Trek history */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trek History</h3>
              <div className="space-y-3">
                {customer.history.map((trip, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Mountain size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{trip.trek}</p>
                        <p className="text-xs text-slate-500">{trip.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-slate-700">{trip.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50 rounded-b-2xl flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}