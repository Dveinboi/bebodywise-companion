import { Sparkles, Scissors, Zap, Flame, CheckCircle2 } from 'lucide-react';
import { GROOMING_METHODS, SENSITIVITY_LEVELS, POST_GROOM_SYMPTOMS } from '../../data/bodywiseData';

const METHOD_ICONS = {
  waxing: <Sparkles className="w-4 h-4 text-[#00C2A8]" />,
  shaving: <Scissors className="w-4 h-4 text-amber-400" />,
  trimming: <Zap className="w-4 h-4 text-emerald-400" />,
  cream: <Flame className="w-4 h-4 text-rose-400" />
};

const RISK_BADGE = {
  Low: 'bg-emerald-500/20 text-emerald-300',
  High: 'bg-rose-500/20 text-rose-300'
};

const TIME_PRESETS = [
  { label: 'Just Now', hours: 0 },
  { label: '2 hrs ago', hours: 2 },
  { label: '6 hrs ago', hours: 6 },
  { label: '12 hrs ago', hours: 12 },
  { label: 'Yesterday (24h)', hours: 24 },
  { label: '2 Days ago (48h)', hours: 48 }
];

function Section({ title, subtitle, aside, children }) {
  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        {aside}
      </div>
      {children}
    </div>
  );
}

export function MethodSelector({ methodId, baseHours, onSelect }) {
  return (
    <Section
      title="1. Hair Removal Method"
      subtitle="Select how you removed underarm hair"
      aside={
        <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
          Base: {baseHours} hrs
        </span>
      }
    >
      <div className="grid sm:grid-cols-2 gap-3">
        {GROOMING_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`text-left p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
              method.id === methodId
                ? 'bg-[#00C2A8]/15 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/15'
                : 'bg-[#0A1218] border-[#182B37] hover:border-slate-600'
            }`}
          >
            <div className="flex items-start justify-between w-full mb-2">
              <div className="flex items-center gap-2">
                {METHOD_ICONS[method.id]}
                <span className="font-semibold text-xs sm:text-sm text-white">{method.name}</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${RISK_BADGE[method.riskLevel] || 'bg-amber-500/20 text-amber-300'}`}>
                {method.riskLevel} Risk
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">{method.description}</p>
          </button>
        ))}
      </div>
    </Section>
  );
}

export function SensitivitySelector({ sensitivityId, onSelect }) {
  return (
    <Section title="2. Skin Sensitivity Profile" subtitle="Customizes cellular recovery multiplier">
      <div className="grid sm:grid-cols-3 gap-2.5">
        {SENSITIVITY_LEVELS.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className={`p-3 rounded-xl border text-left transition-all ${
              level.id === sensitivityId
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
        ))}
      </div>
    </Section>
  );
}

export function SymptomChecklist({ symptoms, onToggle }) {
  return (
    <Section
      title="3. Physical Skin Symptoms (Optional)"
      subtitle="Tick any symptoms present to append mandatory barrier healing buffers"
    >
      <div className="space-y-2.5">
        {POST_GROOM_SYMPTOMS.map((sym) => {
          const isChecked = symptoms.includes(sym.id);
          return (
            <button
              key={sym.id}
              onClick={() => onToggle(sym.id)}
              aria-pressed={isChecked}
              className={`w-full flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
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
            </button>
          );
        })}
      </div>
    </Section>
  );
}

export function GroomTimePicker({ groomDate, groomTimePreset, onPreset, onCustom }) {
  return (
    <Section title="4. When Did You Groom?" subtitle="Quickly select relative time or set exact timestamp">
      <div className="flex flex-wrap gap-2">
        {TIME_PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onPreset(preset.hours)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              groomTimePreset === preset.hours
                ? 'bg-[#00C2A8] text-slate-950 font-bold shadow'
                : 'bg-[#0A141A] border border-[#182B37] text-slate-300 hover:text-white hover:border-slate-500'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="pt-2">
        <label htmlFor="groom-datetime" className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
          Or Exact Grooming Date & Time
        </label>
        <input
          id="groom-datetime"
          type="datetime-local"
          value={groomDate}
          onChange={(e) => onCustom(e.target.value)}
          className="w-full bg-[#091117] border border-[#1A2F3D] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00C2A8] transition-colors"
        />
      </div>
    </Section>
  );
}
