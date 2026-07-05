import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, HeartPulse, ArrowDownToLine, Droplets } from 'lucide-react';

export default function SafetyGuide() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500"
          >
            <AlertTriangle size={40} />
          </motion.div>
          <h2 className="text-sm font-bold text-red-500 tracking-widest uppercase mb-2">Safety First</h2>
          <h3 className="text-4xl font-extrabold text-slate-800 mb-4">Altitude Sickness (AMS) Guide</h3>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Acute Mountain Sickness (AMS) can affect anyone above 2,500m, regardless of age or fitness level. Understanding it is your best defense.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
          >
            <HeartPulse size={40} className="text-forest-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-3">Recognize Symptoms</h4>
            <p className="text-slate-600 text-sm">
              Headache, nausea, dizziness, fatigue, and loss of appetite. If you feel these, do not ascend further.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
          >
            <ArrowDownToLine size={40} className="text-amber-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-3">Climb High, Sleep Low</h4>
            <p className="text-slate-600 text-sm">
              Acclimatization is key. Go slowly. If symptoms worsen while resting, you must descend immediately.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center"
          >
            <Droplets size={40} className="text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800 mb-3">Hydration is Crucial</h4>
            <p className="text-slate-600 text-sm">
              Drink 3-4 liters of water daily. Avoid alcohol and smoking entirely while at high altitudes.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-forest-900 text-white p-8 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-800 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
          
          <div className="relative z-10 md:flex items-center justify-between gap-8">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h4 className="text-2xl font-bold text-emerald-300 mb-2">Our Commitment to Your Safety</h4>
              <p className="text-forest-100 leading-relaxed">
                All our guides are trained in wilderness first-aid and carry pulse oximeters to monitor your oxygen levels daily. We carry comprehensive medical kits and coordinate emergency helicopter evacuations if absolutely necessary.
              </p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <a href="/contact" className="inline-block bg-emerald-500 hover:bg-emerald-400 text-forest-950 font-bold px-8 py-4 rounded-xl transition-colors">
                Ask a Safety Expert
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
