/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Info } from 'lucide-react';

const gearCategories = [
  {
    title: 'Clothing',
    items: [
      { name: 'Moisture-wicking base layers', checked: false },
      { name: 'Fleece jacket or pullover', checked: false },
      { name: 'Waterproof and windproof shell jacket', checked: false },
      { name: 'Down jacket (for cold evenings)', checked: false },
      { name: 'Trekking pants (zip-off recommended)', checked: false },
    ]
  },
  {
    title: 'Footwear',
    items: [
      { name: 'Sturdy, broken-in trekking boots', checked: false },
      { name: 'Camp shoes or sandals', checked: false },
      { name: 'Warm wool or synthetic hiking socks (3-4 pairs)', checked: false },
    ]
  },
  {
    title: 'Equipment',
    items: [
      { name: 'Sleeping bag (rated to -10°C or lower)', checked: false },
      { name: 'Trekking poles', checked: false },
      { name: 'Headlamp with extra batteries', checked: false },
      { name: 'Daypack (30-40L)', checked: false },
      { name: 'Water purification tablets or filter', checked: false },
    ]
  },
  {
    title: 'Personal Items',
    items: [
      { name: 'High SPF Sunscreen and Lip balm', checked: false },
      { name: 'Personal first-aid kit', checked: false },
      { name: 'Polarized sunglasses', checked: false },
      { name: 'Quick-dry towel', checked: false },
    ]
  }
];

export default function GearChecklist() {
  const [categories, setCategories] = useState(gearCategories);

  const toggleItem = (categoryIndex, itemIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].items[itemIndex].checked = !newCategories[categoryIndex].items[itemIndex].checked;
    setCategories(newCategories);
  };

  const totalItems = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const packedItems = categories.reduce((acc, cat) => acc + cat.items.filter(item => item.checked).length, 0);
  const progress = Math.round((packedItems / totalItems) * 100);

  return (
    <section className="bg-forest-50 p-6 md:p-10 rounded-3xl border border-forest-100 shadow-lg mt-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            Essential Gear List
          </h2>
          <p className="text-slate-600 mt-2">Check off items as you pack for your Himalayan adventure.</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 min-w-[200px]">
          <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-700">Packing Progress</span>
            <span className="text-forest-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-forest-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category, catIdx) => (
          <div key={category.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-forest-800 mb-4 pb-2 border-b border-slate-100">
              {category.title}
            </h3>
            <ul className="space-y-3">
              {category.items.map((item, itemIdx) => (
                <li 
                  key={item.name} 
                  className="flex items-start gap-3 cursor-pointer group"
                  onClick={() => toggleItem(catIdx, itemIdx)}
                >
                  <div className={`mt-0.5 shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${item.checked ? 'bg-forest-500 border-forest-500 text-white' : 'border-slate-300 group-hover:border-forest-400 text-transparent'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className={`text-slate-700 transition-all ${item.checked ? 'line-through opacity-50' : 'group-hover:text-forest-700'}`}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
        <Info className="shrink-0 text-amber-500" />
        <p>You can rent heavy gear like down jackets and sleeping bags in Thamel (Kathmandu) or Namche Bazaar before your trek to save luggage weight.</p>
      </div>
    </section>
  );
}
