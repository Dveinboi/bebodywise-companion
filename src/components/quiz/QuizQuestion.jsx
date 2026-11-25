import { Check } from 'lucide-react';

export default function QuizQuestion({ question, index, total, selectedId, onSelect, onBack }) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Question {index + 1} of {total}</span>
        <span className="font-mono text-[#00C2A8] font-bold">{Math.round((index / total) * 100)}% Complete</span>
      </div>

      <div>
        <h4 className="text-lg font-bold text-white leading-snug">{question.title}</h4>
        <p className="text-xs text-slate-400 mt-1">{question.subtitle}</p>
      </div>

      <div className="space-y-2.5 pt-2">
        {question.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white shadow-md'
                  : 'bg-[#0A1218] border-[#182B37] text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#00C2A8]" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {index > 0 && (
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-white flex items-center gap-1 pt-2">
          ← Previous Question
        </button>
      )}
    </div>
  );
}
