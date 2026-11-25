import { useState } from 'react';
import { Layers, Sun, Moon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

function checklistItems(isShaveDay) {
  return [
    { id: 'cleanse', title: 'Cleanse with gentle hydrating wash', desc: 'Wash away sweat and daily sebum using a sulphate-free body cleanser. Pat dry.' },
    { id: 'dry', title: 'Ensure 100% bone-dry skin surface', desc: 'Wait 60 seconds after towel drying. Applying roll-on on damp skin can cause excessive absorption and temporary tingling.' },
    {
      id: 'rollon',
      title: isShaveDay ? '⛔ SKIP ROLL-ON TODAY (Apply Soothing Gel Instead)' : 'Apply 2 glides of Be Bodywise Roll-On',
      desc: isShaveDay ? 'Use pure aloe vera or cica balm to heal micro-tears.' : 'Glide evenly across armpit fold. Do not rub in vigorously with fingers.',
      highlight: !isShaveDay
    },
    { id: 'wait', title: 'Wait 3 to 5 minutes undisturbed dry-down', desc: 'Let active deodorizing and brightening ingredients bond with the skin surface before layering clothes.' },
    { id: 'lotion', title: 'Top off with Ceramide or Niacinamide Lotion (Moisture Sandwich)', desc: 'Crucial for dry weather! Hydrates barrier and shields against clothing friction.' }
  ];
}

function itemClasses(isChecked, highlight) {
  if (isChecked) return 'bg-[#00C2A8]/10 border-[#00C2A8]/50 text-white';
  if (highlight) return 'bg-[#0A161E] border-[#1E3748] hover:border-slate-500';
  return 'bg-[#080E13] border-[#14232E] hover:border-slate-600';
}

function withClick(fn) {
  return (...args) => {
    soundManager.playClick();
    fn(...args);
  };
}

export default function RoutineChecklist() {
  const [regimenTime, setRegimenTime] = useState('am');
  const [isShaveDay, setIsShaveDay] = useState(false);
  const [completed, setCompleted] = useState({});

  const toggle = withClick((key) => setCompleted((prev) => ({ ...prev, [key]: !prev[key] })));
  const timeBtn = (active) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${active ? 'bg-[#00C2A8] text-slate-950 font-bold' : 'text-slate-400'}`;

  return (
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

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-[#091117] border border-[#172733]">
            <button onClick={withClick(() => setRegimenTime('am'))} className={timeBtn(regimenTime === 'am')}>
              <Sun className="w-3.5 h-3.5" /> AM Routine
            </button>
            <button onClick={withClick(() => setRegimenTime('pm'))} className={timeBtn(regimenTime === 'pm')}>
              <Moon className="w-3.5 h-3.5" /> PM Routine
            </button>
          </div>
          <button
            onClick={withClick(() => setIsShaveDay(!isShaveDay))}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isShaveDay ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-[#091117] text-slate-400 border-[#172733] hover:text-white'
            }`}
          >
            {isShaveDay ? '✂️ Grooming Day (Caution)' : '✂️ Non-Groom Day'}
          </button>
        </div>
      </div>

      {isShaveDay && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 flex items-start gap-3 text-xs leading-relaxed">
          <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-rose-300 text-sm">Grooming Day Rule: Skip the Roll-on Today!</strong>
            <p className="mt-1 opacity-90">
              Because you waxed or shaved today, the roll-on step is automatically disabled in your checklist below to prevent stinging. Switch to gentle Cica or Aloe Vera gel today and return to the roll-on once the Safe-Grooming timer turns green.
            </p>
          </div>
        </div>
      )}

      <div className="space-y-2.5">
        {checklistItems(isShaveDay).map((item) => {
          const isChecked = !!completed[item.id];
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              aria-pressed={isChecked}
              className={`w-full text-left p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${itemClasses(isChecked, item.highlight)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isChecked ? 'bg-[#00C2A8] border-[#00C2A8] text-slate-950 font-bold' : 'border-slate-600'
                }`}>
                  {isChecked && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </div>
                <div>
                  <h4 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-400' : 'text-white'}`}>{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                {isChecked ? 'Done' : 'Pending'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
