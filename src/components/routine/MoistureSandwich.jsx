import { useState } from 'react';
import { ThermometerSnowflake, Wind, Sun, ChevronRight } from 'lucide-react';
import { DRY_WEATHER_STEPS } from '../../data/bodywiseData';
import { soundManager } from '../../utils/soundEffects';

const MODES = [
  { id: 'dry', label: 'Dry / Winter', Icon: Wind, active: 'bg-sky-500/20 text-sky-300 border border-sky-500/40' },
  { id: 'humid', label: 'Humid / Summer', Icon: Sun, active: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' }
];

export default function MoistureSandwich() {
  const [mode, setMode] = useState('dry');

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ThermometerSnowflake className="w-3.5 h-3.5" /> Winter Barrier Defense
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Dry-Weather "Moisture Sandwich" Protocol</h2>
          <p className="text-xs text-slate-400 mt-1">
            In cold or low-humidity air, active acids increase trans-epidermal water loss. Follow this 4-step sandwich to keep skin hydrated without deactivating acids.
          </p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-[#091117] border border-[#172733] shrink-0">
          {MODES.map(({ id, label, Icon, active }) => (
            <button
              key={id}
              onClick={() => {
                soundManager.playClick();
                setMode(id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                mode === id ? active : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

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
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">{step.time}</span>
              </div>
              <h4 className="font-bold text-sm text-white group-hover:text-[#00C2A8] transition-colors leading-snug">{step.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
            <div className="pt-2 border-t border-slate-800/80 text-[11px] text-[#00C2A8] font-medium flex items-center gap-1">
              <span>Rule #{step.step}</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
