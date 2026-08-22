/* eslint-disable no-unused-vars */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, DollarSign, Calendar, MapPin, CheckCircle2,
  Clock, X, Mail, Phone, CreditCard, Mountain, User as UserIcon
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import DetailRow from './Detailrow';

export default function BookingDetailModal({ booking, onClose }) {
  if (!booking) return null;

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
            <div className="relative z-10">
              <p className="text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-2">{booking.id}</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{booking.trek}</h2>
              <div className="mt-3">
                <StatusBadge status={booking.status} />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-8">

            {/* Customer info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Customer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow icon={UserIcon} label="Name" value={booking.name} />
                <DetailRow icon={Mail} label="Email" value={booking.email} />
                <DetailRow icon={Phone} label="Phone" value={booking.phone} />
                <DetailRow icon={Users} label="Travelers" value={`${booking.pax} ${booking.pax > 1 ? 'People' : 'Person'}`} />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Trip info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Trip Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow icon={Calendar} label="Start Date" value={booking.date} />
                <DetailRow icon={Clock} label="Duration" value={booking.duration} />
                <DetailRow icon={MapPin} label="Start Point" value={booking.startPoint} />
                <DetailRow icon={Mountain} label="Difficulty" value={booking.difficulty} />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Payment info */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Payment</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <DetailRow icon={DollarSign} label="Total Amount" value={booking.amount} />
                <DetailRow icon={CreditCard} label="Payment Method" value={booking.paymentMethod} />
                <DetailRow icon={CheckCircle2} label="Paid" value={booking.paid} />
                <DetailRow icon={Clock} label="Due" value={booking.due} />
              </div>
            </div>

            {booking.notes && (
              <>
                <div className="border-t border-slate-100"></div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notes</h3>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4">{booking.notes}</p>
                </div>
              </>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-6 sm:px-8 py-5 bg-slate-50 rounded-b-2xl flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {booking.status === 'pending' && (
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                Confirm Booking
              </button>
            )}
            {booking.status !== 'cancelled' && (
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors">
                Cancel Booking
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}