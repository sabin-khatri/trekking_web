/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Pencil, Trash2, MapPin, Clock, Users, Mountain } from 'lucide-react';
import dummyPackages from '../../data/dummyPackages';
import PackageFormModal from './PackageFormModal';

export default function PackagesTab() {
  const [packages, setPackages] = useState(dummyPackages);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  const openAddForm = () => {
    setEditingPackage(null);
    setFormOpen(true);
  };

  const openEditForm = (pkg) => {
    setEditingPackage(pkg);
    setFormOpen(true);
  };

  const handleDelete = (id) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSave = (form) => {
    if (editingPackage) {
      setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? { ...p, ...form } : p)));
    } else {
      const newPackage = { ...form, id: `PKG-${String(packages.length + 1).padStart(2, '0')}` };
      setPackages((prev) => [newPackage, ...prev]);
    }
    setFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{packages.length} trek packages</p>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          <Plus size={16} />
          Add Package
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {packages.map((pkg) => (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            key={pkg.id}
            className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  pkg.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pkg.status === 'active' ? 'Active' : 'Inactive'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(pkg)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-1">{pkg.name}</h3>
              <p className="text-xs text-slate-500 mb-4 line-clamp-2">{pkg.description}</p>

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 mb-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin size={13} className="text-slate-400" /> {pkg.region}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Clock size={13} className="text-slate-400" /> {pkg.duration}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Mountain size={13} className="text-slate-400" /> {pkg.difficulty}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Users size={13} className="text-slate-400" /> Max {pkg.maxGroupSize}
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-400">From</span>
                <span className="text-lg font-bold text-slate-800">${pkg.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm">
          No trek packages yet. Click "Add Package" to create one.
        </div>
      )}

      <PackageFormModal
        open={formOpen}
        initialData={editingPackage}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}