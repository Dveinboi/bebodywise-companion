import React, { useState } from 'react';
import { 
  Calendar, Sparkles, Droplets, Sun, Moon, ShieldCheck, 
  CheckCircle2, ChevronRight, HelpCircle, ArrowRight, Eye,
  ThermometerSnowflake, Wind, Info, Layers
} from 'lucide-react';
import { TIMELINE_WEEKS, DRY_WEATHER_STEPS, FAQS, PRODUCT_INFO } from '../data/bodywiseData';
import { soundManager } from '../utils/soundEffects';

export default function RoutineGuide({ selectedWeekIndex, setSelectedWeekIndex, onToast }) {
  const [activeRegimenTime, setActiveRegimenTime] = useState('am'); // 'am' or 'pm'
  const [activeWeatherMode, setActiveWeatherMode] = useState('dry'); // 'dry' or 'humid'
  const [isShaveDay, setIsShaveDay] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // for before-after comparison
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Regimen checklist state
  const [completedSteps, setCompletedSteps] = useState({
    cleanse: false,
    dry: false,
    rollon: false,
    wait: false,
    lotion: false
  });

  const currentWeek = TIMELINE_WEEKS[selectedWeekIndex] || TIMELINE_WEEKS[0];

  const handleWeekSelect = (idx) => {
    soundManager.playClick();
    setSelectedWeekIndex(idx);
  };

  const toggleChecklist = (key) => {
    soundManager.playClick();
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleFaq = (index) => {
    soundManager.playClick();
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E24] via-[#09151A] to-[#060C10] border border-[#182C37] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Clinical 8–12 Week Dermatological Roadmap</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Pigmentation Timeline & Care Guide
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Real skin cellular turnover takes 28 to 45 days. Set realistic expectations for AHA/BHA exfoliation, master the winter "Moisture Sandwich" technique, and prevent irritation flare-ups.
          </p>
        </div>
      </div>

      {/* SECTION 1: Interactive 8-Week Pigmentation Timeline Stepper */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00C2A8]" />
              <span>The 8–12 Week Clinical Transformation</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any stage below to inspect physiological changes, milestones, and what to expect
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Target Milestone:</span>
            <span className="text-xs font-bold text-[#00C2A8] bg-[#00C2A8]/10 border border-[#00C2A8]/30 px-2.5 py-1 rounded-full">
              Week {selectedWeekIndex * 2 + 1}–{selectedWeekIndex * 2 + 2}
            </span>
          </div>
        </div>

        {/* Milestone Steps Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
          {TIMELINE_WEEKS.map((milestone, idx) => {
            const isSelected = selectedWeekIndex === idx;
            const isPassed = selectedWeekIndex >= idx;
            return (
              <button
                key={milestone.week}
                onClick={() => handleWeekSelect(idx)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-[#00C2A8]/15 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/15'
                    : isPassed
                    ? 'bg-[#0B151C] border-[#1E3747] text-slate-300'
                    : 'bg-[#080E13] border-[#14232E] text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {milestone.week}
                  </span>
                  <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#00C2A8] bg-[#00C2A8]' : isPassed ? 'border-emerald-400 bg-emerald-400/40' : 'border-slate-700'
                  }`}>
                    {isSelected && <div className="w-1 h-1 rounded-full bg-slate-900" />}
                  </div>
                </div>

                <div className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {milestone.badge}
                </div>

                <div className="mt-2 text-[10px] font-mono font-semibold text-[#00C2A8]">
                  {milestone.percentage}% Complete
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Detail Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C171F] to-[#0A1319] border border-[#1A2E3B] space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#00C2A8]/20 text-[#00C2A8] border border-[#00C2A8]/30 uppercase tracking-wider">
                  {currentWeek.week}
                </span>
                <span className="text-xs text-slate-400 font-medium">• {currentWeek.status}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {currentWeek.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Progress</span>
                <span className="text-lg font-black text-[#00C2A8] font-mono">{currentWeek.percentage}%</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentWeek.description}
          </p>

          {/* Clinical milestones list */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00C2A8]" />
              <span>What Happens at the Cellular Level:</span>
            </h4>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {currentWeek.clinicalMilestones.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#070D12] border border-[#162936] text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Milestone {idx + 1}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Expectation Callout */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Dermatologist Note for this phase:</strong>
              <p className="mt-0.5 opacity-90 leading-relaxed">{currentWeek.patientExpectation}</p>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 2: Before & After Visual Progression Simulator */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C2A8]/15 text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-1">
            <Eye className="w-3.5 h-3.5" /> Visual Simulation
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Underarm Tone & Texture Evolution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Drag the comparison slider below to simulate the clinical difference between Day 1 vs Week 8
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="relative rounded-2xl overflow-hidden border border-[#1A2E3B] bg-[#0A1319] select-none h-64 sm:h-72">
          
          {/* Day 1 (Darker, uneven texture, shaving shadow) */}
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#1C1613] via-[#241A14] to-[#120F0E]">
            <div className="text-center max-w-sm space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
                Day 1 • Baseline Skin
              </span>
              <h4 className="text-lg font-bold text-white">Friction Hyperpigmentation & Strawberry Skin</h4>
              <ul className="text-xs text-slate-300 space-y-1 text-left list-disc list-inside opacity-90">
                <li>Dark friction shadow along armpit crease</li>
                <li>Rough keratosis bumps & trapped hair follicles</li>
                <li>pH ~6.2 favoring odor-producing bacteria</li>
              </ul>
            </div>
          </div>

          {/* Week 8 (Bright, silky smooth, even tone) - Clipped by slider */}
          <div
            className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#062422] via-[#0A332E] to-[#041A17] transition-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="text-center max-w-sm space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                Week 8 • Clinical Result
              </span>
              <h4 className="text-lg font-bold text-white">Even-Toned, Smooth & Odor-Free</h4>
              <ul className="text-xs text-slate-200 space-y-1 text-left list-disc list-inside opacity-95">
                <li>Melanin clusters exfoliated via Lactic + Mandelic acids</li>
                <li>Pores clear of trapped keratin via Salicylic Acid</li>
                <li>Acidic 4.0 pH barrier locks out body odor 24/7</li>
              </ul>
            </div>
          </div>

          {/* Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.7)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
              ↔
            </div>
          </div>

          {/* Slider input control */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
          />

          {/* Labels on sides */}
          <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
            ← Day 1 (Before)
          </div>
          <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
            Week 8 (After) →
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Tip: Move the slider left and right to inspect the dermatological contrast between initial vs exfoliated skin.
        </p>
      </div>

      {/* SECTION 3: Dry-Weather & Winter Care Sandwich Routine */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
              <ThermometerSnowflake className="w-3.5 h-3.5" /> Winter Barrier Defense
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Dry-Weather "Moisture Sandwich" Protocol
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              In cold or low-humidity air, active acids increase trans-epidermal water loss. Follow this 4-step sandwich to keep skin hydrated without deactivating acids.
            </p>
          </div>

          {/* Weather Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#091117] border border-[#172733] shrink-0">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveWeatherMode('dry');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeWeatherMode === 'dry'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" /> Dry / Winter
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveWeatherMode('humid');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeWeatherMode === 'humid'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Humid / Summer
            </button>
          </div>
        </div>

        {/* 4 Steps Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DRY_WEATHER_STEPS.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl bg-[#0A1319] border border-[#182C38] flex flex-col justify-between space-y-3 relative group hover:border-[#00C2A8]/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#00C2A8]/20 text-[#00C2A8] font-bold text-xs flex items-center justify-center border border-[#00C2A8]/40">
                    0{step.step}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {step.time}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-[#00C2A8] transition-colors leading-snug">
                  {step.title}
                </h4>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-[#00C2A8] font-medium flex items-center gap-1">
                <span>Rule #{step.step}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* SECTION 4: Interactive Daily Regimen Builder & Checklist */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00C2A8]" />
              <span>Interactive Routine Checklist</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize your regimen for AM vs PM, and whether today is a hair removal grooming day
            </p>
          </div>

          {/* Time & Shave Toggles */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-[#091117] border border-[#172733]">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveRegimenTime('am');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeRegimenTime === 'am' ? 'bg-[#00C2A8] text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> AM Routine
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveRegimenTime('pm');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeRegimenTime === 'pm' ? 'bg-[#00C2A8] text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> PM Routine
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsShaveDay(!isShaveDay);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isShaveDay
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-[#091117] text-slate-400 border-[#172733] hover:text-white'
              }`}
            >
              {isShaveDay ? '✂️ Grooming Day (Caution)' : '✂️ Non-Groom Day'}
            </button>
          </div>
        </div>

        {/* Shave Day Alert banner if active */}
        {isShaveDay && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start gap-3 text-xs leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-rose-300 text-sm">Grooming Day Rule: Skip the AHA/BHA Roll-on!</strong>
              <p className="mt-1 opacity-90">
                Because you waxed or shaved today, the roll-on step is automatically disabled in your checklist below to prevent acid stinging. Switch to gentle Cica or Aloe Vera gel today and return to the roll-on once the Safe-Grooming timer turns green.
              </p>
            </div>
          </div>
        )}

        {/* Checklist Steps */}
        <div className="space-y-2.5">
          {[
            {
              id: 'cleanse',
              title: 'Cleanse with gentle hydrating wash',
              desc: 'Wash away sweat and daily sebum using a sulphate-free body cleanser. Pat dry.',
              disabled: false
            },
            {
              id: 'dry',
              title: 'Ensure 100% bone-dry skin surface',
              desc: 'Wait 60 seconds after towel drying. Water on skin destabilizes AHA pH and causes acid spikes.',
              disabled: false
            },
            {
              id: 'rollon',
              title: isShaveDay ? '⛔ SKIP ROLL-ON TODAY (Apply Soothing Gel Instead)' : 'Apply 2 glides of Bodywise 4% AHA/BHA Roll-On',
              desc: isShaveDay ? 'Use pure aloe vera or cica balm to heal micro-tears.' : 'Glide evenly across armpit fold. Do not rub in vigorously with fingers.',
              disabled: false,
              highlight: !isShaveDay
            },
            {
              id: 'wait',
              title: 'Wait 3 to 5 minutes undisturbed dry-down',
              desc: 'Let active Lactic, Mandelic, and Salicylic acids bond with the stratum corneum before layering clothes.',
              disabled: isShaveDay
            },
            {
              id: 'lotion',
              title: 'Top off with Ceramide or Niacinamide Lotion (Moisture Sandwich)',
              desc: 'Crucial for dry weather! Hydrates barrier and shields against clothing friction.',
              disabled: false
            }
          ].map((item) => {
            const isChecked = completedSteps[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isChecked
                    ? 'bg-[#00C2A8]/10 border-[#00C2A8]/50 text-white'
                    : item.highlight
                    ? 'bg-[#0A161E] border-[#1E3748] hover:border-slate-500'
                    : 'bg-[#080E13] border-[#14232E] hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked ? 'bg-[#00C2A8] border-[#00C2A8] text-slate-950 font-bold' : 'border-slate-600'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div>
                    <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                  {isChecked ? 'Done' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* SECTION 5: Dermatological FAQs & Myth Busters */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#00C2A8]" />
          <span>Clinical FAQs & Myth Busters</span>
        </h2>
        <p className="text-xs text-slate-400">
          Everything you need to know about active chemical exfoliants vs traditional deodorants
        </p>

        <div className="space-y-3 pt-2">
          {FAQS.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#182C38] bg-[#0A1319] overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-[#00C2A8] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90 text-[#00C2A8]' : 'text-slate-400'}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#060D12] animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
