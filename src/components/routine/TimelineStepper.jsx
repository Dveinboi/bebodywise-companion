import { Sparkles, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { TIMELINE_WEEKS } from '../../data/bodywiseData';

function milestoneClasses(isSelected, isPassed) {
  if (isSelected) return 'bg-[#00C2A8]/15 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/15';
  if (isPassed) return 'bg-[#0B151C] border-[#1E3747] text-slate-300';
  return 'bg-[#080E13] border-[#14232E] text-slate-500 hover:text-slate-300';
}

function dotClasses(isSelected, isPassed) {
  if (isSelected) return 'border-[#00C2A8] bg-[#00C2A8]';
  if (isPassed) return 'border-emerald-400 bg-emerald-400/40';
  return 'border-slate-700';
}

function MilestoneDetail({ week }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0C171F] to-[#0A1319] border border-[#1A2E3B] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#00C2A8]/20 text-[#00C2A8] border border-[#00C2A8]/30 uppercase tracking-wider">
              {week.week}
            </span>
            <span className="text-xs text-slate-400 font-medium">• {week.status}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">{week.title}</h3>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Progress</span>
          <span className="text-lg font-black text-[#00C2A8] font-mono">{week.percentage}%</span>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{week.description}</p>

      <div>
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#00C2A8]" />
          <span>What Happens at the Cellular Level:</span>
        </h4>
        <div className="grid sm:grid-cols-3 gap-2.5">
          {week.clinicalMilestones.map((item, idx) => (
            <div key={item} className="p-3 rounded-xl bg-[#070D12] border border-[#162936] text-xs text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Milestone {idx + 1}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Dermatologist Note for this phase:</strong>
          <p className="mt-0.5 opacity-90 leading-relaxed">{week.patientExpectation}</p>
        </div>
      </div>
    </div>
  );
}

export default function TimelineStepper({ selectedWeekIndex, onSelect }) {
  const currentWeek = TIMELINE_WEEKS[selectedWeekIndex] || TIMELINE_WEEKS[0];

  return (
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

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
        {TIMELINE_WEEKS.map((milestone, idx) => {
          const isSelected = selectedWeekIndex === idx;
          const isPassed = selectedWeekIndex >= idx;
          return (
            <button
              key={milestone.week}
              onClick={() => onSelect(idx)}
              className={`p-3 rounded-2xl border text-left transition-all duration-200 relative ${milestoneClasses(isSelected, isPassed)}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{milestone.week}</span>
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${dotClasses(isSelected, isPassed)}`}>
                  {isSelected && <div className="w-1 h-1 rounded-full bg-slate-900" />}
                </div>
              </div>
              <div className={`text-xs font-bold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                {milestone.badge}
              </div>
              <div className="mt-2 text-[10px] font-mono font-semibold text-[#00C2A8]">{milestone.percentage}% Complete</div>
            </button>
          );
        })}
      </div>

      <MilestoneDetail week={currentWeek} />
    </div>
  );
}
