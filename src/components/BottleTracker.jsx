import React, { useState } from 'react';
import { 
  Droplet, ShoppingBag, Plus, Minus, RotateCcw, Calendar, 
  AlertTriangle, CheckCircle2, Clock, Sparkles, TrendingDown,
  Sliders, ArrowUpRight, ShieldCheck, History, ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRODUCT_INFO } from '../data/bodywiseData';
import { soundManager } from '../utils/soundEffects';

export default function BottleTracker({ state, setState, onOpenReorder, onToast }) {
  const {
    currentMl,
    swipesPerUse,
    frequencyPerDay,
    amazonCycleDays,
    logs
  } = state;

  const [isCalibrating, setIsCalibrating] = useState(false);

  // Constants
  // 1 swipe per underarm = ~0.2ml (0.1ml each)
  // 2 swipes per underarm = ~0.35ml (standard recommended)
  // 3+ swipes = ~0.5ml
  const mlPerApplication = swipesPerUse === 1 ? 0.22 : swipesPerUse === 2 ? 0.35 : 0.50;
  const dailyMlBurn = mlPerApplication * frequencyPerDay;

  // Days remaining calculation
  const daysRemaining = dailyMlBurn > 0 ? Math.floor(currentMl / dailyMlBurn) : 999;
  const applicationsRemaining = dailyMlBurn > 0 ? Math.floor(currentMl / mlPerApplication) : 0;

  // Projected empty date
  const projectedEmptyDate = new Date();
  projectedEmptyDate.setDate(projectedEmptyDate.getDate() + daysRemaining);

  // Percentage
  const fillPercentage = Math.min(100, Math.max(0, Math.round((currentMl / PRODUCT_INFO.volumeMl) * 100)));

  // Bottle health status
  const isCritical = currentMl <= 7; // under ~14%
  const isLow = !isCritical && currentMl <= 15; // under 30%
  const isHealthy = !isLow && !isCritical;

  // Amazon subscription mismatch calculation
  // E.g., user runs out in 38 days, but Amazon cycle is 60 days -> 22 days stockout drought!
  const mismatchDays = amazonCycleDays - daysRemaining;
  const willRunOutBeforeAmazon = daysRemaining < amazonCycleDays;
  const daysOfExcessStock = daysRemaining > amazonCycleDays ? (daysRemaining - amazonCycleDays) : 0;

  // Optimal recommended Amazon cycle
  const recommendedAmazonCycle = Math.max(20, Math.min(90, Math.round(daysRemaining / 5) * 5));

  // Log today's application
  const logApplication = () => {
    if (currentMl <= 0) {
      soundManager.playWarning();
      onToast({
        type: 'danger',
        title: 'Bottle is Empty!',
        message: 'Your 50ml bottle has run out. Please reorder to keep your underarm barrier protected.'
      });
      return;
    }

    soundManager.playClick();
    const newMl = Math.max(0, Number((currentMl - mlPerApplication).toFixed(2)));
    const todayStr = new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    setState(prev => ({
      ...prev,
      currentMl: newMl,
      logs: [
        {
          id: Date.now(),
          date: todayStr,
          amountMl: mlPerApplication,
          remainingMl: newMl,
          swipes: swipesPerUse
        },
        ...prev.logs.slice(0, 14) // keep last 15
      ]
    }));

    if (newMl <= 7) {
      soundManager.playWarning();
      onToast({
        type: 'warning',
        title: 'Bottle Running Low!',
        message: `Only ${newMl} ml left (~${Math.floor(newMl / dailyMlBurn)} days). Reorder now to prevent routine disruption.`
      });
    } else {
      onToast({
        type: 'success',
        title: 'Application Logged',
        message: `-${mlPerApplication} ml logged. ${newMl} ml remaining in your 50ml bottle.`
      });
    }
  };

  const undoLastLog = () => {
    if (logs.length === 0) return;
    soundManager.playClick();
    const lastLog = logs[0];
    const restoredMl = Math.min(50, Number((currentMl + lastLog.amountMl).toFixed(2)));

    setState(prev => ({
      ...prev,
      currentMl: restoredMl,
      logs: prev.logs.slice(1)
    }));

    onToast({
      type: 'info',
      title: 'Log Undone',
      message: `Restored +${lastLog.amountMl} ml back to bottle.`
    });
  };

  const handleSliderChange = (e) => {
    const val = parseFloat(e.target.value);
    setState(prev => ({
      ...prev,
      currentMl: val
    }));
  };

  const setBottleFull = () => {
    soundManager.playSuccess();
    confetti({ particleCount: 50, spread: 50 });
    setState(prev => ({
      ...prev,
      currentMl: 50
    }));
    onToast({
      type: 'success',
      title: 'New Bottle Started!',
      message: 'Reset to 50ml fresh bottle. Ready to track daily applications.'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E24] via-[#09151A] to-[#060C10] border border-[#182C37] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-xs font-semibold mb-3">
            <Droplet className="w-3.5 h-3.5" />
            <span>Smart 50ml Depletion Algorithm</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Usage & Refill Depletion Tracker
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Never let your 8-week pigmentation progress get derailed by a sudden empty roll-on bottle. Track daily swipes and synchronize your delivery cycle with Amazon Subscribe & Save.
          </p>
        </div>
      </div>

      {/* Main Grid: Bottle Graphic & Log on Left, Amazon Sync & Analytics on Right */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Bottle + Application Logger */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual Bottle Card */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
            
            {/* Health pill */}
            <div className="w-full flex items-center justify-between mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isCritical ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isCritical ? <AlertTriangle className="w-3.5 h-3.5" /> : <Droplet className="w-3.5 h-3.5" />}
                {isCritical ? 'Critical Refill' : isLow ? 'Low Stock Warning' : 'Optimal Supply'}
              </span>

              <button
                onClick={() => setIsCalibrating(!isCalibrating)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-[#0A141A] border border-[#182B37]"
                title="Calibrate Current Bottle Level"
              >
                <Sliders className="w-3 h-3 text-[#00C2A8]" />
                <span>{isCalibrating ? 'Close Calibrate' : 'Calibrate'}</span>
              </button>
            </div>

            {/* Realistic 50ml Roll-on Bottle SVG */}
            <div className="relative py-4 flex flex-col items-center">
              
              {/* Bottle SVG graphic */}
              <div className="w-48 h-80 relative flex items-center justify-center">
                
                {/* SVG Silhouette */}
                <svg viewBox="0 0 160 260" className="w-full h-full drop-shadow-2xl">
                  <defs>
                    <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#1E323F" stopOpacity="0.8" />
                      <stop offset="20%" stopColor="#2E4A5C" stopOpacity="0.4" />
                      <stop offset="80%" stopColor="#2E4A5C" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#1E323F" stopOpacity="0.8" />
                    </linearGradient>

                    <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4EECD5" />
                      <stop offset="50%" stopColor="#00C2A8" />
                      <stop offset="100%" stopColor="#007F6E" />
                    </linearGradient>

                    <clipPath id="bottleBodyClip">
                      {/* Realistic roll-on bottle outline */}
                      <path d="M 40 70 C 40 60, 50 55, 60 55 L 100 55 C 110 55, 120 60, 120 70 L 124 210 C 124 235, 110 245, 80 245 C 50 245, 36 235, 36 210 Z" />
                    </clipPath>
                  </defs>

                  {/* Top Roller Ball Cap */}
                  <ellipse cx="80" cy="30" rx="28" ry="18" fill="#14232C" stroke="#253D4D" strokeWidth="2" />
                  <ellipse cx="80" cy="27" rx="20" ry="10" fill="#00C2A8" fillOpacity="0.25" />
                  <ellipse cx="76" cy="24" rx="10" ry="4" fill="#FFFFFF" fillOpacity="0.3" />

                  {/* Bottle Neck Ring */}
                  <rect x="52" y="42" width="56" height="15" rx="3" fill="#1A2D3A" stroke="#2D4A5E" strokeWidth="1.5" />

                  {/* Bottle Glass Outer Wall */}
                  <path
                    d="M 40 70 C 40 60, 50 55, 60 55 L 100 55 C 110 55, 120 60, 120 70 L 124 210 C 124 235, 110 245, 80 245 C 50 245, 36 235, 36 210 Z"
                    fill="url(#glassGradient)"
                    stroke="#2D4A5E"
                    strokeWidth="2.5"
                  />

                  {/* Liquid Fill masked by bottle silhouette */}
                  <g clipPath="url(#bottleBodyClip)">
                    {/* Background liquid container */}
                    <rect x="30" y="50" width="100" height="200" fill="#0A141A" />
                    
                    {/* Dynamic Liquid Level */}
                    {/* Y coordinate: empty = 245, full = 70. Delta = 175 */}
                    <rect
                      x="30"
                      y={245 - (fillPercentage / 100) * 175}
                      width="100"
                      height={(fillPercentage / 100) * 175 + 10}
                      fill="url(#liquidGradient)"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Liquid meniscus surface glow */}
                    <ellipse
                      cx="80"
                      cy={245 - (fillPercentage / 100) * 175}
                      rx="42"
                      ry="6"
                      fill="#81FDE9"
                      fillOpacity="0.7"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Translucent Brand Logo label across bottle */}
                    <g transform="translate(48, 125)">
                      <rect x="0" y="0" width="64" height="48" rx="6" fill="#060C10" fillOpacity="0.85" stroke="#1D3644" strokeWidth="1" />
                      <text x="32" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="800" fontFamily="sans-serif">BE BODYWISE</text>
                      <text x="32" y="28" textAnchor="middle" fill="#00C2A8" fontSize="6" fontWeight="700">ROLL-ON</text>
                      <text x="32" y="38" textAnchor="middle" fill="#88A0B0" fontSize="5">50ml Underarm</text>
                    </g>
                  </g>

                  {/* Glass highlight reflections */}
                  <path d="M 44 80 L 42 205" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />
                  <path d="M 50 85 L 48 180" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" strokeLinecap="round" />

                  {/* Volume measurement markings (50ml, 25ml, 10ml) */}
                  <line x1="112" y1="75" x2="119" y2="75" stroke="#8A9BA8" strokeWidth="1.5" />
                  <text x="123" y="77" fill="#8A9BA8" fontSize="6" fontFamily="monospace">50ml</text>

                  <line x1="114" y1="118" x2="120" y2="118" stroke="#8A9BA8" strokeWidth="1.5" />
                  <text x="124" y="120" fill="#8A9BA8" fontSize="6" fontFamily="monospace">35ml</text>

                  <line x1="114" y1="160" x2="120" y2="160" stroke="#8A9BA8" strokeWidth="1.5" />
                  <text x="124" y="162" fill="#8A9BA8" fontSize="6" fontFamily="monospace">20ml</text>

                  <line x1="112" y1="205" x2="119" y2="205" stroke="#8A9BA8" strokeWidth="1.5" />
                  <text x="123" y="207" fill="#8A9BA8" fontSize="6" fontFamily="monospace">5ml</text>
                </svg>

                {/* Floating Percentage / ml readout */}
                <div className="absolute -bottom-2 bg-[#060B0E]/90 border border-[#00C2A8]/30 px-3.5 py-1.5 rounded-xl shadow-xl text-center">
                  <div className="text-lg font-black text-white font-mono flex items-baseline justify-center gap-1">
                    <span className="text-[#00C2A8]">{currentMl.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 font-sans">/ 50 ml</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">({fillPercentage}% capacity)</span>
                </div>

              </div>

            </div>

            {/* Slider if in calibrate mode */}
            {isCalibrating && (
              <div className="w-full mt-4 p-4 rounded-xl bg-[#091117] border border-[#1A2E3B] animate-fade-in space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Calibrate Bottle Level:</span>
                  <span className="font-mono text-[#00C2A8] font-bold">{currentMl.toFixed(1)} ml</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={currentMl}
                  onChange={handleSliderChange}
                  className="w-full accent-[#00C2A8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 ml (Empty)</span>
                  <span>25 ml (Half)</span>
                  <span>50 ml (Full)</span>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="w-full mt-6 space-y-2">
              <button
                onClick={logApplication}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009682] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#00C2A8]/20 transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Log Today's Application (-{mlPerApplication} ml)</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={undoLastLog}
                  disabled={logs.length === 0}
                  className="py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-slate-600 disabled:opacity-40 disabled:hover:border-[#172733] text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Undo Last Log</span>
                </button>

                <button
                  onClick={setBottleFull}
                  className="py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-[#00C2A8]/40 text-xs text-slate-300 hover:text-[#00C2A8] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00C2A8]" />
                  <span>Start New Bottle</span>
                </button>
              </div>
            </div>

          </div>

          {/* Application Settings (Swipes & Daily Frequency) */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Application Cadence Settings
            </h3>

            {/* Swipes per arm */}
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-slate-300 font-medium">Swipes per underarm:</span>
                <span className="text-slate-400 font-mono text-[11px]">~{mlPerApplication}ml / use</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, label: '1 Swipe', note: 'Light (~0.22ml)' },
                  { id: 2, label: '2 Swipes', note: 'Standard (~0.35ml)' },
                  { id: 3, label: '3+ Swipes', note: 'Heavy (~0.50ml)' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundManager.playClick();
                      setState(prev => ({ ...prev, swipesPerUse: opt.id }));
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      swipesPerUse === opt.id
                        ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white font-bold'
                        : 'bg-[#0A1218] border-[#182B37] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{opt.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency per day */}
            <div className="pt-2">
              <span className="text-xs text-slate-300 font-medium block mb-2">Daily Frequency:</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 1, label: 'Once Daily (AM or PM)', note: 'Recommended standard' },
                  { id: 2, label: 'Twice Daily (AM + PM)', note: 'High sweat / odor reset' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      soundManager.playClick();
                      setState(prev => ({ ...prev, frequencyPerDay: opt.id }));
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      frequencyPerDay === opt.id
                        ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white font-bold'
                        : 'bg-[#0A1218] border-[#182B37] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{opt.note}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Amazon Subscribe & Save Mismatch Solver & Stats */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            <div className="p-4 rounded-2xl bg-[#0C171F] border border-[#1A2E3B] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00C2A8]" /> Days Remaining
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                {daysRemaining} <span className="text-xs font-normal text-slate-400 font-sans">days</span>
              </div>
              <p className="text-[10px] text-slate-500">at {dailyMlBurn.toFixed(2)} ml/day burn</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C171F] border border-[#1A2E3B] space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#06B6D4]" /> Projected Empty
              </span>
              <div className="text-sm sm:text-base font-bold text-white font-mono mt-1">
                {projectedEmptyDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <p className="text-[10px] text-slate-500">~{applicationsRemaining} applications left</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0C171F] border border-[#1A2E3B] space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Stockout Risk
              </span>
              <div className={`text-sm sm:text-base font-bold ${
                isCritical ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {isCritical ? 'High (Empty soon)' : isLow ? 'Warning (<15 days)' : 'Protected'}
              </div>
              <p className="text-[10px] text-slate-500">
                {daysRemaining <= 10 ? 'Immediate reorder needed' : 'Buffer is sufficient'}
              </p>
            </div>

          </div>

          {/* Amazon Subscribe & Save Mismatch Solver (Crucial Problem Solved!) */}
          <div className="glass-panel-teal rounded-3xl p-6 sm:p-7 space-y-5 border border-[#00C2A8]/30 shadow-teal-glow">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C2A8]/20 text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-1">
                  <ExternalLink className="w-3 h-3" /> Amazon Sync Intelligence
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Solving the Amazon Subscribe & Save Mismatch
                </h3>
              </div>

              {/* 1-Click Reorder Button */}
              <button
                onClick={() => {
                  soundManager.playSuccess();
                  onOpenReorder();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-md shadow-[#00C2A8]/20 transition-all shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>1-Click Reorder / Adjust</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Standard Amazon subscriptions force rigid 1-month (30 days) or 2-month (60 days) delivery intervals. Because a 50ml bottle actually lasts <strong>{daysRemaining > 0 ? `~${daysRemaining} days` : '40-65 days'}</strong> for your routine, fixed Amazon cycles create either <em>sudden stockout droughts</em> or <em>wasteful bottle pileups</em>.
            </p>

            {/* Amazon Subscription Cycle Selector */}
            <div className="p-4 rounded-2xl bg-[#071116] border border-[#162B37] space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Your Current Amazon Subscription Delivery Cycle:
              </label>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { days: 30, label: 'Every 30 Days' },
                  { days: 45, label: 'Every 45 Days' },
                  { days: 60, label: 'Every 60 Days' },
                  { days: 90, label: 'Every 90 Days' }
                ].map(cycle => (
                  <button
                    key={cycle.days}
                    onClick={() => {
                      soundManager.playClick();
                      setState(prev => ({ ...prev, amazonCycleDays: cycle.days }));
                    }}
                    className={`py-2 px-2 rounded-xl text-center text-xs transition-all ${
                      amazonCycleDays === cycle.days
                        ? 'bg-[#00C2A8] text-slate-950 font-bold shadow'
                        : 'bg-[#0B161E] border border-[#1A2E3C] text-slate-300 hover:text-white'
                    }`}
                  >
                    {cycle.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Analysis Box */}
            <div className={`p-4 rounded-2xl border ${
              willRunOutBeforeAmazon
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                : daysOfExcessStock > 25
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                {willRunOutBeforeAmazon ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                ) : daysOfExcessStock > 25 ? (
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1 text-xs leading-relaxed">
                  <h4 className="font-bold text-sm">
                    {willRunOutBeforeAmazon
                      ? `⚠️ Stockout Warning: You will run out ${Math.abs(mismatchDays)} days before your next Amazon delivery!`
                      : daysOfExcessStock > 25
                      ? `📦 Overstock Warning: Your next Amazon bottle arrives ${daysOfExcessStock} days too early!`
                      : `✅ Perfect Alignment: Your usage and delivery are well balanced.`}
                  </h4>

                  <p className="opacity-90">
                    {willRunOutBeforeAmazon
                      ? `At your current burn rate, your bottle runs out on ${projectedEmptyDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, but Amazon won't deliver until ${amazonCycleDays} days. Recommendation: Adjust Amazon cycle to every ${recommendedAmazonCycle} days or make a one-off restock.`
                      : daysOfExcessStock > 25
                      ? `You will have ${daysRemaining} days of roll-on remaining when the next shipment drops in ${amazonCycleDays} days. Recommendation: Delay your next Amazon delivery date by 3-4 weeks to prevent bottle hoarding.`
                      : `Your current ${amazonCycleDays}-day cycle closely matches your ${daysRemaining}-day bottle longevity.`}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Application History Log */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-[#00C2A8]" />
                <span>Recent Application Logs</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">
                {logs.length} logged events
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No applications logged yet. Click "Log Today's Application" above!
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-[#0A1218] border border-[#162834] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                      <span className="font-medium text-slate-200">{log.date}</span>
                      <span className="text-[10px] text-slate-500">({log.swipes} swipes)</span>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-rose-400">-{log.amountMl} ml</span>
                      <span className="text-slate-400 font-sans">|</span>
                      <span className="text-slate-300 font-semibold">{log.remainingMl} ml left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

