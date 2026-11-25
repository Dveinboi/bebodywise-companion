import { Clock, Calendar, Sparkles } from 'lucide-react';

const RISK = {
  critical: { cls: 'text-rose-400', label: 'High (Empty soon)' },
  low: { cls: 'text-amber-400', label: 'Warning (<15 days)' },
  healthy: { cls: 'text-emerald-400', label: 'Protected' }
};

function Tile({ icon: Icon, iconCls, label, className = '', children }) {
  return (
    <div className={`p-4 rounded-2xl bg-[#0C171F] border border-[#1A2E3B] space-y-1 ${className}`}>
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${iconCls}`} /> {label}
      </span>
      {children}
    </div>
  );
}

export default function MetricTiles({ stats }) {
  const risk = RISK[stats.health];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <Tile icon={Clock} iconCls="text-[#00C2A8]" label="Days Remaining">
        <div className="text-2xl sm:text-3xl font-black text-white font-mono">
          {stats.daysRemaining} <span className="text-xs font-normal text-slate-400 font-sans">days</span>
        </div>
        <p className="text-[10px] text-slate-500">at {stats.dailyMlBurn.toFixed(2)} ml/day burn</p>
      </Tile>

      <Tile icon={Calendar} iconCls="text-[#06B6D4]" label="Projected Empty">
        <div className="text-sm sm:text-base font-bold text-white font-mono mt-1">
          {stats.projectedEmptyDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <p className="text-[10px] text-slate-500">~{stats.applicationsRemaining} applications left</p>
      </Tile>

      <Tile icon={Sparkles} iconCls="text-amber-400" label="Stockout Risk" className="col-span-2 sm:col-span-1">
        <div className={`text-sm sm:text-base font-bold ${risk.cls}`}>{risk.label}</div>
        <p className="text-[10px] text-slate-500">
          {stats.daysRemaining <= 10 ? 'Immediate reorder needed' : 'Buffer is sufficient'}
        </p>
      </Tile>
    </div>
  );
}
