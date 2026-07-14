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

// Helper for packing checklist generator items
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

  // Season-specific clothing
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
    // Spring & Autumn
    categories.clothing = [
      "Breathable lightweight trekking shirts (short & long sleeve)",
      "Convertible quick-dry trekking pants (2 pairs)",
      "Lightweight fleece jacket or windbreaker",
      "Wide-brim sun hat & UV protected sunglasses",
      "Lightweight thermal underwear set (for cold nights)",
      "Lightweight gloves"
    ];
  }

  // Altitude/Difficulty specific gear
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
  
  // Wizard state
  const [wizardStep, setWizardStep] = useState(0); 
  const [selections, setSelections] = useState({
    budget: '',     
    duration: '',   
    difficulty: ''  
  });
  
  // Direct booking state
  const [selectedTrekForBooking, setSelectedTrekForBooking] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Calculator state
  const [calcTrekId, setCalcTrekId] = useState(treks[0].id);
  const [calcTravelers, setCalcTravelers] = useState(1);
  const [calcFlights, setCalcFlights] = useState(true);
  const [calcGear, setCalcGear] = useState(false);
  const [calcTips, setCalcTips] = useState(true);
  const [calcPersonalDaily, setCalcPersonalDaily] = useState(2500);

  // Packing Checklist state
  const [packingTrekId, setPackingTrekId] = useState(treks[0].id);
  const [selectedSeason, setSelectedSeason] = useState('autumn');
  const [packingUpdateTick, setPackingUpdateTick] = useState(0);

  // Difficulty comparison state
  const [compareTrekIds, setCompareTrekIds] = useState(treks.map(t => t.id));
  const [compareMetric, setCompareMetric] = useState('altitude'); // 'altitude', 'duration', 'price'

  // Cost Calculator calculations
  const calcTrek = treks.find(t => t.id === calcTrekId) || treks[0];
  const calcBasePrice = calcTrek.price;
  const calcBaseTotal = calcBasePrice * calcTravelers;
  const calcDiscountPct = calcTravelers >= 6 ? 10 : (calcTravelers >= 3 ? 5 : 0);
  const calcDiscountAmount = Math.round((calcBaseTotal * calcDiscountPct) / 100);
  const calcBaseAfterDiscount = calcBaseTotal - calcDiscountAmount;

  // Permits per region
  const permitCost = calcTrek.id.includes('mustang') ? 67000 : (calcTrek.id.includes('manaslu') ? 27000 : 5000);
  const totalPermits = permitCost * calcTravelers;

  // Transport costs
  const transportCost = (calcTrek.id.includes('everest') || calcTrek.id.includes('gokyo')) ? 40000 : ((calcTrek.location.includes('Annapurna') || calcTrek.id.includes('mardi') || calcTrek.id.includes('poon')) ? 15000 : 8000);
  const totalTransport = calcFlights ? (transportCost * calcTravelers) : 0;

  // Gear costs
  const gearCost = 8000;
  const totalGear = calcGear ? (gearCost * calcTravelers) : 0;

  // Tips and personal expenses
  const tipsFlat = calcTips ? (1200 * calcTrek.duration) : 0;
  const totalPersonal = calcPersonalDaily * calcTrek.duration * calcTravelers;
  const totalTipsAndPersonal = tipsFlat + totalPersonal;

  // Grand Total
  const grandTotal = calcBaseAfterDiscount + totalPermits + totalTransport + totalGear + totalTipsAndPersonal;

  // Tracking calculators visits for achievements
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'calculator') {
      localStorage.setItem('has_calculated', 'true');
    }
  };

  // Restart quiz
  const handleRestart = () => {
    setSelections({ budget: '', duration: '', difficulty: '' });
    setWizardStep(0);
  };

  // Select an option and go to next step
  const handleSelectOption = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    setWizardStep(prev => prev + 1);
  };

  // Go back a step
  const handlePrevStep = () => {
    setWizardStep(prev => Math.max(0, prev - 1));
  };

  // Calculate wizard matches
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

  // Checklist localstorage helpers
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

  // Compare Checkbox Handler
  const handleToggleCompareTrek = (id) => {
    if (compareTrekIds.includes(id)) {
      if (compareTrekIds.length > 2) { 
        setCompareTrekIds(prev => prev.filter(t => t !== id));
      }
    } else {
      setCompareTrekIds(prev => [...prev, id]);
    }
  };

  // Chart data extraction
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

  // Evaluate Badges
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
        color: 'text-blue-500 bg-blue-50/50 border-blue-100'
      },
      {
        id: 'dreamer',
        name: 'Himalayan Dreamer',
        desc: 'Shortlist three or more treks in your wishlist.',
        unlocked: isDreamerUnlocked,
        progress: `${savedCount}/3 Saved`,
        icon: Award,
        color: 'text-indigo-500 bg-indigo-50/50 border-indigo-100'
      },
      {
        id: 'scholar',
        name: 'Summit Scholar',
        desc: 'Check off at least 5 equipment items in the packing list.',
        unlocked: isScholarUnlocked,
        progress: `${activeCheckedCount}/5 Checked`,
        icon: Backpack,
        color: 'text-purple-500 bg-purple-50/50 border-purple-100'
      },
      {
        id: 'calculator',
        name: 'Budget Master',
        desc: 'Generate an estimate in the Trip Cost Calculator.',
        unlocked: isCalculatorUnlocked,
        progress: isCalculatorUnlocked ? '1/1 Checked' : '0/1 Checked',
        icon: Calculator,
        color: 'text-amber-500 bg-amber-50/50 border-amber-100'
      },
      {
        id: 'booker',
        name: 'Registered Climber',
        desc: 'Submit a booking request for any trek route.',
        unlocked: isBookerUnlocked,
        progress: isBookerUnlocked ? '1/1 Checked' : '0/1 Checked',
        icon: Sparkles,
        color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100'
      }
    ];
  };

  const badges = evaluateBadges();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEO 
        title="Trek Planner & Interactive Tools" 
        description="Plan your next Nepalese Himalayan adventure with our interactive quiz wizard, budget calculators, and packing checklist utilities."
      />

      {/* Header Banner */}
      <div className="bg-slate-950 pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden mb-8 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-500/20">
            <Sparkles size={12} /> Interactive Suite
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">Trek Planner & Tools</h1>
          <p className="text-slate-300 mt-3 max-w-2xl font-light text-base sm:text-lg">
            Smart tools to help you design, customize, and prepare for your dream trek in the Himalayas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {[
            { id: 'wizard', label: 'Plan My Trek Quiz', icon: Compass },
            { id: 'calculator', label: 'Trip Cost Calculator', icon: Calculator },
            { id: 'packing', label: 'Packing Checklist', icon: Backpack },
            { id: 'difficulty', label: 'Difficulty Comparison', icon: BarChart3 },
            { id: 'badges', label: 'My Achievements', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 relative cursor-pointer
                  ${activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
          
          {/* TAB 1: Plan My Trek Wizard */}
          {activeTab === 'wizard' && (
            <div className="p-6 sm:p-10 md:p-12">
              <AnimatePresence mode="wait">
                
                {/* Step 0: Welcome Screen */}
                {wizardStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="max-w-2xl mx-auto text-center py-10"
                  >
                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <Compass size={40} className="text-emerald-600 animate-float" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-4">
                      Find Your Perfect Himalayan Trail
                    </h2>
                    <p className="text-slate-600 text-lg font-light leading-relaxed mb-10">
                      Nepal offers walks for everyone—from peaceful green valleys to high glacier climbs. 
                      Answer 3 simple questions about your budget, timing, and experience, and our algorithm 
                      will find the ideal match for your adventure.
                    </p>
                    <button
                      onClick={() => setWizardStep(1)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      Start Plan Finder <ArrowRight size={20} />
                    </button>
                  </motion.div>
                )}

                {/* Step 1: Budget Selection */}
                {wizardStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    {/* Progress */}
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handleRestart} className="text-slate-500 hover:text-slate-700 flex items-center gap-1.5 text-sm font-semibold transition-colors">
                        <RotateCcw size={16} /> Reset
                      </button>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                        Step 1 of 3
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 text-center">
                      What is your estimated trek budget?
                    </h2>
                    <p className="text-slate-500 text-center mb-10 text-sm sm:text-base">
                      Select a pricing category per person (excluding international flights).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'low', title: 'Budget-Friendly', price: 'Under Rs. 100,000', desc: 'Short routes and local tea-house stays.', icon: DollarSign },
                        { id: 'medium', title: 'Standard Choice', price: 'Rs. 100,000 - 180,000', desc: 'Classic multi-day high-altitude circuits.', icon: DollarSign },
                        { id: 'high', title: 'Premium/Expedition', price: 'Over Rs. 180,000', desc: 'Long journeys or remote wilderness trails.', icon: DollarSign }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('budget', opt.id)}
                          className="group text-left p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center mb-6 text-slate-600 group-hover:text-emerald-600 transition-colors shadow-sm">
                              <DollarSign size={22} />
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors mb-2">{opt.title}</h3>
                            <p className="text-emerald-600 font-bold text-sm mb-4">{opt.price}</p>
                            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">{opt.desc}</p>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                            Select Range <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Duration Selection */}
                {wizardStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handlePrevStep} className="text-slate-500 hover:text-slate-700 flex items-center gap-1.5 text-sm font-semibold transition-colors">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                        Step 2 of 3
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 text-center">
                      How long would you like to trek?
                    </h2>
                    <p className="text-slate-500 text-center mb-10 text-sm sm:text-base">
                      Choose the duration that fits your itinerary.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { id: 'short', title: 'Short Trip', days: '5 - 8 Days', desc: 'Beautiful vistas without long mountain stays.', icon: Calendar },
                        { id: 'medium', title: 'Classic Duration', days: '9 - 14 Days', desc: 'Standard circuits with full mountain depth.', icon: Calendar },
                        { id: 'long', title: 'Epic Expedition', days: '15+ Days', desc: 'Deep mountain exploration and challenging passes.', icon: Calendar }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('duration', opt.id)}
                          className="group text-left p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center mb-6 text-slate-600 group-hover:text-emerald-600 transition-colors shadow-sm">
                              <Calendar size={22} />
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors mb-2">{opt.title}</h3>
                            <p className="text-emerald-600 font-bold text-sm mb-4">{opt.days}</p>
                            <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">{opt.desc}</p>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                            Select Duration <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Fitness & Difficulty Level */}
                {wizardStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="max-w-3xl mx-auto"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <button onClick={handlePrevStep} className="text-slate-500 hover:text-slate-700 flex items-center gap-1.5 text-sm font-semibold transition-colors">
                        <ArrowLeft size={16} /> Back
                      </button>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                        Step 3 of 3
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2 text-center">
                      What is your trekking experience level?
                    </h2>
                    <p className="text-slate-500 text-center mb-10 text-sm sm:text-base">
                      Assess your fitness and comfort with high-altitude environments.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                      {[
                        { id: 'easy', title: 'Beginner / Moderate', desc: 'I prefer gradual ascents, well-worn paths, and maximum altitudes below 5,000m. Suitable for regular fitness levels.', icon: Dumbbell, details: ['Gradual climbing', 'Altitudes < 5,000m', 'Standard lodges', 'Regular walking fitness'] },
                        { id: 'challenging', title: 'Advanced / Strenuous', desc: 'I am ready for challenging steep climbs, high mountain passes (above 5,000m), glacier terrain, cold weather, and long walking days.', icon: Dumbbell, details: ['Steep glacier terrain', 'Altitudes > 5,000m', 'Cold/snow possibilities', 'High cardiovascular shape'] }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption('difficulty', opt.id)}
                          className="group text-left p-6 sm:p-8 rounded-3xl border border-slate-100 bg-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
                        >
                          <div>
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center mb-6 text-slate-600 group-hover:text-emerald-600 transition-colors shadow-sm">
                              <Dumbbell size={22} />
                            </div>
                            <h3 className="font-extrabold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors mb-3">{opt.title}</h3>
                            <p className="text-slate-500 text-sm font-light leading-relaxed mb-6">{opt.desc}</p>
                            
                            <ul className="space-y-2 border-t border-slate-50 pt-4">
                              {opt.details.map((det, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                  <Check size={12} className="text-emerald-500" /> {det}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-8 flex items-center text-xs font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                            Select Level <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Suggestions Results */}
                {wizardStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-10"
                  >
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-slate-800">Your Recommended Treks</h2>
                        <p className="text-slate-500 text-sm mt-1">Based on your custom preferences.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRestart}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold rounded-xl text-sm transition-colors cursor-pointer"
                        >
                          <RotateCcw size={16} /> Restart Quiz
                        </button>
                      </div>
                    </div>

                    {/* Filter parameters recap */}
                    <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm font-medium">
                      <span className="text-slate-500">Criteria:</span>
                      <span className="bg-white px-3 py-1 rounded-lg border border-slate-100 text-slate-700 capitalize flex items-center gap-1">
                        Budget: <strong className="text-emerald-700 font-semibold">{selections.budget}</strong>
                      </span>
                      <span className="bg-white px-3 py-1 rounded-lg border border-slate-100 text-slate-700 capitalize flex items-center gap-1">
                        Duration: <strong className="text-emerald-700 font-semibold">{selections.duration}</strong>
                      </span>
                      <span className="bg-white px-3 py-1 rounded-lg border border-slate-100 text-slate-700 capitalize flex items-center gap-1">
                        Fitness: <strong className="text-emerald-700 font-semibold">{selections.difficulty}</strong>
                      </span>
                    </div>

                    {/* Results list */}
                    {results.length > 0 ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {results.map((trek, index) => (
                          <motion.div
                            key={trek.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between"
                          >
                            <div>
                              {/* Trek Image & Badge */}
                              <div className="relative h-56 sm:h-64 w-full">
                                <img src={trek.image} alt={trek.name} className="absolute inset-0 w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                                
                                <div className="absolute top-4 right-4 bg-emerald-500 text-white font-extrabold px-4 py-2 rounded-2xl shadow-lg border border-emerald-400 flex items-center gap-1">
                                  <Award size={16} /> {trek.matchPct}% Match
                                </div>

                                <div className="absolute bottom-4 left-6 right-6">
                                  <span className="inline-block px-2.5 py-0.5 bg-emerald-500/80 backdrop-blur-sm text-white text-xs font-bold uppercase rounded-md mb-2">
                                    {trek.category}
                                  </span>
                                  <h3 className="text-white font-bold text-2xl tracking-tight leading-tight">{trek.name}</h3>
                                </div>
                              </div>

                              {/* Details Grid */}
                              <div className="p-6 sm:p-8 space-y-6">
                                <p className="text-slate-600 text-sm font-light leading-relaxed">
                                  {trek.description}
                                </p>

                                <div className="grid grid-cols-3 gap-4 border-y border-slate-50 py-4 text-center">
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                                    <span className="text-slate-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-1">
                                      <Calendar size={14} className="text-slate-400" /> {trek.duration} Days
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Altitude</p>
                                    <span className="text-slate-800 font-extrabold text-sm sm:text-base flex items-center justify-center gap-1">
                                      <TrendingUp size={14} className="text-slate-400" /> {trek.maxAltitude || 'N/A'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Price</p>
                                    <span className="text-emerald-600 font-black text-sm sm:text-base">
                                      Rs. {trek.price.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Matching Breakdown */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-2.5">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Matching Breakdown</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.budget === 1.0 ? (
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                      ) : trek.details.budget === 0.5 ? (
                                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} className="text-slate-300 shrink-0" />
                                      )}
                                      <span className={trek.details.budget === 1.0 ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
                                        Budget: {trek.details.budget === 1.0 ? 'Fits Ideal' : trek.details.budget === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.duration === 1.0 ? (
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                      ) : trek.details.duration === 0.5 ? (
                                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} className="text-slate-300 shrink-0" />
                                      )}
                                      <span className={trek.details.duration === 1.0 ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
                                        Days: {trek.details.duration === 1.0 ? 'Fits Ideal' : trek.details.duration === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 font-medium">
                                      {trek.details.difficulty === 1.0 ? (
                                        <Check size={14} className="text-emerald-500 shrink-0" />
                                      ) : trek.details.difficulty === 0.5 ? (
                                        <AlertCircle size={14} className="text-amber-500 shrink-0" />
                                      ) : (
                                        <AlertCircle size={14} className="text-slate-300 shrink-0" />
                                      )}
                                      <span className={trek.details.difficulty === 1.0 ? 'text-slate-700 font-semibold' : 'text-slate-500'}>
                                        Fitness: {trek.details.difficulty === 1.0 ? 'Fits Ideal' : trek.details.difficulty === 0.5 ? 'Partial Fit' : 'Mismatch'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="p-6 sm:p-8 pt-0 flex flex-col sm:flex-row gap-3 border-t border-slate-50/50 mt-auto">
                              <Link 
                                to={`/packages/${trek.id}`} 
                                className="flex-1 text-center py-3 border border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                              >
                                View Details
                              </Link>
                              <button
                                onClick={() => {
                                  setSelectedTrekForBooking(trek);
                                  localStorage.setItem('has_booked', 'true');
                                  setIsBookingOpen(true);
                                }}
                                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg shadow-emerald-600/10 transition-all cursor-pointer"
                              >
                                Book Now
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20 max-w-md mx-auto">
                        <HelpCircle size={48} className="text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Treks Match Your Criteria</h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                          None of our current treks matched your selection combination. Please try setting broader options.
                        </p>
                        <button
                          onClick={handleRestart}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
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

          {/* TAB 2: Trip Cost Calculator */}
          {activeTab === 'calculator' && (
            <div className="p-6 sm:p-10 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Controls */}
                <div className="lg:col-span-7 space-y-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                      <Calculator className="text-emerald-600" size={24} /> Trip Cost Estimator
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Customize your choices to calculate an approximate total cost for your expedition.
                    </p>
                  </div>

                  {/* Trek Selector */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Select Trek Route</label>
                    <select
                      value={calcTrekId}
                      onChange={(e) => setCalcTrekId(e.target.value)}
                      className="w-full p-4 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 font-semibold transition-all cursor-pointer"
                    >
                      {treks.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.duration} Days) - Rs. {t.price.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Travelers Count */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700">Number of Trekkers</label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCalcTravelers(prev => Math.max(1, prev - 1))}
                        className="w-12 h-12 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 flex items-center justify-center font-bold text-lg text-slate-700 transition-colors cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-14 text-center font-extrabold text-xl text-slate-800">{calcTravelers}</span>
                      <button
                        onClick={() => setCalcTravelers(prev => Math.min(12, prev + 1))}
                        className="w-12 h-12 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-slate-50 flex items-center justify-center font-bold text-lg text-slate-700 transition-colors cursor-pointer"
                      >
                        +
                      </button>
                      {calcTravelers >= 3 && (
                        <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                          🎉 {calcDiscountPct}% Group Discount Applied!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Options Checkboxes */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-sm font-bold text-slate-700">Optional Services</h3>
                    
                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcFlights}
                        onChange={(e) => setCalcFlights(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">Include Flights & Local Transport</span>
                        <span className="block text-xs text-slate-500 font-light leading-relaxed">
                          Add Kathmandu round-trip transit to region (e.g. Lukla flights for Everest, Pokhara for Annapurna).
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcGear}
                        onChange={(e) => setCalcGear(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">Rent High-Altitude Gear</span>
                        <span className="block text-xs text-slate-500 font-light leading-relaxed">
                          Rent sleeping bag, heavy down jacket, and heavy gear (Rs. {gearCost.toLocaleString()} per trekker).
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={calcTips}
                        onChange={(e) => setCalcTips(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <div>
                        <span className="block text-sm font-bold text-slate-800">Guide & Porter Tips</span>
                        <span className="block text-xs text-slate-500 font-light leading-relaxed">
                          Include standard collective tips for guide and porter support crew (Rs. 1,200 per day flat).
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Personal Daily Expenses Slider */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-slate-700">Personal Daily Expenses</label>
                      <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                        Rs. {calcPersonalDaily.toLocaleString()} / day
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-light leading-relaxed">
                      Covers hot showers, Wi-Fi access, device battery charging, snacks, and extra drinks at tea houses.
                    </p>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="500"
                      value={calcPersonalDaily}
                      onChange={(e) => setCalcPersonalDaily(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>Rs. 1,000 (Minimal)</span>
                      <span>Rs. 8,000 (Luxurious)</span>
                    </div>
                  </div>
                </div>

                {/* Bill Breakdown Display */}
                <div className="lg:col-span-5">
                  <div className="sticky top-24 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-white/10">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/50 via-slate-900 to-slate-900 z-0"></div>
                    <div className="relative z-10 space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-300">Cost Summary</h3>
                        <p className="text-xs text-slate-500 font-light">Calculated estimate for your travel party.</p>
                      </div>

                      {/* Line Items */}
                      <div className="space-y-4 text-sm font-medium border-b border-white/10 pb-6">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="block text-slate-200">Base Package Cost</span>
                            <span className="block text-xs text-slate-400 font-light">{calcTravelers} Pax x Rs. {calcBasePrice.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className={`block ${calcDiscountPct > 0 ? 'line-through text-slate-500 text-xs' : 'text-slate-100 font-bold'}`}>
                              Rs. {calcBaseTotal.toLocaleString()}
                            </span>
                            {calcDiscountPct > 0 && (
                              <span className="block text-emerald-400 font-bold">
                                Rs. {calcBaseAfterDiscount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block text-slate-200">Permits & Admin Fees</span>
                            <span className="block text-xs text-slate-400 font-light">Park entry & TIMS registration</span>
                          </div>
                          <span className="text-slate-100 font-bold">Rs. {totalPermits.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block text-slate-200">Transit & Flights</span>
                            <span className="block text-xs text-slate-400 font-light">{calcFlights ? 'Included flight/transport options' : 'Self-arranged'}</span>
                          </div>
                          <span className="text-slate-100 font-bold">Rs. {totalTransport.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block text-slate-200">Gear Rentals</span>
                            <span className="block text-xs text-slate-400 font-light">{calcGear ? 'Sleeping bag & down jacket rental' : 'Own gear'}</span>
                          </div>
                          <span className="text-slate-100 font-bold">Rs. {totalGear.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between items-start">
                          <div>
                            <span className="block text-slate-200">Personal & Crew Expenses</span>
                            <span className="block text-xs text-slate-400 font-light">Tips + personal daily tea house expenses</span>
                          </div>
                          <span className="text-slate-100 font-bold">Rs. {totalTipsAndPersonal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Grand Total */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-bold text-base">Estimated Total</span>
                          <span className="text-emerald-400 font-black text-2xl sm:text-3xl">
                            Rs. {grandTotal.toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-xs font-light text-slate-300 flex items-start gap-2.5">
                          <AlertCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            This estimator is designed to help you plan. True costs vary depending on personal choices, weather, seasonal rate shifts, and booking lead time.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedTrekForBooking(calcTrek);
                            localStorage.setItem('has_booked', 'true');
                            setIsBookingOpen(true);
                          }}
                          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-center block"
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

          {/* TAB 3: Packing Checklist Generator */}
          {activeTab === 'packing' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Backpack className="text-emerald-600" size={24} /> Seasonal Packing Checklist
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Generate a customized packing list based on your specific trail altitude and seasonal weather.
                </p>
              </div>

              {/* Form Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Route</label>
                  <select
                    value={packingTrekId}
                    onChange={(e) => setPackingTrekId(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-semibold outline-none focus:border-emerald-500 transition-all text-sm cursor-pointer"
                  >
                    {treks.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (Max Alt: {t.maxAltitude || 'N/A'})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Season</label>
                  <div className="flex gap-2">
                    {['spring', 'monsoon', 'autumn', 'winter'].map(season => (
                      <button
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`
                          flex-1 py-3 px-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer
                          ${selectedSeason === season 
                            ? 'bg-emerald-600 text-white shadow-md' 
                            : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }
                        `}
                      >
                        {season}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Checklist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8">
                {Object.entries(getPackingItems(packingTrekId, selectedSeason)).map(([catName, items]) => {
                  const checklistKey = `packing_${packingTrekId}_${selectedSeason}`;
                  const checkedList = getStoredChecked(checklistKey);
                  if (items.length === 0) return null;

                  return (
                    <div key={catName} className="space-y-3.5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-base capitalize border-b border-slate-50 pb-2.5 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckSquare size={16} className="text-emerald-600" />
                          {catName === 'essentials' ? 'Documents & Essentials' : catName === 'toiletries' ? 'Hygiene & Toiletries' : catName}
                        </span>
                        <span className="text-[10px] text-slate-400 bg-slate-50 font-bold px-2 py-0.5 rounded-full">
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
                              className="w-full text-left flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-xs sm:text-sm font-medium"
                            >
                              {isChecked ? (
                                <CheckSquare size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                              ) : (
                                <Square size={18} className="text-slate-300 shrink-0 mt-0.5" />
                              )}
                              <span className={isChecked ? 'line-through text-slate-400' : 'text-slate-600'}>
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

              {/* Action Area */}
              <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 pt-8 gap-4">
                <div className="text-xs text-slate-400 flex items-start gap-2 max-w-lg">
                  <AlertCircle size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Checklist items auto-adjust based on high-altitude (above 4,000 meters) and winter thermals. Your ticks are saved locally so you won't lose progress.
                  </p>
                </div>
                <button
                  onClick={handleDownloadChecklist}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg cursor-pointer"
                >
                  <Download size={16} /> Download Checklist (.txt)
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Difficulty Comparison Chart */}
          {activeTab === 'difficulty' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <BarChart3 className="text-emerald-600" size={24} /> Trek Comparison Analytics
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Compare key trekking variables side-by-side using charts.
                  </p>
                </div>
                
                {/* Metric Selector Tabs */}
                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                  {[
                    { id: 'altitude', label: 'Altitude' },
                    { id: 'duration', label: 'Duration' },
                    { id: 'price', label: 'Pricing' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => setCompareMetric(m.id)}
                      className={`
                        px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                        ${compareMetric === m.id 
                          ? 'bg-white text-slate-800 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                        }
                      `}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector Checkboxes */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Routes to Compare (Min 2)</span>
                <div className="flex flex-wrap gap-2.5">
                  {treks.map(t => {
                    const isChecked = compareTrekIds.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleToggleCompareTrek(t.id)}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer
                          ${isChecked 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }
                        `}
                      >
                        {isChecked ? <CheckSquare size={13} /> : <Square size={13} />}
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Recharts Render Container */}
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-inner">
                <div className="w-full overflow-hidden">
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={600} tickLine={false} />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={11} 
                        fontWeight={600} 
                        tickLine={false}
                        unit={compareMetric === 'altitude' ? 'm' : compareMetric === 'duration' ? 'd' : ''}
                        tickFormatter={(val) => compareMetric === 'price' ? `Rs.${val/1000}k` : val}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                        contentStyle={{ background: '#020617', border: 'none', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                        formatter={(value) => [compareMetric === 'price' ? `Rs. ${value.toLocaleString()}` : value, compareMetric === 'altitude' ? 'Max Altitude' : compareMetric === 'duration' ? 'Duration' : 'Price']}
                      />
                      {compareMetric === 'altitude' && (
                        <Bar dataKey="altitude" name="Max Altitude (m)" fill="#10b981" radius={[8, 8, 0, 0]} barSize={40} />
                      )}
                      {compareMetric === 'duration' && (
                        <Bar dataKey="duration" name="Duration (Days)" fill="#0ea5e9" radius={[8, 8, 0, 0]} barSize={40} />
                      )}
                      {compareMetric === 'price' && (
                        <Bar dataKey="price" name="Package Price (Rs.)" fill="#f59e0b" radius={[8, 8, 0, 0]} barSize={40} />
                      )}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: My Achievements / Badges */}
          {activeTab === 'badges' && (
            <div className="p-6 sm:p-10 md:p-12 space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <Award className="text-emerald-600" size={24} /> Gamification Badges
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                  Interact with the website to unlock achievements and badges.
                </p>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {badges.map(badge => {
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className={`
                        p-6 sm:p-8 rounded-3xl border flex items-start gap-5 transition-all duration-300
                        ${badge.unlocked 
                          ? 'bg-emerald-50/30 border-emerald-200 hover:shadow-lg' 
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                        }
                      `}
                    >
                      {/* Badge Icon circle */}
                      <div className={`
                        w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border
                        ${badge.unlocked 
                          ? 'bg-emerald-500 border-emerald-400 text-white' 
                          : 'bg-slate-200 border-slate-300 text-slate-500'
                        }
                      `}>
                        {badge.unlocked ? <Icon size={24} /> : <Lock size={24} />}
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-extrabold text-base ${badge.unlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                            {badge.name}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.unlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                            {badge.unlocked ? 'Unlocked' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">{badge.desc}</p>
                        <div className="flex items-center gap-1.5 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Progress: <span className={badge.unlocked ? 'text-emerald-600 font-bold' : 'text-slate-500 font-semibold'}>{badge.progress}</span>
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

      {/* Render Booking Modal for Quick Booking */}
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
