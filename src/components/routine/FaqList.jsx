import { useState } from 'react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { FAQS } from '../../data/bodywiseData';
import { soundManager } from '../../utils/soundEffects';

export default function FaqList() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (idx) => {
    soundManager.playClick();
    setExpanded(expanded === idx ? null : idx);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4">
      <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-[#00C2A8]" />
        <span>Clinical FAQs & Myth Busters</span>
      </h2>
      <p className="text-xs text-slate-400">
        Everything you need to know about active chemical exfoliants vs traditional deodorants
      </p>

      <div className="space-y-3 pt-2">
        {FAQS.map((faq, idx) => {
          const isExpanded = expanded === idx;
          return (
            <div key={faq.q} className="rounded-2xl border border-[#182C38] bg-[#0A1319] overflow-hidden transition-all">
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isExpanded}
                className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-[#00C2A8] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isExpanded ? 'rotate-90 text-[#00C2A8]' : 'text-slate-400'}`} />
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#060D12] animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
