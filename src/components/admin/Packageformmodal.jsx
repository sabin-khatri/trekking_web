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
    <label className="base-form-label">{label}</label>
    {children}
  </div>
);

const inputClass = "base-form-input !px-3 !py-2.5 !text-sm";

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
          className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl"
          style={{ backgroundColor: 'var(--color-parchment-deep)', border: '1px solid color-mix(in srgb, var(--color-juniper) 20%, transparent)' }}
        >
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 sm:px-8 py-6 border-b" style={{ borderColor: 'color-mix(in srgb, var(--color-juniper) 15%, transparent)' }}>
              <h2 className="text-lg font-bold" style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}>
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
            <div className="px-6 sm:px-8 py-5 rounded-b-2xl flex justify-end gap-3" style={{ backgroundColor: 'var(--color-parchment)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ color: 'var(--color-ink)' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="base-form-btn !py-2.5 !px-5 !text-sm"
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