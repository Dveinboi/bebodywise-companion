import { useState } from 'react';
import { X, ShoppingBag, ExternalLink, Sparkles, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import ModalShell from './common/ModalShell';
import BundleSelector from './reorder/BundleSelector';
import CouponBox from './reorder/CouponBox';

function ReorderHeader({ remainingDays, remainingMl, onClose }) {
  return (
    <div className="bg-gradient-to-r from-[#00C2A8]/20 via-[#0A262E] to-[#091117] p-6 border-b border-[#1A2F3D]/80 relative">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#00C2A8]/20 text-[#00C2A8] border border-[#00C2A8]/40 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Smart Reorder Sync
        </span>
        {remainingDays <= 14 && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Stockout Risk
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">Refill & Subscribe & Save Assistant</h3>
      <p className="text-xs text-slate-300 mt-1">
        Current bottle: <strong className="text-[#00C2A8]">{remainingMl.toFixed(1)} ml left</strong> ({remainingDays} days buffer). Don't break your 8-week pigmentation progress!
      </p>
    </div>
  );
}

export default function ReorderModal({ isOpen, onClose, remainingDays, remainingMl, onToast }) {
  const [selectedBundle, setSelectedBundle] = useState('pack-of-2');

  if (!isOpen) return null;

  return (
    <ModalShell maxWidth="max-w-xl" rounded="rounded-2xl">
      <ReorderHeader
        remainingDays={remainingDays}
        remainingMl={remainingMl}
        onClose={() => {
          soundManager.playClick();
          onClose();
        }}
      />

      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-300">Amazon Subscribe & Save Mismatch Solver</h4>
              <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                Default Amazon subscriptions only allow fixed 1-month or 2-month cycles. Since a 50ml bottle typically lasts {remainingDays > 0 ? `~${Math.round(remainingDays)} more days` : '40-60 days'}, we recommend setting your Amazon delivery to <strong>every 40-45 days</strong> to avoid running dry mid-cycle.
              </p>
            </div>
          </div>
        </div>

        <BundleSelector
          selectedId={selectedBundle}
          onSelect={(id) => {
            soundManager.playClick();
            setSelectedBundle(id);
          }}
        />

        <CouponBox code="BODYWISE15" onToast={onToast} />

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <a
            href="https://bebodywise.com/search?q=underarm+roll+on"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playSuccess()}
            className="p-3.5 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009480] text-slate-950 font-bold text-sm flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#00C2A8]/20 transition-all group"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order on Bodywise</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="https://www.amazon.in/s?k=be+bodywise+underarm+roll+on"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="p-3.5 rounded-xl bg-[#14232E] hover:bg-[#1B2F3D] text-slate-200 border border-[#1A2F3D] font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Amazon Subscriptions</span>
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
          <ShieldCheck className="w-4 h-4 text-[#00C2A8]" />
          <span>100% Authentic Fresh Batch Guarantee • Dermatologically Tested</span>
        </div>
      </div>
    </ModalShell>
  );
}
