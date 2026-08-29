import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Compass, Calculator, Backpack, BarChart3,
  ArrowRight, ArrowLeft, RotateCcw, Check, AlertCircle, HelpCircle,
  TrendingUp, Calendar, DollarSign, Dumbbell, Award, Lock, Unlock, Download,
  CheckSquare, Square
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import SEO from '../components/common/SEO';
import { treks } from '../data/treks';
import BookingModal from '../components/features/BookingModal';
import { useWishlist } from '../components/WishlistContext';

const INK = '#16212C';
const PARCHMENT = '#F4EFE3';
const PARCHMENT_DEEP = '#EAE1CB';
const JUNIPER = '#4B6350';
const SAFFRON = '#D99A3D';
const CLAY = '#9C4A32';
const ICE = '#6E93A3';

const FONT_DISPLAY = "'Fraunces', 'Georgia', serif";
const FONT_BODY = "'Public Sans', 'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', 'IBM Plex Mono', monospace";

const getPackingItems = (trekId, season) => {
  const trek = treks.find(t => t.id === trekId) || treks[0];
  const altitudeNum = parseInt(trek.maxAltitude.replace(/,/g, ''), 10) || 3000;

  const categories = {
    essentials: [
      "Passport, Nepalese visa copies, passport photos",
      "Trekking Permits (TIMS registration & National Park entry permits)",
      "Local cash in Nepalese Rupees (ATMs are non-existent on trails)",
      "Travel insurance policy paper (must cover heli-evac up to 6,000m)",
      "LED Headlamp with spare batteries/charging cord",
      "Water purification tablets/drops or UV sterilizer filter",
      "First aid medical pouch (Diamox, Ibuprofen, gauze, oral rehydration)",
      "Durable backpack (50L-60L) with waterproof outer cover"
    ],
    footwear: [
      "Well-broken-in waterproof trekking boots",
      "Camp shoes (sandals, slides, or light running shoes)",
      "Merino wool trekking socks (3-4 pairs)",
      "Breathable moisture-wicking thin liner socks"
    ],
    clothing: [],
    gear: [],
    toiletries: [
      "Wet wipes (essential for days without showers)",
      "Quick-dry microfiber pack towel",
      "Sunscreen cream (SPF 50+) & Lip balm with SPF cover",
      "Hand sanitizer bottle & 2 rolls of toilet paper",
      "Biodegradable soap, toothbrush, toothpaste"
    ]
  };

  if (season === 'monsoon') {
    categories.clothing = [
      "Waterproof breathable outer jacket (Gore-Tex)",
      "Waterproof lightweight rain trousers",
      "Compact travel umbrella",
      "Quick-dry synthetic hiking shirts (3-4 pairs)",
      "Convertible quick-dry trekking pants (2 pairs)",
      "Dry-sacks or Ziplock bags for packing items"
    ];
  } else if (season === 'winter') {
    categories.clothing = [
      "Thermal base layers (merino wool, 2 sets top & bottom)",
      "Heavy high-altitude down jacket (-15°C rating)",
      "Thick thermal fleece mid-layer jacket",
      "Windproof & waterproof outer gloves/mittens",
      "Thermal base gloves (liners)",
      "Thick wool beanie & fleece neck gaiter",
      "Insulated windproof trekking pants"
    ];
  } else {
    categories.clothing = [
      "Breathable lightweight trekking shirts (short & long sleeve)",
      "Convertible quick-dry trekking pants (2 pairs)",
      "Lightweight fleece jacket or windbreaker",
      "Wide-brim sun hat & UV protected sunglasses",
      "Lightweight thermal underwear set (for cold nights)",
      "Lightweight gloves"
    ];
  }

  if (altitudeNum > 4000) {
    categories.gear = [
      "High-altitude sleeping bag (rated to -15°C)",
      "Sleeping bag fleece/silk inner liner",
      "Collapsible trekking poles with rubber tips",
      "Microspikes / crampons (critical for ice & snowy pass trails)",
      "Insulated thermal water flask (prevents water freezing)"
    ];
  } else {
    categories.gear = [
      "Three-season sleeping bag (rated to 0°C)",
      "Collapsible trekking poles with rubber tips",
      "Standard water bottles (2x 1-liter capacity)"
    ];
  }

  return categories;
};

export default function Planner() {
  const [activeTab, setActiveTab] = useState('wizard');
  const { wishlist } = useWishlist();

  const [wizardStep, setWizardStep] = useState(0);
  const [selections, setSelections] = useState({
    budget: '',
    duration: '',
    difficulty: ''
  });

  const [selectedTrekForBooking, setSelectedTrekForBooking] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [calcTrekId, setCalcTrekId] = useState(treks[0].id);
  const [calcTravelers, setCalcTravelers] = useState(1);
  const [calcFlights, setCalcFlights] = useState(true);
  const [calcGear, setCalcGear] = useState(false);
  const [calcTips, setCalcTips] = useState(true);
  const [calcPersonalDaily, setCalcPersonalDaily] = useState(2500);

  const [packingTrekId, setPackingTrekId] = useState(treks[0].id);
  const [selectedSeason, setSelectedSeason] = useState('autumn');
  const [packingUpdateTick, setPackingUpdateTick] = useState(0);

  const [compareTrekIds, setCompareTrekIds] = useState(treks.map(t => t.id));
  const [compareMetric, setCompareMetric] = useState('altitude');

  const calcTrek = treks.find(t => t.id === calcTrekId) || treks[0];
  const calcBasePrice = calcTrek.price;
  const calcBaseTotal = calcBasePrice * calcTravelers;
  const calcDiscountPct = calcTravelers >= 6 ? 10 : (calcTravelers >= 3 ? 5 : 0);
  const calcDiscountAmount = Math.round((calcBaseTotal * calcDiscountPct) / 100);
  const calcBaseAfterDiscount = calcBaseTotal - calcDiscountAmount;

  const permitCost = calcTrek.id.includes('mustang') ? 67000 : (calcTrek.id.includes('manaslu') ? 27000 : 5000);
  const totalPermits = permitCost * calcTravelers;

  const transportCost = (calcTrek.id.includes('everest') || calcTrek.id.includes('gokyo')) ? 40000 : ((calcTrek.location.includes('Annapurna') || calcTrek.id.includes('mardi') || calcTrek.id.includes('poon')) ? 15000 : 8000);
  const totalTransport = calcFlights ? (transportCost * calcTravelers) : 0;

  const gearCost = 8000;
  const totalGear = calcGear ? (gearCost * calcTravelers) : 0;

  const tipsFlat = calcTips ? (1200 * calcTrek.duration) : 0;
  const totalPersonal = calcPersonalDaily * calcTrek.duration * calcTravelers;
  const totalTipsAndPersonal = tipsFlat + totalPersonal;

  const grandTotal = calcBaseAfterDiscount + totalPermits + totalTransport + totalGear + totalTipsAndPersonal;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'calculator') {
      localStorage.setItem('has_calculated', 'true');
    }
  };

  const handleRestart = () => {
    setSelections({ budget: '', duration: '', difficulty: '' });
    setWizardStep(0);
  };

  const handleSelectOption = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    setWizardStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setWizardStep(prev => Math.max(0, prev - 1));
  };

  const calculateMatches = () => {
    const scored = treks.map(trek => {
      let budgetScore = 0;
      let durationScore = 0;
      let difficultyScore = 0;

      if (selections.budget === 'low') {
        if (trek.price <= 100000) budgetScore = 1.0;
        else if (trek.price <= 150000) budgetScore = 0.5;
      } else if (selections.budget === 'medium') {
        if (trek.price > 100000 && trek.price <= 180000) budgetScore = 1.0;
        else if (trek.price <= 100000 || (trek.price > 180000 && trek.price <= 210000)) budgetScore = 0.5;
      } else if (selections.budget === 'high') {
        if (trek.price >= 180000) budgetScore = 1.0;
        else if (trek.price >= 120000 && trek.price < 180000) budgetScore = 0.5;
      }

      if (selections.duration === 'short') {
        if (trek.duration <= 8) durationScore = 1.0;
        else if (trek.duration <= 10) durationScore = 0.5;
      } else if (selections.duration === 'medium') {
        if (trek.duration >= 9 && trek.duration <= 14) durationScore = 1.0;
        else if (trek.duration === 8 || trek.duration === 15 || trek.duration === 16) durationScore = 0.5;
      } else if (selections.duration === 'long') {
        if (trek.duration >= 15) durationScore = 1.0;
        else if (trek.duration >= 12 && trek.duration < 15) durationScore = 0.5;
      }

      if (selections.difficulty === 'easy') {
        if (trek.category === 'moderate' || trek.category === 'easy') difficultyScore = 1.0;
        else if (trek.category === 'challenging') difficultyScore = 0.0;
      } else if (selections.difficulty === 'challenging') {
        if (trek.category === 'challenging') difficultyScore = 1.0;
        else if (trek.category === 'moderate') difficultyScore = 0.5;
        else if (trek.category === 'easy') difficultyScore = 0.0;
      }

      const matchPct = Math.round(((budgetScore + durationScore + difficultyScore) / 3) * 100);

      return {
        ...trek,
        matchPct,
        details: {
          budget: budgetScore,
          duration: durationScore,
          difficulty: difficultyScore
        }
      };
    });

    return scored
      .filter(trek => trek.matchPct > 0)
      .sort((a, b) => b.matchPct - a.matchPct);
  };

  const results = wizardStep === 4 ? calculateMatches() : [];

  const getStoredChecked = (key) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  };

  const handleToggleItem = (itemText) => {
    const key = `packing_${packingTrekId}_${selectedSeason}`;
    const current = getStoredChecked(key);
    let updated;
    if (current.includes(itemText)) {
      updated = current.filter(i => i !== itemText);
    } else {
      updated = [...current, itemText];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    setPackingUpdateTick(prev => prev + 1);
  };

  const handleDownloadChecklist = () => {
    const trek = treks.find(t => t.id === packingTrekId) || treks[0];
    const key = `packing_${packingTrekId}_${selectedSeason}`;
    const checked = getStoredChecked(key);
    const categories = getPackingItems(packingTrekId, selectedSeason);

    let txt = `==========================================\n`;
    txt += `🏔️ APEX HIMALAYA TREKS - PACKING LIST\n`;
    txt += `==========================================\n`;
    txt += `Trek Route: ${trek.name}\n`;
    txt += `Selected Season: ${selectedSeason.toUpperCase()}\n`;
    txt += `Max Altitude: ${trek.maxAltitude || 'N/A'}\n`;
    txt += `Generated On: ${new Date().toLocaleDateString()}\n`;
    txt += `==========================================\n\n`;

    Object.entries(categories).forEach(([categoryName, items]) => {
      txt += `## ${categoryName.toUpperCase()}\n`;
      items.forEach(item => {
        const isChecked = checked.includes(item);
        txt += `[${isChecked ? 'x' : ' '}] ${item}\n`;
      });
      txt += `\n`;
    });

    txt += `Thank you for planning with Apex Himalaya Treks! Have a safe adventure.\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${trek.id}_packing_list_${selectedSeason}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleCompareTrek = (id) => {
    if (compareTrekIds.includes(id)) {
      if (compareTrekIds.length > 2) {
        setCompareTrekIds(prev => prev.filter(t => t !== id));
      }
    } else {
      setCompareTrekIds(prev => [...prev, id]);
    }
  };

  const chartData = treks
    .filter(t => compareTrekIds.includes(t.id))
    .map(t => {
      const altNum = parseInt(t.maxAltitude.replace(/,/g, ''), 10) || 0;
      return {
        name: t.name,
        altitude: altNum,
        duration: t.duration,
        price: t.price
      };
    });

  const evaluateBadges = () => {
    const savedCount = wishlist.length;
    const isNoviceUnlocked = savedCount >= 1;
    const isDreamerUnlocked = savedCount >= 3;

    const isBookerUnlocked = localStorage.getItem('has_booked') === 'true';
    const isCalculatorUnlocked = localStorage.getItem('has_calculated') === 'true';

    const activeChecklistKey = `packing_${packingTrekId}_${selectedSeason}`;
    const activeCheckedCount = getStoredChecked(activeChecklistKey).length;
    const isScholarUnlocked = activeCheckedCount >= 5;

    return [
      {
        id: 'novice',
        name: 'Explorer Novice',
        desc: 'Shortlist your first trek to your wishlist.',
        unlocked: isNoviceUnlocked,
        progress: `${savedCount}/1 Saved`,
        icon: Compass,
        accent: ICE
      },
      {
        id: 'dreamer',
        name: 'Himalayan Dreamer',
        desc: 'Shortlist three or more treks in your wishlist.',
        unlocked: isDreamerUnlocked,
        progress: `${savedCount}/3 Saved`,
        icon: Award,
        accent: ICE
      },
      {
        id: 'scholar',
        name: 'Summit Scholar',
        desc: 'Check off at least 5 equipment items in the packing list.',
        unlocked: isScholarUnlocked,
        progress: `${activeCheckedCount}/5 Checked`,
        icon: Backpack,
        accent: CLAY
      },
      {
        id: 'calculator',
        name: 'Budget Master',
        desc: 'Generate an estimate in the Trip Cost Calculator.',
        unlocked: isCalculatorUnlocked,
        progress: isCalculatorUnlocked ? '1/1 Checked' : '0/1 Checked',
        icon: Calculator,
        accent: SAFFRON
      },
      {
        id: 'booker',
        name: 'Registered Climber',
        desc: 'Submit a booking request for any trek route.',
        unlocked: isBookerUnlocked,
        progress: isBookerUnlocked ? '1/1 Checked' : '0/1 Checked',
        icon: Sparkles,
        accent: JUNIPER
      }
    ];
  };

  const badges = evaluateBadges();

  const tabs = [
    { id: 'wizard', label: 'Plan My Trek Quiz', icon: Compass },
    { id: 'calculator', label: 'Trip Cost Calculator', icon: Calculator },
    { id: 'packing', label: 'Packing Checklist', icon: Backpack },
    { id: 'difficulty', label: 'Difficulty Comparison', icon: BarChart3 },
    { id: 'badges', label: 'My Achievements', icon: Award }
  ];

  return (
    <div style={{ backgroundColor: PARCHMENT, fontFamily: FONT_BODY }} className="min-h-screen pb-20">
      <SEO
        title="Trek Planner & Interactive Tools"
        description="Plan your next Nepalese Himalayan adventure with our interactive quiz wizard, budget calculators, and packing checklist utilities."
      />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mb-8 shadow-xl" style={{ backgroundColor: INK }}>
        <svg className="absolute bottom-0 left-0 w-full h-20 opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,100 L100,60 L200,80 L320,30 L420,70 L540,20 L650,65 L760,40 L880,75 L1000,35 L1200,60 L1200,100 Z" fill={SAFFRON} />
        </svg>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <span
            style={{ fontFamily: FONT_MONO, color: SAFFRON, borderColor: `${SAFFRON}55` }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border"
          >
            <Sparkles size={12} /> Field Instruments
          </span>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="text-4xl sm:text-5xl italic font-normal tracking-tight">Trek Planner & Tools</h1>
          <p className="mt-3 max-w-2xl font-light text-base sm:text-lg" style={{ color: '#D8D2C4' }}>
            Smart tools to help you design, customize, and prepare for your dream trek in the Himalayas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-xl shadow-sm" style={{ backgroundColor: PARCHMENT_DEEP, border: `1px solid ${JUNIPER}22` }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={active ? { backgroundColor: INK, color: SAFFRON } : { color: JUNIPER }}
                className="flex items-center gap-2 px-5 py-3.5 rounded-lg text-sm font-semibold transition-all duration-300 relative cursor-pointer"
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl shadow-xl overflow-hidden min-h-[500px]" style={{ backgroundColor: PARCHMENT, border: `1px solid ${JUNIPER}22` }}>

          {activeTab === 'wizard' && (
            <div className="p-6 sm:p-10 md:p-12">
              <AnimatePresence mode="wait">

                {wizardStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-2xl mx-auto text-center py-10"
                  >
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: `${JUNIPER}14` }}>
                      <Compass size={40} style={{ color: JUNIPER }} />
                    </div>
                    <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-3xl italic font-normal mb-4">
                      Find Your Perfect Himalayan Trail
                    </h2>
                    <p className="text-lg font-light leading-relaxed mb-10" style={{ color: '#5B6660' }}>
                      Nepal offers walks for everyone—from peaceful green valleys to high glacier climbs.
                      Answer 3 simple questions about your budget, timing, and experience, and our algorithm
                      will find the ideal match for your adventure.
                    </p>
                    <button
                      onClick={() => setWizardStep(1)}
                      style={{ backgroundColor: INK, color: SAFFRON }}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg hover:scale-[1.02] transition-all cursor-pointer shadow-lg"
                    >
                      Start Plan Finder <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}

                {wizardStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handleRestart} style={{ color: '#5B6660' }} className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70">
                        <RotateCcw size={16} /> Reset
                      </button>
                      <span style={{ fontFamily: FONT_MONO, color: JUNIPER, backgroundColor: `${JUNIPER}14` }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Step 1 of 3
                      </span>
                    </div>

                    <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl sm:text-3xl italic font-normal mb-2 text-center">
                      What is your estimated trek budget?
                    </h2>
                    <p className="text-center mb-10 text-sm sm:text-base" style={{ color: '#5B6660' }}>
                      Select a pricing category per person (excluding international flights).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'low', title: 'Budget-Friendly', price: 'Under Rs. 100,000', desc: 'Short routes and local tea-house stays.' },
                        { id: 'medium', title: 'Standard Choice', price: 'Rs. 100,000 - 180,000', desc: 'Classic multi-day high-altitude circuits.' },
                        { id: 'high', title: 'Premium/Expedition', price: 'Over Rs. 180,000', desc: 'Long journeys or remote wilderness trails.' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('budget', opt.id)}
                          style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }}
                          className="group text-left p-6 sm:p-8 rounded-xl border hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${JUNIPER}18`, color: JUNIPER }}>
                              <DollarSign size={22} />
                            </div>
                            <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg italic mb-2">{opt.title}</h3>
                            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="font-bold text-sm mb-4">{opt.price}</p>
                            <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: '#5B6660' }}>{opt.desc}</p>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold" style={{ color: JUNIPER }}>
                            Select Range <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {wizardStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handlePrevStep} style={{ color: '#5B6660' }} className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <span style={{ fontFamily: FONT_MONO, color: JUNIPER, backgroundColor: `${JUNIPER}14` }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Step 2 of 3
                      </span>
                    </div>

                    <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl sm:text-3xl italic font-normal mb-2 text-center">
                      How long would you like to trek?
                    </h2>
                    <p className="text-center mb-10 text-sm sm:text-base" style={{ color: '#5B6660' }}>
                      Choose the duration that fits your itinerary.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'short', title: 'Short Trip', days: '5 - 8 Days', desc: 'Beautiful vistas without long mountain stays.' },
                        { id: 'medium', title: 'Classic Duration', days: '9 - 14 Days', desc: 'Standard circuits with full mountain depth.' },
                        { id: 'long', title: 'Epic Expedition', days: '15+ Days', desc: 'Deep mountain exploration and challenging passes.' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('duration', opt.id)}
                          style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }}
                          className="group text-left p-6 sm:p-8 rounded-xl border hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${JUNIPER}18`, color: JUNIPER }}>
                              <Calendar size={22} />
                            </div>
                            <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg italic mb-2">{opt.title}</h3>
                            <p style={{ fontFamily: FONT_MONO, color: CLAY }} className="font-bold text-sm mb-4">{opt.days}</p>
                            <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: '#5B6660' }}>{opt.desc}</p>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold" style={{ color: JUNIPER }}>
                            Select Duration <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {wizardStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handlePrevStep} style={{ color: '#5B6660' }} className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <span style={{ fontFamily: FONT_MONO, color: JUNIPER, backgroundColor: `${JUNIPER}14` }} className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                        Step 3 of 3
                      </span>
                    </div>

                    <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl sm:text-3xl italic font-normal mb-2 text-center">
                      What is your trekking experience level?
                    </h2>
                    <p className="text-center mb-10 text-sm sm:text-base" style={{ color: '#5B6660' }}>
                      Assess your fitness and comfort with high-altitude environments.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      {[
                        { id: 'easy', title: 'Beginner / Moderate', desc: 'I prefer gradual ascents, well-worn paths, and maximum altitudes below 5,000m. Suitable for regular fitness levels.', details: ['Gradual climbing', 'Altitudes < 5,000m', 'Standard lodges', 'Regular walking fitness'] },
                        { id: 'challenging', title: 'Advanced / Strenuous', desc: 'I am ready for challenging steep climbs, high mountain passes (above 5,000m), glacier terrain, cold weather, and long walking days.', details: ['Steep glacier terrain', 'Altitudes > 5,000m', 'Cold/snow possibilities', 'High cardiovascular shape'] }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('difficulty', opt.id)}
                          style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }}
                          className="group text-left p-6 sm:p-8 rounded-xl border hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${JUNIPER}18`, color: JUNIPER }}>
                              <Dumbbell size={22} />
                            </div>
                            <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-lg italic mb-3">{opt.title}</h3>
                            <p className="text-sm font-light leading-relaxed mb-6" style={{ color: '#5B6660' }}>{opt.desc}</p>

                            <ul className="space-y-2 pt-4" style={{ borderTop: `1px dashed ${JUNIPER}33` }}>
                              {opt.details.map((det, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-medium" style={{ color: '#5B6660' }}>
                                  <Check size={12} style={{ color: JUNIPER }} /> {det}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold" style={{ color: JUNIPER }}>
                            Select Level <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {wizardStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-10"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between pb-6 gap-4" style={{ borderBottom: `1px dashed ${JUNIPER}33` }}>
                      <div>
                        <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic font-normal">Your Recommended Treks</h2>
                        <p className="text-sm mt-1" style={{ color: '#5B6660' }}>Based on your custom preferences.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRestart}
                          style={{ borderColor: `${JUNIPER}44`, color: JUNIPER }}
                          className="flex items-center gap-1.5 px-4 py-2 border font-semibold rounded-lg text-sm transition-colors cursor-pointer"
                        >
                          <RotateCcw size={16} /> Restart Quiz
                        </button>
                      </div>
                    </div>

                    <div style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="flex flex-wrap gap-3 p-4 rounded-xl border text-sm font-medium">
                      <span style={{ color: '#5B6660' }}>Criteria:</span>
                      <span style={{ backgroundColor: PARCHMENT, borderColor: `${JUNIPER}22`, color: INK }} className="px-3 py-1 rounded-lg border capitalize flex items-center gap-1">
                        Budget: <strong style={{ color: JUNIPER }} className="font-semibold">{selections.budget}</strong>
                      </span>
                      <span style={{ backgroundColor: PARCHMENT, borderColor: `${JUNIPER}22`, color: INK }} className="px-3 py-1 rounded-lg border capitalize flex items-center gap-1">
                        Duration: <strong style={{ color: JUNIPER }} className="font-semibold">{selections.duration}</strong>
                      </span>
                      <span style={{ backgroundColor: PARCHMENT, borderColor: `${JUNIPER}22`, color: INK }} className="px-3 py-1 rounded-lg border capitalize flex items-center gap-1">
                        Fitness: <strong style={{ color: JUNIPER }} className="font-semibold">{selections.difficulty}</strong>
                      </span>
                    </div>

                    {results.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {results.map((trek, index) => (
                          <motion.div
                            key={trek.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }}
                            className="rounded-xl border shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative h-56 sm:h-64 w-full">
                                <img src={trek.image} alt={trek.name} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${INK}D9, ${INK}44 55%, transparent)` }}></div>

                                <div style={{ backgroundColor: SAFFRON, color: INK, borderColor: `${INK}22` }} className="absolute top-4 right-4 font-extrabold px-4 py-2 rounded-xl shadow-lg border flex items-center gap-1">
                                  <Award size={16} /> {trek.matchPct}% Match
                                </div>

                                <div className="absolute bottom-4 left-6 right-6">
                                  <span style={{ fontFamily: FONT_MONO, backgroundColor: `${JUNIPER}CC`, color: PARCHMENT }} className="inline-block px-2.5 py-0.5 backdrop-blur-sm text-xs font-bold uppercase rounded mb-2">
                                    {trek.category}
                                  </span>
                                  <h3 style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="italic text-2xl tracking-tight leading-tight">{trek.name}</h3>
                                </div>
                              </div>

                              <div className="p-6 sm:p-8 space-y-6">
                                <p className="text-sm font-light leading-relaxed" style={{ color: '#5B6660' }}>
                                  {trek.description}
                                </p>

                                <div className="grid grid-cols-3 gap-4 py-4 text-center" style={{ borderTop: `1px dashed ${JUNIPER}33`, borderBottom: `1px dashed ${JUNIPER}33` }}>
                                  <div>
                                    <p style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Duration</p>
                                    <span style={{ color: INK }} className="font-extrabold text-sm sm:text-base flex items-center justify-center gap-1">
                                      <Calendar size={14} style={{ color: '#8A8272' }} /> {trek.duration} Days
                                    </span>
                                  </div>
                                  <div>
                                    <p style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Altitude</p>
                                    <span style={{ color: INK }} className="font-extrabold text-sm sm:text-base flex items-center justify-center gap-1">
                                      <TrendingUp size={14} style={{ color: '#8A8272' }} /> {trek.maxAltitude || 'N/A'}
                                    </span>
                                  </div>
                                  <div>
                                    <p style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="text-[10px] font-bold uppercase tracking-wider mb-1">Price</p>
                                    <span style={{ fontFamily: FONT_MONO, color: CLAY }} className="font-black text-sm sm:text-base">
                                      Rs. {trek.price.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                <div style={{ backgroundColor: PARCHMENT, borderColor: `${JUNIPER}22` }} className="p-4 rounded-xl border space-y-2.5">
                                  <p style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="text-[11px] font-bold uppercase tracking-widest">Matching Breakdown</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.budget === 1.0 ? (
                                        <Check size={14} style={{ color: JUNIPER }} className="shrink-0" />
                                      ) : trek.details.budget === 0.5 ? (
                                        <AlertCircle size={14} style={{ color: SAFFRON }} className="shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} style={{ color: '#C9C1AE' }} className="shrink-0" />
                                      )}
                                      <span style={{ color: trek.details.budget === 1.0 ? INK : '#5B6660' }} className={trek.details.budget === 1.0 ? 'font-semibold' : ''}>
                                        Budget: {trek.details.budget === 1.0 ? 'Fits Ideal' : trek.details.budget === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.duration === 1.0 ? (
                                        <Check size={14} style={{ color: JUNIPER }} className="shrink-0" />
                                      ) : trek.details.duration === 0.5 ? (
                                        <AlertCircle size={14} style={{ color: SAFFRON }} className="shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} style={{ color: '#C9C1AE' }} className="shrink-0" />
                                      )}
                                      <span style={{ color: trek.details.duration === 1.0 ? INK : '#5B6660' }} className={trek.details.duration === 1.0 ? 'font-semibold' : ''}>
                                        Days: {trek.details.duration === 1.0 ? 'Fits Ideal' : trek.details.duration === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.difficulty === 1.0 ? (
                                        <Check size={14} style={{ color: JUNIPER }} className="shrink-0" />
                                      ) : trek.details.difficulty === 0.5 ? (
                                        <AlertCircle size={14} style={{ color: SAFFRON }} className="shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} style={{ color: '#C9C1AE' }} className="shrink-0" />
                                      )}
                                      <span style={{ color: trek.details.difficulty === 1.0 ? INK : '#5B6660' }} className={trek.details.difficulty === 1.0 ? 'font-semibold' : ''}>
                                        Fitness: {trek.details.difficulty === 1.0 ? 'Fits Ideal' : trek.details.difficulty === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3 mt-auto" style={{ borderTop: `1px dashed ${JUNIPER}22` }}>
                              <Link
                                to={`/packages/${trek.id}`}
                                style={{ borderColor: `${JUNIPER}44`, color: JUNIPER }}
                                className="flex-1 text-center py-3 border font-bold rounded-lg text-sm transition-colors cursor-pointer"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedTrekForBooking(trek);
                                  localStorage.setItem('has_booked', 'true');
                                  setIsBookingOpen(true);
                                }}
                                style={{ backgroundColor: INK, color: SAFFRON }}
                                className="flex-1 py-3 font-bold rounded-lg text-sm shadow-md transition-all cursor-pointer"
                              >
                                Book Now
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 max-w-md mx-auto">
                        <HelpCircle size={48} style={{ color: '#C9C1AE' }} className="mx-auto mb-4" />
                        <h3 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-xl italic mb-2">No Treks Match Your Criteria</h3>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#5B6660' }}>
                          None of our current treks matched your selection combination. Please try setting broader options.
                        </p>
                        <button
                          onClick={handleRestart}
                          style={{ backgroundColor: INK, color: SAFFRON }}
                          className="px-6 py-2.5 font-bold rounded-lg text-sm transition-colors cursor-pointer"
                        >
                          Retry Search
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="p-6 sm:p-10 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic font-normal flex items-center gap-2">
                      <Calculator style={{ color: JUNIPER }} size={22} /> Trip Cost Estimator
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#5B6660' }}>
                      Customize your choices to calculate an approximate total cost for your expedition.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold">Select Trek Route</label>
                    <select
                      value={calcTrekId}
                      onChange={(e) => setCalcTrekId(e.target.value)}
                      style={{ borderColor: `${JUNIPER}44`, color: INK, backgroundColor: PARCHMENT }}
                      className="w-full p-4 rounded-lg border outline-none font-semibold transition-all cursor-pointer"
                    >
                      {treks.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.duration} Days) - Rs. {t.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label style={{ fontFamily: FONT_MONO, color: INK }} className="block text-xs uppercase tracking-wide font-bold">Number of Trekkers</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCalcTravelers(prev => Math.max(1, prev - 1))}
                        style={{ borderColor: `${JUNIPER}44`, color: INK }}
                        className="w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span style={{ fontFamily: FONT_MONO, color: INK }} className="w-14 text-center font-extrabold text-xl">{calcTravelers}</span>
                      <button
                        onClick={() => setCalcTravelers(prev => Math.min(12, prev + 1))}
                        style={{ borderColor: `${JUNIPER}44`, color: INK }}
                        className="w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                      >
                        +
                      </button>
                      {calcTravelers >= 3 && (
                        <span style={{ fontFamily: FONT_MONO, backgroundColor: `${JUNIPER}14`, color: JUNIPER, borderColor: `${JUNIPER}33` }} className="text-xs font-bold px-3 py-1 rounded-lg border flex items-center gap-1">
                          {calcDiscountPct}% GROUP DISCOUNT APPLIED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4" style={{ borderTop: `1px dashed ${JUNIPER}33` }}>
                    <h3 style={{ fontFamily: FONT_MONO, color: INK }} className="text-xs uppercase tracking-wide font-bold">Optional Services</h3>

                    <label style={{ borderColor: `${JUNIPER}22`, backgroundColor: PARCHMENT_DEEP }} className="flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcFlights}
                        onChange={(e) => setCalcFlights(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded cursor-pointer"
                        style={{ accentColor: JUNIPER }}
                      />
                      <div>
                        <span style={{ color: INK }} className="block text-sm font-bold">Include Flights & Local Transport</span>
                        <span className="block text-xs font-light leading-relaxed" style={{ color: '#5B6660' }}>
                          Add Kathmandu round-trip transit to region (e.g. Lukla flights for Everest, Pokhara for Annapurna).
                        </span>
                      </div>
                    </label>

                    <label style={{ borderColor: `${JUNIPER}22`, backgroundColor: PARCHMENT_DEEP }} className="flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcGear}
                        onChange={(e) => setCalcGear(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded cursor-pointer"
                        style={{ accentColor: JUNIPER }}
                      />
                      <div>
                        <span style={{ color: INK }} className="block text-sm font-bold">Rent High-Altitude Gear</span>
                        <span className="block text-xs font-light leading-relaxed" style={{ color: '#5B6660' }}>
                          Rent sleeping bag, heavy down jacket, and heavy gear (Rs. {gearCost.toLocaleString()} per trekker).
                        </span>
                      </div>
                    </label>

                    <label style={{ borderColor: `${JUNIPER}22`, backgroundColor: PARCHMENT_DEEP }} className="flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcTips}
                        onChange={(e) => setCalcTips(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded cursor-pointer"
                        style={{ accentColor: JUNIPER }}
                      />
                      <div>
                        <span style={{ color: INK }} className="block text-sm font-bold">Guide & Porter Tips</span>
                        <span className="block text-xs font-light leading-relaxed" style={{ color: '#5B6660' }}>
                          Include standard collective tips for guide and porter support crew (Rs. 1,200 per day flat).
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4 pt-4" style={{ borderTop: `1px dashed ${JUNIPER}33` }}>
                    <div className="flex justify-between items-center">
                      <label style={{ fontFamily: FONT_MONO, color: INK }} className="text-xs uppercase tracking-wide font-bold">Personal Daily Expenses</label>
                      <span style={{ fontFamily: FONT_MONO, color: CLAY, backgroundColor: `${CLAY}12`, borderColor: `${CLAY}33` }} className="text-sm font-extrabold px-2 py-0.5 rounded-lg border">
                        Rs. {calcPersonalDaily.toLocaleString()} / day
                      </span>
                    </div>
                    <p className="text-xs font-light leading-relaxed" style={{ color: '#5B6660' }}>
                      Covers hot showers, Wi-Fi access, device battery charging, snacks, and extra drinks at tea houses.
                    </p>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="500"
                      value={calcPersonalDaily}
                      onChange={(e) => setCalcPersonalDaily(parseInt(e.target.value, 10))}
                      style={{ accentColor: JUNIPER, backgroundColor: PARCHMENT_DEEP }}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none"
                    />
                    <div style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span>Rs. 1,000 (Minimal)</span>
                      <span>Rs. 8,000 (Luxurious)</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="sticky top-24 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden" style={{ backgroundColor: INK, border: `1px solid ${SAFFRON}22` }}>
                    <svg className="absolute bottom-0 left-0 w-full h-16 opacity-[0.07]" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M0,60 L40,25 L80,40 L130,10 L180,35 L230,15 L280,38 L330,20 L400,32 L400,60 Z" fill={SAFFRON} />
                    </svg>
                    <div className="relative z-10 space-y-6">
                      <div>
                        <h3 style={{ fontFamily: FONT_DISPLAY, color: PARCHMENT }} className="text-lg italic">Cost Summary</h3>
                        <p className="text-xs font-light" style={{ color: '#9A9384' }}>Calculated estimate for your travel party.</p>
                      </div>

                      <div className="space-y-4 text-sm font-medium pb-6" style={{ borderBottom: `1px solid ${PARCHMENT}1A` }}>
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="block" style={{ color: '#D8D2C4' }}>Base Package Cost</span>
                            <span className="block text-xs font-light" style={{ color: '#8A8478' }}>{calcTravelers} Pax x Rs. {calcBasePrice.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span style={calcDiscountPct > 0 ? { color: '#8A8478', textDecoration: 'line-through', fontSize: '0.75rem' } : { color: PARCHMENT, fontWeight: 700 }} className="block">
                              Rs. {calcBaseTotal.toLocaleString()}
                            </span>
                            {calcDiscountPct > 0 && (
                              <span style={{ color: SAFFRON, fontWeight: 700 }} className="block">
                                Rs. {calcBaseAfterDiscount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block" style={{ color: '#D8D2C4' }}>Permits & Admin Fees</span>
                            <span className="block text-xs font-light" style={{ color: '#8A8478' }}>Park entry & TIMS registration</span>
                          </div>
                          <span style={{ color: PARCHMENT }} className="font-bold">Rs. {totalPermits.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block" style={{ color: '#D8D2C4' }}>Transit & Flights</span>
                            <span className="block text-xs font-light" style={{ color: '#8A8478' }}>{calcFlights ? 'Included flight/transport options' : 'Self-arranged'}</span>
                          </div>
                          <span style={{ color: PARCHMENT }} className="font-bold">Rs. {totalTransport.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block" style={{ color: '#D8D2C4' }}>Gear Rentals</span>
                            <span className="block text-xs font-light" style={{ color: '#8A8478' }}>{calcGear ? 'Sleeping bag & down jacket rental' : 'Own gear'}</span>
                          </div>
                          <span style={{ color: PARCHMENT }} className="font-bold">Rs. {totalGear.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block" style={{ color: '#D8D2C4' }}>Personal & Crew Expenses</span>
                            <span className="block text-xs font-light" style={{ color: '#8A8478' }}>Tips + personal daily tea house expenses</span>
                          </div>
                          <span style={{ color: PARCHMENT }} className="font-bold">Rs. {totalTipsAndPersonal.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span style={{ color: '#D8D2C4' }} className="font-bold text-base">Estimated Total</span>
                          <span style={{ fontFamily: FONT_MONO, color: SAFFRON }} className="font-black text-2xl sm:text-3xl">
                            Rs. {grandTotal.toLocaleString()}
                          </span>
                        </div>

                        <div style={{ backgroundColor: `${SAFFRON}12`, borderColor: `${SAFFRON}2A` }} className="border rounded-xl p-4 text-xs font-light flex items-start gap-2.5">
                          <AlertCircle size={16} style={{ color: SAFFRON }} className="shrink-0 mt-0.5" />
                          <p className="leading-relaxed" style={{ color: '#D8D2C4' }}>
                            This estimator is designed to help you plan. True costs vary depending on personal choices, weather, seasonal rate shifts, and booking lead time.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedTrekForBooking(calcTrek);
                            localStorage.setItem('has_booked', 'true');
                            setIsBookingOpen(true);
                          }}
                          style={{ backgroundColor: SAFFRON, color: INK }}
                          className="w-full font-bold py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center block"
                        >
                          Book This Trek
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'packing' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div>
                <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic font-normal flex items-center gap-2">
                  <Backpack style={{ color: JUNIPER }} size={22} /> Seasonal Packing Checklist
                </h2>
                <p className="text-sm mt-1" style={{ color: '#5B6660' }}>
                  Generate a customized packing list based on your specific trail altitude and seasonal weather.
                </p>
              </div>

              <div style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl border">
                <div className="space-y-2">
                  <label style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="block text-xs font-bold uppercase tracking-widest">Select Route</label>
                  <select
                    value={packingTrekId}
                    onChange={(e) => setPackingTrekId(e.target.value)}
                    style={{ borderColor: `${JUNIPER}44`, color: INK, backgroundColor: PARCHMENT }}
                    className="w-full p-3.5 rounded-lg border font-semibold outline-none transition-all text-sm cursor-pointer"
                  >
                    {treks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Max Alt: {t.maxAltitude || 'N/A'})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="block text-xs font-bold uppercase tracking-widest">Select Season</label>
                  <div className="flex gap-2">
                    {['spring', 'monsoon', 'autumn', 'winter'].map(season => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        style={
                          selectedSeason === season
                            ? { backgroundColor: INK, color: SAFFRON }
                            : { backgroundColor: PARCHMENT, color: JUNIPER, borderColor: `${JUNIPER}33` }
                        }
                        className="flex-1 py-3 px-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer border"
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8" style={{ borderTop: `1px dashed ${JUNIPER}33` }}>
                {Object.entries(getPackingItems(packingTrekId, selectedSeason)).map(([catName, items]) => {
                  const checklistKey = `packing_${packingTrekId}_${selectedSeason}`;
                  const checkedList = getStoredChecked(checklistKey);
                  if (items.length === 0) return null;

                  return (
                    <div key={catName} style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="space-y-3.5 p-6 rounded-xl border shadow-sm">
                      <h3 style={{ color: INK, borderColor: `${JUNIPER}22` }} className="font-bold text-base capitalize border-b pb-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckSquare size={16} style={{ color: JUNIPER }} />
                          {catName === 'essentials' ? 'Documents & Essentials' : catName === 'toiletries' ? 'Hygiene & Toiletries' : catName}
                        </span>
                        <span style={{ fontFamily: FONT_MONO, color: '#8A8272', backgroundColor: PARCHMENT }} className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {items.filter(i => checkedList.includes(i)).length}/{items.length} Checked
                        </span>
                      </h3>

                      <div className="space-y-2">
                        {items.map((item, idx) => {
                          const isChecked = checkedList.includes(item);
                          return (
                            <button
                              key={idx}
                              onClick={() => handleToggleItem(item)}
                              className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg transition-colors cursor-pointer text-xs sm:text-sm font-medium hover:opacity-80"
                            >
                              {isChecked ? (
                                <CheckSquare size={18} style={{ color: JUNIPER }} className="shrink-0 mt-0.5" />
                              ) : (
                                <Square size={18} style={{ color: '#C9C1AE' }} className="shrink-0 mt-0.5" />
                              )}
                              <span style={isChecked ? { textDecoration: 'line-through', color: '#8A8272' } : { color: '#5B6660' }}>
                                {item}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: `1px dashed ${JUNIPER}33` }}>
                <div className="text-xs flex items-start gap-2 max-w-lg" style={{ color: '#8A8272' }}>
                  <AlertCircle size={16} className="shrink-0 mt-0.5" style={{ color: '#8A8272' }} />
                  <p className="leading-relaxed">
                    Checklist items auto-adjust based on high-altitude (above 4,000 meters) and winter thermals. Your ticks are saved locally so you won't lose progress.
                  </p>
                </div>
                <button
                  onClick={handleDownloadChecklist}
                  style={{ backgroundColor: INK, color: SAFFRON }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 font-bold px-6 py-3.5 rounded-lg text-sm transition-colors shadow-lg cursor-pointer"
                >
                  <Download size={16} /> Download Checklist (.txt)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'difficulty' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic font-normal flex items-center gap-2">
                    <BarChart3 style={{ color: JUNIPER }} size={22} /> Trek Comparison Analytics
                  </h2>
                  <p className="text-sm mt-1" style={{ color: '#5B6660' }}>
                    Compare key trekking variables side-by-side using charts.
                  </p>
                </div>

                <div style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="flex p-1.5 rounded-lg border">
                  {[
                    { id: 'altitude', label: 'Altitude' },
                    { id: 'duration', label: 'Duration' },
                    { id: 'price', label: 'Pricing' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setCompareMetric(m.id)}
                      style={compareMetric === m.id ? { backgroundColor: PARCHMENT, color: INK } : { color: '#5B6660' }}
                      className="px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer"
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="p-6 rounded-xl border space-y-3">
                <span style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="block text-xs font-bold uppercase tracking-widest">Select Routes to Compare (Min 2)</span>
                <div className="flex flex-wrap gap-2.5">
                  {treks.map(t => {
                    const isChecked = compareTrekIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleToggleCompareTrek(t.id)}
                        style={
                          isChecked
                            ? { backgroundColor: `${JUNIPER}14`, borderColor: `${JUNIPER}55`, color: JUNIPER }
                            : { backgroundColor: PARCHMENT, borderColor: `${JUNIPER}22`, color: '#5B6660' }
                        }
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all cursor-pointer"
                      >
                        {isChecked ? <CheckSquare size={13} /> : <Square size={13} />}
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}22` }} className="rounded-xl border p-4 sm:p-6">
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={`${JUNIPER}33`} vertical={false} />
                      <XAxis dataKey="name" stroke="#5B6660" fontSize={11} fontWeight={600} tickLine={false} />
                      <YAxis
                        stroke="#5B6660"
                        fontSize={11}
                        fontWeight={600}
                        tickLine={false}
                        unit={compareMetric === 'altitude' ? 'm' : compareMetric === 'duration' ? 'd' : ''}
                        tickFormatter={(val) => compareMetric === 'price' ? `Rs.${val/1000}k` : val}
                      />
                      <RechartsTooltip
                        cursor={{ fill: `${JUNIPER}0D` }}
                        contentStyle={{ background: INK, border: 'none', borderRadius: '12px', color: PARCHMENT, fontFamily: FONT_BODY }}
                        formatter={(value) => [compareMetric === 'price' ? `Rs. ${value.toLocaleString()}` : value, compareMetric === 'altitude' ? 'Max Altitude' : compareMetric === 'duration' ? 'Duration' : 'Price']}
                      />
                      {compareMetric === 'altitude' && (
                        <Bar dataKey="altitude" name="Max Altitude (m)" fill={JUNIPER} radius={[6, 6, 0, 0]} barSize={40} />
                      )}
                      {compareMetric === 'duration' && (
                        <Bar dataKey="duration" name="Duration (Days)" fill={ICE} radius={[6, 6, 0, 0]} barSize={40} />
                      )}
                      {compareMetric === 'price' && (
                        <Bar dataKey="price" name="Package Price (Rs.)" fill={SAFFRON} radius={[6, 6, 0, 0]} barSize={40} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div>
                <h2 style={{ fontFamily: FONT_DISPLAY, color: INK }} className="text-2xl italic font-normal flex items-center gap-2">
                  <Award style={{ color: JUNIPER }} size={22} /> Expedition Badges
                </h2>
                <p className="text-sm mt-1" style={{ color: '#5B6660' }}>
                  Interact with the website to unlock achievements and badges.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {badges.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      style={
                        badge.unlocked
                          ? { backgroundColor: `${badge.accent}0F`, borderColor: `${badge.accent}44` }
                          : { backgroundColor: PARCHMENT_DEEP, borderColor: `${JUNIPER}18`, opacity: 0.65 }
                      }
                      className="p-6 sm:p-8 rounded-xl border flex items-start gap-5 transition-all duration-300"
                    >
                      <div
                        style={
                          badge.unlocked
                            ? { backgroundColor: badge.accent, color: PARCHMENT, borderColor: `${badge.accent}CC` }
                            : { backgroundColor: '#DCD5C2', color: '#8A8272', borderColor: '#C9C1AE' }
                        }
                        className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm border"
                      >
                        {badge.unlocked ? <Icon size={24} /> : <Lock size={24} />}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 style={{ fontFamily: FONT_DISPLAY, color: badge.unlocked ? INK : '#8A8272' }} className="italic text-base">
                            {badge.name}
                          </h3>
                          <span
                            style={
                              badge.unlocked
                                ? { fontFamily: FONT_MONO, backgroundColor: `${badge.accent}22`, color: badge.accent }
                                : { fontFamily: FONT_MONO, backgroundColor: '#DCD5C2', color: '#8A8272' }
                            }
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          >
                            {badge.unlocked ? 'Unlocked' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-light leading-relaxed" style={{ color: '#5B6660' }}>{badge.desc}</p>
                        <div style={{ fontFamily: FONT_MONO, color: '#8A8272' }} className="flex items-center gap-1.5 pt-2 text-[10px] font-bold uppercase tracking-widest">
                          Progress: <span style={{ color: badge.unlocked ? badge.accent : '#8A8272' }} className="font-bold">{badge.progress}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {selectedTrekForBooking && (
        <BookingModal
          trek={selectedTrekForBooking}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setSelectedTrekForBooking(null);
          }}
        />
      )}
    </div>
  );
}