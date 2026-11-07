import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Clock, AlertTriangle, Sparkles, 
  CheckCircle2, Bell, BellRing, Info, Flame, Droplets, HeartPulse,
  Scissors, Zap, ChevronRight, HelpCircle, CalendarPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GROOMING_METHODS, SENSITIVITY_LEVELS, POST_GROOM_SYMPTOMS } from '../data/bodywiseData';
import { soundManager } from '../utils/soundEffects';
import { generateIcsCalendarEvent } from '../utils/icsHelper';

export default function GroomingChecker({ state, setState, onToast }) {
  const {
    methodId,
    sensitivityId,
    symptoms,
    groomDate,
    groomTimePreset
  } = state;

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notificationScheduled, setNotificationScheduled] = useState(false);
  const [showScienceExplainer, setShowScienceExplainer] = useState(false);

  // Live timer tick every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const selectedMethod = GROOMING_METHODS.find(m => m.id === methodId) || GROOMING_METHODS[0];
  const selectedSensitivity = SENSITIVITY_LEVELS.find(s => s.id === sensitivityId) || SENSITIVITY_LEVELS[0];

  // Calculate required recovery hours
  const baseHours = selectedMethod.baseHours;
  const sensitivityMultiplier = selectedSensitivity.multiplier;
  const symptomExtraHours = symptoms.reduce((acc, currId) => {
    const sym = POST_GROOM_SYMPTOMS.find(s => s.id === currId);
    return acc + (sym ? sym.addedHours : 0);
  }, 0);

  const totalRequiredHours = Math.round((baseHours * sensitivityMultiplier) + symptomExtraHours);

  // Time elapsed since groom
  const groomTimestamp = new Date(groomDate).getTime();
  const elapsedMs = Math.max(0, currentTime - groomTimestamp);
  const elapsedHours = elapsedMs / (1000 * 60 * 60);

  const remainingMs = Math.max(0, (totalRequiredHours * 60 * 60 * 1000) - elapsedMs);
  const remainingHoursTotal = remainingMs / (1000 * 60 * 60);

  const recoveryPercent = Math.min(100, Math.max(0, Math.round((elapsedHours / totalRequiredHours) * 100)));

  // Target safe time
  const targetSafeTime = new Date(groomTimestamp + totalRequiredHours * 60 * 60 * 1000);

  // Countdown parts
  const countdownHours = Math.floor(remainingHoursTotal);
  const countdownMinutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const countdownSeconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const isSafe = remainingMs <= 0;
  const isApproaching = !isSafe && recoveryPercent >= 75;

  const handleMethodSelect = (id) => {
    soundManager.playClick();
    setState(prev => ({ ...prev, methodId: id }));
  };

  const handleSensitivitySelect = (id) => {
    soundManager.playClick();
    setState(prev => ({ ...prev, sensitivityId: id }));
  };

  const toggleSymptom = (id) => {
    soundManager.playClick();
    setState(prev => {
      const exists = prev.symptoms.includes(id);
      return {
        ...prev,
        symptoms: exists ? prev.symptoms.filter(s => s !== id) : [...prev.symptoms, id]
      };
    });
  };

  const setPresetTime = (hoursAgo) => {
    soundManager.playClick();
    const d = new Date(Date.now() - hoursAgo * 3600 * 1000);
    // format to YYYY-MM-DDTHH:mm for datetime-local
    const pad = (n) => String(n).padStart(2, '0');
    const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setState(prev => ({
      ...prev,
      groomDate: localStr,
      groomTimePreset: hoursAgo
    }));
  };

  const handleCustomDateTime = (val) => {
    setState(prev => ({
      ...prev,
      groomDate: val,
      groomTimePreset: 'custom'
    }));
  };

  const scheduleReminder = () => {
    soundManager.playSuccess();
    setNotificationScheduled(true);

    if (isSafe) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      onToast({
        type: 'success',
        title: 'Skin Barrier Ready!',
        message: 'Your skin is already in the safe zone. You can apply the roll-on now!'
      });
      return;
    }

    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Web notification simulation
        }
      });
    }

    onToast({
      type: 'info',
      title: 'Smart Reminder Set',
      message: `We'll remind you on ${targetSafeTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at ${targetSafeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`
    });
  };

  const exportToCalendar = () => {
    soundManager.playClick();
    generateIcsCalendarEvent({
      title: 'Be Bodywise Roll-On: Skin Barrier Safe Window',
      description: `Your underarm skin barrier is fully re-epithelialized post-${selectedMethod.name.toLowerCase()}. Safe to apply Be Bodywise roll-on without stinging!`,
      startDate: targetSafeTime,
      durationMinutes: 15
    });
    onToast({
      type: 'success',
      title: 'Calendar File Downloaded',
      message: 'iCalendar (.ics) ready. Open to sync with Google / Apple / Outlook calendar.'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1D26] via-[#0B151C] to-[#070D12] border border-[#1A2E3B] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-xs font-semibold mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Anti-Sting Skin Barrier Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Safe-Grooming Timing Checker
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Be Bodywise Underarm Roll-on contains active deodorizing and tone-evening ingredients. Applying on freshly shaved or waxed skin causes acute stinging and irritation. Check precisely when your stratum corneum is healed.
          </p>
        </div>
      </div>

      {/* Main Checker Grid: Controls on Left, Real-Time Meter on Right */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Interactive Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Method Selection Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>1. Hair Removal Method</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Select how you removed underarm hair</p>
              </div>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Base: {selectedMethod.baseHours} hrs
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {GROOMING_METHODS.map((method) => {
                const isSelected = method.id === methodId;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#00C2A8]/15 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/15'
                        : 'bg-[#0A1218] border-[#182B37] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        {method.id === 'waxing' && <Sparkles className="w-4 h-4 text-[#00C2A8]" />}
                        {method.id === 'shaving' && <Scissors className="w-4 h-4 text-amber-400" />}
                        {method.id === 'trimming' && <Zap className="w-4 h-4 text-emerald-400" />}
                        {method.id === 'cream' && <Flame className="w-4 h-4 text-rose-400" />}
                        <span className="font-semibold text-xs sm:text-sm text-white">{method.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        method.riskLevel === 'Low' ? 'bg-emerald-500/20 text-emerald-300' :
                        method.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-300' :
                        'bg-amber-500/20 text-amber-300'
                      }`}>
                        {method.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">{method.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skin Sensitivity Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Skin Sensitivity Profile</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Customizes cellular recovery multiplier</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-2.5">
              {SENSITIVITY_LEVELS.map((level) => {
                const isSelected = level.id === sensitivityId;
                return (
                  <button
                    key={level.id}
                    onClick={() => handleSensitivitySelect(level.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white shadow-md shadow-[#00C2A8]/10'
                        : 'bg-[#0A1218] border-[#182B37] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">{level.label}</span>
                      <span className="text-[10px] font-mono text-[#00C2A8]">x{level.multiplier}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{level.note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Grooming Complications / Symptoms */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>3. Physical Skin Symptoms (Optional)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Tick any symptoms present to append mandatory barrier healing buffers</p>
            </div>

            <div className="space-y-2.5">
              {POST_GROOM_SYMPTOMS.map((sym) => {
                const isChecked = symptoms.includes(sym.id);
                return (
                  <label
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-rose-500/10 border-rose-500/40 text-white'
                        : 'bg-[#0A1218] border-[#182B37] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-500'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs font-medium">{sym.label}</span>
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded">
                      +{sym.addedHours}h buffer
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* When Did You Groom? */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>4. When Did You Groom?</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Quickly select relative time or set exact timestamp</p>
            </div>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Just Now', hours: 0 },
                { label: '2 hrs ago', hours: 2 },
                { label: '6 hrs ago', hours: 6 },
                { label: '12 hrs ago', hours: 12 },
                { label: 'Yesterday (24h)', hours: 24 },
                { label: '2 Days ago (48h)', hours: 48 }
              ].map(preset => {
                const isActive = groomTimePreset === preset.hours;
                return (
                  <button
                    key={preset.label}
                    onClick={() => setPresetTime(preset.hours)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#00C2A8] text-slate-950 font-bold shadow'
                        : 'bg-[#0A141A] border border-[#182B37] text-slate-300 hover:text-white hover:border-slate-500'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom timestamp picker */}
            <div className="pt-2">
              <label className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
                Or Exact Grooming Date & Time
              </label>
              <input
                type="datetime-local"
                value={groomDate}
                onChange={(e) => handleCustomDateTime(e.target.value)}
                className="w-full bg-[#091117] border border-[#1A2F3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00C2A8] transition-colors"
              />
            </div>
          </div>

        </div>

        {/* Right Col: Real-Time Safety Status & Countdown Meter */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          
          {/* Main Status Panel */}
          <div className={`rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all duration-300 relative overflow-hidden ${
            isSafe
              ? 'glass-panel-teal border-[#00C2A8]/50 shadow-teal-glow'
              : isApproaching
              ? 'glass-panel-amber border-amber-500/40 shadow-amber-glow'
              : 'glass-panel-danger border-rose-500/40 shadow-danger-glow'
          }`}>
            
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 uppercase ${
                isSafe
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isApproaching
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isSafe ? <ShieldCheck className="w-4 h-4" /> : isApproaching ? <AlertTriangle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                {isSafe ? 'Safe to Apply' : isApproaching ? 'Cautious / Patch Test' : 'Do Not Apply Yet'}
              </span>

              <span className="text-xs font-mono text-slate-400">
                Buffer: {totalRequiredHours}h total
              </span>
            </div>

            {/* Status Heading */}
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {isSafe 
                  ? 'Skin Barrier Fully Restored!' 
                  : isApproaching 
                  ? 'Barrier Almost Ready (Patch Test First)' 
                  : 'High Stinging & PIH Risk'}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {isSafe
                  ? 'Your stratum corneum has sealed micro-tears. The roll-on will apply smoothly without burning or stinging.'
                  : isApproaching
                  ? 'Over 75% of your barrier has re-epithelialized. Perform a small 1-inch roll test. If no stinging after 5 mins, proceed.'
                  : `Applying now will cause intense stinging and may trigger melanin flare-ups (darker armpits). Wait for timer to finish.`}
              </p>
            </div>

            {/* Circular Progress & Countdown Clock */}
            <div className="p-5 rounded-2xl bg-[#060B0E]/80 border border-white/5 space-y-4">
              
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-400 font-medium">Skin Barrier Healing Progress</span>
                  <span className={`font-mono font-bold ${
                    isSafe ? 'text-emerald-400' : isApproaching ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {recoveryPercent}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isSafe ? 'bg-gradient-to-r from-[#00C2A8] to-emerald-400' :
                      isApproaching ? 'bg-gradient-to-r from-amber-500 to-amber-300' :
                      'bg-gradient-to-r from-rose-600 to-rose-400'
                    }`}
                    style={{ width: `${recoveryPercent}%` }}
                  />
                </div>
              </div>

              {/* Countdown Numbers */}
              {!isSafe ? (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Countdown Until Safe
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-[#0E171D] border border-[#1A2D39]">
                      <span className="text-2xl font-black text-white font-mono">{String(countdownHours).padStart(2, '0')}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Hours</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0E171D] border border-[#1A2D39]">
                      <span className="text-2xl font-black text-white font-mono">{String(countdownMinutes).padStart(2, '0')}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Mins</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#0E171D] border border-[#1A2D39]">
                      <span className="text-2xl font-black text-white font-mono">{String(countdownSeconds).padStart(2, '0')}</span>
                      <span className="block text-[10px] text-slate-400 uppercase font-semibold">Secs</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-center py-3">
                  <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Countdown Complete • Ready to Roll</span>
                  </div>
                </div>
              )}

              {/* Exact Target Safe Timestamp */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Exact Safe Window:
                </span>
                <span className="font-semibold text-white">
                  {targetSafeTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })},{' '}
                  {targetSafeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Reminder & Notification CTA */}
            <div className="mt-5 space-y-2">
              <button
                onClick={scheduleReminder}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isSafe
                    ? 'bg-gradient-to-r from-[#00C2A8] to-[#009480] text-slate-950 hover:opacity-95 shadow-[#00C2A8]/20'
                    : notificationScheduled
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-slate-950 hover:opacity-95 shadow-[#00C2A8]/25'
                }`}
              >
                {isSafe ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Celebrate Ready State (Apply Now)</span>
                  </>
                ) : notificationScheduled ? (
                  <>
                    <BellRing className="w-4 h-4 text-[#00C2A8]" />
                    <span>Reminder Scheduled for {targetSafeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    <span>Set Safe-Application Reminder Alarm</span>
                  </>
                )}
              </button>

              {!isSafe && (
                <button
                  onClick={exportToCalendar}
                  className="w-full py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-[#00C2A8]/40 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarPlus className="w-3.5 h-3.5 text-[#00C2A8]" />
                  <span>Add Safe Window to Google / Apple Calendar (.ics)</span>
                </button>
              )}
            </div>

          </div>

          {/* First-Aid Alternative Care Card */}
          <div className="glass-panel rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-400" />
              <span>What to apply right now instead</span>
            </h4>
            
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-[#091117] border border-[#172733] flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold shrink-0">DO:</span>
                <span>Apply chilled 99% pure Aloe Vera gel or 5% Panthenol / Cica balm to cool thermal inflammation.</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#091117] border border-[#172733] flex items-start gap-2.5">
                <span className="text-rose-400 font-bold shrink-0">DON'T:</span>
                <span>Never spray aerosol alcohol deos or apply roll-ons directly onto freshly waxed or micro-abraded skin.</span>
              </div>
            </div>

            {/* Science Modal Trigger */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowScienceExplainer(!showScienceExplainer);
              }}
              className="w-full text-center text-[11px] text-[#00C2A8] hover:text-[#00E5C9] font-medium flex items-center justify-center gap-1 pt-1"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showScienceExplainer ? 'Hide Skin Barrier Science' : 'Why Does It Sting? (Dermatology Explainer)'}</span>
            </button>

            {showScienceExplainer && (
              <div className="p-3 rounded-xl bg-[#060D12] border border-[#00C2A8]/20 text-[11px] text-slate-300 leading-relaxed space-y-2 animate-fade-in">
                <p>
                  <strong>The Skin Barrier:</strong> Normal underarm skin has a natural protective lipid mantle. The Be Bodywise Roll-on is formulated to maintain a clean, balanced skin microbiome for long-lasting odor protection and brightening.
                </p>
                <p>
                  When you wax or shave, hair removal temporarily strips microscopic layers of protective dead skin cells (corneocytes). Applying roll-on onto bare sub-epidermal layers triggers sensitive pain receptors, causing acute stinging. Waiting {totalRequiredHours} hours allows the stratum corneum to fully rebuild its protective lipid envelope.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

