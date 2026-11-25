import { useState } from 'react';
import { Eye } from 'lucide-react';

function Panel({ badgeCls, badge, heading, items, listCls }) {
  return (
    <div className="text-center max-w-sm space-y-2">
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeCls}`}>{badge}</span>
      <h4 className="text-lg font-bold text-white">{heading}</h4>
      <ul className={`text-xs space-y-1 text-left list-disc list-inside ${listCls}`}>
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(50);

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C2A8]/15 text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-1">
          <Eye className="w-3.5 h-3.5" /> Visual Simulation
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Underarm Tone & Texture Evolution</h2>
        <p className="text-xs text-slate-400 mt-1">
          Drag the comparison slider below to simulate the clinical difference between Day 1 vs Week 8
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-[#1A2E3B] bg-[#0A1319] select-none h-64 sm:h-72">
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#1C1613] via-[#241A14] to-[#120F0E]">
          <Panel
            badgeCls="bg-rose-500/20 text-rose-300 border border-rose-500/40"
            badge="Day 1 • Baseline Skin"
            heading="Friction Hyperpigmentation & Strawberry Skin"
            listCls="text-slate-300 opacity-90"
            items={[
              'Dark friction shadow along armpit crease',
              'Rough keratosis bumps & trapped hair follicles',
              'pH ~6.2 favoring odor-producing bacteria'
            ]}
          />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#062422] via-[#0A332E] to-[#041A17] transition-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Panel
            badgeCls="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            badge="Week 8 • Clinical Result"
            heading="Even-Toned, Smooth & Odor-Free"
            listCls="text-slate-200 opacity-95"
            items={[
              'Melanin clusters gently cleared and tone visibly balanced',
              'Pores cleared of trapped sebum and friction bumps',
              'Optimized pH barrier locks out body odor 24/7'
            ]}
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_15px_rgba(255,255,255,0.7)]"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
            ↔
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Before / after comparison"
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
        />

        <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
          ← Day 1 (Before)
        </div>
        <div className="absolute bottom-3 right-3 pointer-events-none text-[11px] font-bold text-white/80 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
          Week 8 (After) →
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">
        Tip: Move the slider left and right to inspect the dermatological contrast between initial vs exfoliated skin.
      </p>
    </div>
  );
}
