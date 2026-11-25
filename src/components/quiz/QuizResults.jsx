import { ShieldCheck, UserCheck, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS, cadenceLabel } from '../../lib/dermQuiz';

function answerLabel(questionId, answerId) {
  const q = QUIZ_QUESTIONS.find((x) => x.id === questionId);
  const opt = q && q.options.find((o) => o.id === answerId);
  return opt ? opt.label.toLowerCase() : answerId;
}

export default function QuizResults({ answers, rec, onApply, onRetake }) {
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="p-4 rounded-2xl bg-[#00C2A8]/10 border border-[#00C2A8]/30 space-y-2">
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C2A8]/20 text-[#00C2A8] uppercase tracking-wider">
          Diagnostic Result
        </span>
        <h4 className="text-base font-bold text-white">Your Custom Be Bodywise Protocol</h4>
        <p className="text-xs text-slate-300">
          Based on your {answerLabel('skinType', answers.skinType)} skin profile and {answerLabel('hairRemoval', answers.hairRemoval)} grooming habits:
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-3 rounded-xl bg-[#0C171F] border border-[#1A2E3B]">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Recommended Swipes</span>
          <span className="text-lg font-black text-white">{rec.swipes} swipe(s)</span>
          <span className="text-[10px] text-slate-500 block">per underarm</span>
        </div>
        <div className="p-3 rounded-xl bg-[#0C171F] border border-[#1A2E3B]">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">Application Cadence</span>
          <span className="text-lg font-black text-[#00C2A8]">{cadenceLabel(rec.frequency)}</span>
          <span className="text-[10px] text-slate-500 block">morning or night</span>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Dermatologist Directives:</span>
        {rec.advice.map((item) => (
          <div key={item} className="p-2.5 rounded-xl bg-[#0A1318] border border-[#172733] text-xs text-slate-300 flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00C2A8] shrink-0 mt-0.5" />
            <span>{item}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex gap-2">
        <button
          onClick={onApply}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009682] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#00C2A8]/20 hover:opacity-95 transition-all"
        >
          <UserCheck className="w-4 h-4" />
          <span>Apply Settings to Tracker</span>
        </button>
        <button
          onClick={onRetake}
          className="py-3 px-3 rounded-xl bg-[#0E1B22] border border-[#1A2F3D] text-slate-400 hover:text-white transition-colors"
          title="Retake Diagnostic"
          aria-label="Retake Diagnostic"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
