/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

const emptyForm = {
  name: '', region: '', duration: '', difficulty: 'Moderate',
  price: '', maxGroupSize: '', status: 'active', description: ''
};

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
    {children}
  </div>
);

const inputClass = "w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500";

export default function PackageFormModal({ open, initialData, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(initialData ? { ...initialData } : emptyForm);
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

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
          className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {initialData ? 'Edit Trek Package' : 'Add Trek Package'}
              </h2>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-4">
              <Field label="Trek Name">
                <input required className={inputClass} value={form.name} onChange={handleChange('name')} placeholder="e.g. Everest Base Camp" />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Region">
                  <input required className={inputClass} value={form.region} onChange={handleChange('region')} placeholder="e.g. Khumbu" />
                </Field>
                <Field label="Duration">
                  <input required className={inputClass} value={form.duration} onChange={handleChange('duration')} placeholder="e.g. 14 Days" />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Difficulty">
                  <select className={inputClass} value={form.difficulty} onChange={handleChange('difficulty')}>
                    <option>Easy</option>
                    <option>Moderate</option>
                    <option>Strenuous</option>
                  </select>
                </Field>
                <Field label="Max Group Size">
                  <input required type="number" min="1" className={inputClass} value={form.maxGroupSize} onChange={handleChange('maxGroupSize')} placeholder="e.g. 12" />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Price (USD, per person)">
                  <input required type="number" min="0" className={inputClass} value={form.price} onChange={handleChange('price')} placeholder="e.g. 1600" />
                </Field>
                <Field label="Status">
                  <select className={inputClass} value={form.status} onChange={handleChange('status')}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </Field>
              </div>

              <Field label="Description">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.description}
                  onChange={handleChange('description')}
                  placeholder="Short description of the trek..."
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="px-6 sm:px-8 py-5 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
              >
                {initialData ? 'Save Changes' : 'Add Package'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}