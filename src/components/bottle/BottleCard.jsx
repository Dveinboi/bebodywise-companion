import { useState } from 'react';
import { Droplet, AlertTriangle, Sliders, Plus, RotateCcw, Sparkles } from 'lucide-react';
import BottleGraphic from './BottleGraphic';

const HEALTH_PILL = {
  critical: { cls: 'bg-rose-500/20 text-rose-300 border border-rose-500/40', label: 'Critical Refill', Icon: AlertTriangle },
  low: { cls: 'bg-amber-500/20 text-amber-300 border border-amber-500/40', label: 'Low Stock Warning', Icon: Droplet },
  healthy: { cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40', label: 'Optimal Supply', Icon: Droplet }
};

function CalibrateSlider({ currentMl, onChange }) {
  return (
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
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-[#00C2A8] cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
        <span>0 ml (Empty)</span>
        <span>25 ml (Half)</span>
        <span>50 ml (Full)</span>
      </div>
    </div>
  );
}

export default function BottleCard({ currentMl, stats, canUndo, onLog, onUndo, onNewBottle, onCalibrate }) {
  const [isCalibrating, setIsCalibrating] = useState(false);
  const pill = HEALTH_PILL[stats.health];

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${pill.cls}`}>
          <pill.Icon className="w-3.5 h-3.5" />
          {pill.label}
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

      <BottleGraphic currentMl={currentMl} fillPercentage={stats.fillPercentage} />

      {isCalibrating && <CalibrateSlider currentMl={currentMl} onChange={onCalibrate} />}

      <div className="w-full mt-6 space-y-2">
        <button
          onClick={onLog}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009682] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#00C2A8]/20 transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Log Today's Application (-{stats.mlPerApplication} ml)</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-slate-600 disabled:opacity-40 disabled:hover:border-[#172733] text-xs text-slate-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Undo Last Log</span>
          </button>
          <button
            onClick={onNewBottle}
            className="py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-[#00C2A8]/40 text-xs text-slate-300 hover:text-[#00C2A8] font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00C2A8]" />
            <span>Start New Bottle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
