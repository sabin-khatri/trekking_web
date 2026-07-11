/* eslint-disable no-unused-vars */
import React from 'react';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        <p className="text-xs font-medium text-emerald-600 mt-2 flex items-center gap-1">
          <TrendingUp size={14} /> {trend}
        </p>
      </div>
      <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
        <Icon size={28} />
      </div>
    </div>
  );
}