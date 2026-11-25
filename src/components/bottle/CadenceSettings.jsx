import ChoiceButton from '../common/ChoiceButton';

const SWIPE_OPTIONS = [
  { id: 1, label: '1 Swipe', note: 'Light (~0.22ml)' },
  { id: 2, label: '2 Swipes', note: 'Standard (~0.35ml)' },
  { id: 3, label: '3+ Swipes', note: 'Heavy (~0.50ml)' }
];

const FREQUENCY_OPTIONS = [
  { id: 1, label: 'Once Daily (AM or PM)', note: 'Recommended standard' },
  { id: 2, label: 'Twice Daily (AM + PM)', note: 'High sweat / odor reset' }
];

function OptionGrid({ options, value, onChange, cols }) {
  return (
    <div className={`grid ${cols} gap-2`}>
      {options.map((opt) => (
        <ChoiceButton key={opt.id} selected={value === opt.id} onClick={() => onChange(opt.id)} className="text-center">
          <div className="text-xs">{opt.label}</div>
          <div className="text-[10px] text-slate-500 font-normal">{opt.note}</div>
        </ChoiceButton>
      ))}
    </div>
  );
}

export default function CadenceSettings({ swipesPerUse, frequencyPerDay, mlPerApplication, onChange }) {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-4">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Application Cadence Settings</h3>
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-300 font-medium">Swipes per underarm:</span>
          <span className="text-slate-400 font-mono text-[11px]">~{mlPerApplication}ml / use</span>
        </div>
        <OptionGrid options={SWIPE_OPTIONS} value={swipesPerUse} onChange={(id) => onChange({ swipesPerUse: id })} cols="grid-cols-3" />
      </div>
      <div className="pt-2">
        <span className="text-xs text-slate-300 font-medium block mb-2">Daily Frequency:</span>
        <OptionGrid options={FREQUENCY_OPTIONS} value={frequencyPerDay} onChange={(id) => onChange({ frequencyPerDay: id })} cols="grid-cols-2" />
      </div>
    </div>
  );
}
