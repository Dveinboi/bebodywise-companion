import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { soundManager } from '../../utils/soundEffects';

export default function CouponBox({ code, onToast }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    soundManager.playClick();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onToast({ type: 'success', title: 'Coupon Copied!', message: `Code "${code}" copied to clipboard for 15% OFF.` });
    } catch {
      onToast({ type: 'warning', title: 'Copy Failed', message: `Please copy the code "${code}" manually.` });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#0F1A22] border border-[#1A2F3D] flex items-center justify-between">
      <div>
        <span className="text-[11px] text-slate-400 uppercase font-semibold">Special Official Store Code</span>
        <p className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
          <span className="text-[#00C2A8]">{code}</span>
          <span className="text-xs font-normal text-slate-400 font-sans">• Extra 15% OFF</span>
        </p>
      </div>
      <button
        onClick={copy}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00C2A8]/15 text-[#00C2A8] border border-[#00C2A8]/30 hover:bg-[#00C2A8]/25 transition-all flex items-center gap-1.5"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied!' : 'Copy Code'}
      </button>
    </div>
  );
}
