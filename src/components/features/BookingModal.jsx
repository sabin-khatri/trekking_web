/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { submitBooking } from '../../services/api';
import { useToast } from '../ToastContext';
import { treks } from '../../data/treks';
import { X, ChevronRight, ChevronLeft, Check, Calendar, Users, Shield, Plus, Briefcase, Home, Clock, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STEPS = [
  { id: 1, label: 'Confirm Trek' },
  { id: 2, label: 'Dates & Group' },
  { id: 3, label: 'Add-ons' },
  { id: 4, label: 'Contact Info' },
  { id: 5, label: 'Review & Pay' }
];

const ADDONS_LIST = [
  { id: 'porter', name: 'Personal Porter Service', price: 15000, description: 'Carry up to 15kg of your main baggage throughout the trek.', icon: Briefcase, type: 'flat' },
  { id: 'room', name: 'Private Room Upgrade', price: 8000, description: 'Single room supplement in tea houses where available.', icon: Home, type: 'per_person' },
  { id: 'acclimatization', name: 'Extra Acclimatization Day', price: 10000, description: 'Additional day with guide for safer adaptation to high altitude.', icon: Clock, type: 'flat' },
  { id: 'gear', name: 'Premium Gear Rental', price: 5000, description: 'Includes high-altitude sleeping bag and down jacket.', icon: Shield, type: 'per_person' }
];

export default function BookingModal({ trek: initialTrek, isOpen, onClose }) {
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ✅ SABAI HOOKS YAHA — early return bhanda AGADI (Rules of Hooks fix)
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTrek, setSelectedTrek] = useState(initialTrek);
  const [direction, setDirection] = useState(1);

  const [formData, setFormData] = useState({
    startDate: '',
    travelers: 1,
    name: '',
    email: '',
    phone: '',
    message: '',
    addons: {
      porter: false,
      room: false,
      acclimatization: false,
      gear: false
    },
    paymentMethod: 'deposit' // 'deposit' or 'full'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep selectedTrek in sync if initialTrek changes
  useEffect(() => {
    if (initialTrek) {
      setSelectedTrek(initialTrek);
    }
  }, [initialTrek]);

  // Reset form whenever modal is closed & reopened fresh
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setDirection(1);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ✅ Early return AB sabai hooks declare bhaisakepachi xa — yo sahi place ho
  if (!isOpen) return null;

  const handleTrekChange = (e) => {
    const found = treks.find(t => t.name === e.target.value);
    if (found) setSelectedTrek(found);
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddonToggle = (addonId) => {
    setFormData(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonId]: !prev.addons[addonId]
      }
    }));
  };

  // Calculations
  const basePricePerPerson = selectedTrek ? selectedTrek.price : 0;
  const numTravelers = parseInt(formData.travelers, 10) || 1;
  const baseTotal = basePricePerPerson * numTravelers;

  // Group discounts: 5% for 3-5 pax, 10% for 6+ pax
  let discountPercentage = 0;
  if (numTravelers >= 6) {
    discountPercentage = 10;
  } else if (numTravelers >= 3) {
    discountPercentage = 5;
  }
  const discountAmount = Math.round((baseTotal * discountPercentage) / 100);
  const baseAfterDiscount = baseTotal - discountAmount;

  // Addons total
  let addonsTotal = 0;
  ADDONS_LIST.forEach(addon => {
    if (formData.addons[addon.id]) {
      if (addon.type === 'per_person') {
        addonsTotal += addon.price * numTravelers;
      } else {
        addonsTotal += addon.price;
      }
    }
  });

  const grandTotal = baseAfterDiscount + addonsTotal;
  const depositAmount = Math.round(grandTotal * 0.20); // 20% deposit

  const validateStep = () => {
    if (currentStep === 1) {
      return !!selectedTrek;
    }
    if (currentStep === 2) {
      if (!formData.startDate) {
        addToast('Please select a preferred start date.', 'error');
        return false;
      }
      if (numTravelers < 1 || numTravelers > 20) {
        addToast('Travelers must be between 1 and 20.', 'error');
        return false;
      }
      return true;
    }
    if (currentStep === 4) {
      if (!formData.name.trim()) {
        addToast('Please enter your full name.', 'error');
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        addToast('Please enter a valid email address.', 'error');
        return false;
      }
      if (!formData.phone.trim()) {
        addToast('Please enter your phone number.', 'error');
        return false;
      }
      return true;
    }
    return true;
  };

  const goToNext = () => {
    if (validateStep()) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const goToPrev = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsSubmitting(true);

    try {
      const summaryPayload = {
        trekName: selectedTrek.name,
        startDate: formData.startDate,
        travelers: numTravelers,
        addons: Object.keys(formData.addons).filter(key => formData.addons[key]),
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        message: formData.message,
        grandTotal,
        paymentMethod: formData.paymentMethod,
        depositAmount
      };

      await submitBooking(summaryPayload);
      localStorage.setItem('has_booked', 'true');
      addToast('Thank you! Your booking request has been submitted successfully.', 'success');
      onClose();
      navigate('/packages');
    } catch (error) {
      addToast('Failed to submit booking. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step directional animation variants
  const stepVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      transition: { duration: 0.2, ease: 'easeIn' }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]"
          >
            {/* Header */}
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center text-white border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-gradient">Book Your Adventure</h2>
                <p className="text-xs text-slate-400">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stepper progress bar */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 hidden sm:block">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
                <div
                  className="absolute left-0 top-1/2 h-0.5 bg-emerald-500 -translate-y-1/2 transition-all duration-300 z-0"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />

                {STEPS.map((step) => {
                  const isCompleted = currentStep > step.id;
                  const isActive = currentStep === step.id;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white shadow-md'
                            : isActive
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md scale-105'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                        }`}
                      >
                        {isCompleted ? <Check size={16} /> : step.id}
                      </div>
                      <span className={`text-[10px] mt-1.5 font-medium transition-colors duration-300 ${isActive ? 'text-emerald-700 font-semibold' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Body */}
            <div className="flex-grow overflow-y-auto p-6 sm:p-8">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* STEP 1: CONFIRM TREK */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Select Trek Package</h3>
                      <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1.5">Selected Trek</label>
                        <select
                          value={selectedTrek ? selectedTrek.name : ''}
                          onChange={handleTrekChange}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-medium text-slate-800"
                        >
                          {treks.map((t) => (
                            <option key={t.name} value={t.name}>{t.name} ({t.location})</option>
                          ))}
                        </select>
                      </div>

                      {selectedTrek && (
                        <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
                          <img src={selectedTrek.image} alt={selectedTrek.name} className="w-full md:w-28 h-20 object-cover rounded-xl shrink-0" />
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-800 text-lg">{selectedTrek.name}</h4>
                            <p className="text-sm text-slate-500 line-clamp-1">{selectedTrek.description}</p>
                            <div className="flex gap-4 text-xs font-semibold text-slate-600 mt-1">
                              <span>📍 {selectedTrek.location}</span>
                              <span>⏱️ {selectedTrek.duration} Days</span>
                              <span>🗻 {selectedTrek.maxAltitude || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3.5 items-start">
                        <Info className="text-emerald-600 mt-0.5 shrink-0" size={18} />
                        <div className="text-xs text-slate-500 leading-relaxed">
                          Please confirm that this is the adventure path you wish to follow. You can customize travel dates, group size, and select add-on guides/porters on the following steps.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: DATES & GROUP SIZE */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-bold text-slate-800">Preferred Dates & Travelers</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                            <Calendar size={16} className="text-emerald-600" /> Start Date
                          </label>
                          <input
                            required
                            type="date"
                            name="startDate"
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.startDate}
                            onChange={handleDataChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1.5 flex items-center gap-1.5">
                            <Users size={16} className="text-emerald-600" /> Number of Travelers
                          </label>
                          <input
                            required
                            type="number"
                            min="1"
                            max="20"
                            name="travelers"
                            value={formData.travelers}
                            onChange={handleDataChange}
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                          />
                        </div>
                      </div>

                      {/* Pricing feedback / discounts */}
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Base rate per person:</span>
                          <span className="font-semibold text-slate-800">Rs. {basePricePerPerson.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Travelers:</span>
                          <span>{numTravelers}</span>
                        </div>
                        <hr className="border-slate-200" />
                        <div className="flex justify-between text-sm text-slate-700 font-semibold">
                          <span>Subtotal:</span>
                          <span>Rs. {baseTotal.toLocaleString()}</span>
                        </div>

                        {discountPercentage > 0 && (
                          <div className="flex justify-between text-xs text-green-700 font-semibold bg-green-50 p-2 rounded-lg">
                            <span>Group Discount ({discountPercentage}%):</span>
                            <span>- Rs. {discountAmount.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: OPTIONAL ADD-ONS */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800">Choose Add-on Services</h3>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Optional</span>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {ADDONS_LIST.map((addon) => {
                          const Icon = addon.icon;
                          const isSelected = formData.addons[addon.id];
                          return (
                            <button
                              type="button"
                              key={addon.id}
                              onClick={() => handleAddonToggle(addon.id)}
                              className={`flex items-start text-left p-4 rounded-2xl border transition-all duration-300 ${
                                isSelected
                                  ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className={`p-2.5 rounded-xl shrink-0 mr-4 ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                <Icon size={20} />
                              </div>
                              <div className="flex-grow pr-4">
                                <h4 className="font-bold text-slate-800 text-sm">{addon.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{addon.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-bold text-slate-800">Rs. {addon.price.toLocaleString()}</div>
                                <div className="text-[10px] text-slate-400">{addon.type === 'per_person' ? '/ person' : '/ group'}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONTACT & PERSONAL INFO */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Your Contact Details</h3>

                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                          <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleDataChange}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                            <input
                              required
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleDataChange}
                              placeholder="name@example.com"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                            <input
                              required
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleDataChange}
                              placeholder="e.g. +977 980..."
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Special Requirements / Message</label>
                          <textarea
                            name="message"
                            rows="3"
                            value={formData.message}
                            onChange={handleDataChange}
                            placeholder="Dietary requests, medical conditions, or any custom additions..."
                            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: REVIEW & PAY */}
                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-800">Booking Summary & Payment</h3>

                      {/* Summary grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Trek Details</h4>
                          <p className="font-semibold text-slate-800 text-base">{selectedTrek.name}</p>
                          <p className="text-slate-500">📍 {selectedTrek.location}</p>
                          <p className="text-slate-500">🗓️ Starts: {formData.startDate}</p>
                          <p className="text-slate-500">👥 Travelers: {numTravelers} Pax</p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Add-ons Selected</h4>
                          <ul className="space-y-1 list-disc pl-4 text-slate-600">
                            {Object.keys(formData.addons).filter(k => formData.addons[k]).length === 0 ? (
                              <li className="text-slate-400 list-none pl-0 italic">None</li>
                            ) : (
                              ADDONS_LIST.filter(a => formData.addons[a.id]).map(a => (
                                <li key={a.id}>{a.name}</li>
                              ))
                            )}
                          </ul>
                          <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider mt-4">Contact Info</h4>
                          <p className="text-slate-800 font-medium">{formData.name}</p>
                          <p className="text-slate-500 text-xs">{formData.email}</p>
                        </div>
                      </div>

                      {/* Pricing summary */}
                      <div className="border border-slate-200 rounded-2xl p-5 space-y-2.5 bg-white">
                        <div className="flex justify-between text-slate-600 text-sm">
                          <span>Base Price ({numTravelers} x Rs. {basePricePerPerson.toLocaleString()}):</span>
                          <span className="font-semibold text-slate-800">Rs. {baseTotal.toLocaleString()}</span>
                        </div>

                        {discountPercentage > 0 && (
                          <div className="flex justify-between text-green-700 text-xs font-semibold bg-green-50 p-2 rounded-lg">
                            <span>Group Discount ({discountPercentage}%):</span>
                            <span>- Rs. {discountAmount.toLocaleString()}</span>
                          </div>
                        )}

                        {ADDONS_LIST.filter(a => formData.addons[a.id]).map(a => (
                          <div key={a.id} className="flex justify-between text-slate-600 text-sm">
                            <span>{a.name}:</span>
                            <span>
                              Rs. {(a.type === 'per_person' ? a.price * numTravelers : a.price).toLocaleString()}
                            </span>
                          </div>
                        ))}

                        <hr className="border-slate-100 my-1" />

                        <div className="flex justify-between text-slate-900 font-extrabold text-lg">
                          <span>Grand Total:</span>
                          <span className="text-emerald-700">Rs. {grandTotal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700">Select Deposit Type</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'deposit' }))}
                            className={`p-3.5 rounded-xl border text-center transition-all ${
                              formData.paymentMethod === 'deposit'
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="font-bold text-slate-800 text-sm">20% Booking Deposit</div>
                            <div className="text-xs text-emerald-600 font-semibold mt-1">Rs. {depositAmount.toLocaleString()}</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'full' }))}
                            className={`p-3.5 rounded-xl border text-center transition-all ${
                              formData.paymentMethod === 'full'
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="font-bold text-slate-800 text-sm">Pay In Full</div>
                            <div className="text-xs text-emerald-600 font-semibold mt-1">Rs. {grandTotal.toLocaleString()}</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={goToPrev}
                disabled={currentStep === 1 || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-semibold"
              >
                <ChevronLeft size={16} /> Back
              </button>

              {currentStep < STEPS.length ? (
                <button
                  type="button"
                  onClick={goToNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-md hover:brightness-110 hover:shadow-lg transition-all text-sm font-semibold"
                >
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center justify-center min-w-[140px] px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl shadow-md hover:brightness-110 hover:shadow-lg disabled:brightness-90 disabled:cursor-not-allowed transition-all text-sm font-bold"
                >
                  {isSubmitting ? 'Processing Booking...' : 'Confirm & Request Booking'}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}