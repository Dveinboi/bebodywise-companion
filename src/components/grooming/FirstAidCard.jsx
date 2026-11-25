import { useState } from 'react';
import { HeartPulse, Info } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function FirstAidCard({ totalHours }) {
  const [showScience, setShowScience] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <HeartPulse className="w-4 h-4 text-emerald-400" />
        <span>What to apply right now instead</span>
      </h4>

      <div className="space-y-2 text-xs text-slate-300">
        <div className="p-2.5 rounded-xl bg-[#091117] border border-[#172733] flex items-start gap-2.5">
          <span className="text-emerald-400 font-bold shrink-0">DO:</span>
          <span>Apply chilled 99% pure Aloe Vera gel or 5% Panthenol / Cica balm to cool thermal inflammation.</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#091117] border border-[#172733] flex items-start gap-2.5">
          <span className="text-rose-400 font-bold shrink-0">DON'T:</span>
          <span>Never spray aerosol alcohol deos or apply roll-ons directly onto freshly waxed or micro-abraded skin.</span>
        </div>
      </div>

      <button
        onClick={() => {
          soundManager.playClick();
          setShowScience(!showScience);
        }}
        className="w-full text-center text-[11px] text-[#00C2A8] hover:text-[#00E5C9] font-medium flex items-center justify-center gap-1 pt-1"
      >
        <Info className="w-3.5 h-3.5" />
        <span>{showScience ? 'Hide Skin Barrier Science' : 'Why Does It Sting? (Dermatology Explainer)'}</span>
      </button>

      {showScience && (
        <div className="p-3 rounded-xl bg-[#060D12] border border-[#00C2A8]/20 text-[11px] text-slate-300 leading-relaxed space-y-2 animate-fade-in">
          <p>
            <strong>The Skin Barrier:</strong> Normal underarm skin has a natural protective lipid mantle. The Be Bodywise Roll-on is formulated to maintain a clean, balanced skin microbiome for long-lasting odor protection and brightening.
          </p>
          <p>
            When you wax or shave, hair removal temporarily strips microscopic layers of protective dead skin cells (corneocytes). Applying roll-on onto bare sub-epidermal layers triggers sensitive pain receptors, causing acute stinging. Waiting {totalHours} hours allows the stratum corneum to fully rebuild its protective lipid envelope.
          </p>
        </div>
      )}
    </div>
  );
}
