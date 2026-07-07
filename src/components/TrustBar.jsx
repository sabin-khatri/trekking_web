import React from 'react';
import { Shield, Award, Users, Star } from 'lucide-react';
import { COMPANY } from '../config/company';

const badges = [
  { icon: Shield, label: COMPANY.license },
  { icon: Award, label: `${COMPANY.stats.years} Years Experience` },
  { icon: Users, label: `${COMPANY.stats.treks} Treks Completed` },
  { icon: Star, label: `${COMPANY.stats.satisfaction} Client Satisfaction` },
];

export default function TrustBar() {
  return (
    <section className="bg-forest-900 text-white py-4 border-b border-forest-800">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-9 h-9 rounded-lg bg-forest-700/60 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-emerald-300" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-forest-100 leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
