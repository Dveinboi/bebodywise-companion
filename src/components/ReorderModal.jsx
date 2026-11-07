import React, { useState } from 'react';
import { X, ShoppingBag, ExternalLink, Copy, Check, Sparkles, Clock, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function ReorderModal({ isOpen, onClose, remainingDays, remainingMl, onToast }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState('pack-of-2');

  if (!isOpen) return null;

  const copyCoupon = (code) => {
    soundManager.playClick();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    onToast({
      type: 'success',
      title: 'Coupon Copied!',
      message: `Code "${code}" copied to clipboard for 15% OFF.`
    });
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const bundles = [
    {
      id: 'single',
      name: 'Single 50ml Roll-On',
      tag: 'Standard Restock',
      price: '₹249',
      originalPrice: '₹299',
      discount: '17% OFF',
      duration: '~70-140 days',
      bestseller: false
    },
    {
      id: 'pack-of-2',
      name: 'Duo Pack (2 x 50ml)',
      tag: 'Best Value Deal',
      price: '₹449',
      originalPrice: '₹598',
      discount: '25% OFF',
      duration: '~140-280 days',
      bestseller: true
    },
    {
      id: 'bundle-lotion',
      name: 'Underarm Roll-On + Hydrating Lotion',
      tag: 'Dry Weather Care Kit',
      price: '₹699',
      originalPrice: '₹899',
      discount: '22% OFF',
      duration: 'Complete Routine',
      bestseller: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#091117] border border-[#1A2F3D] rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header banner */}
        <div className="bg-gradient-to-r from-[#00C2A8]/20 via-[#0A262E] to-[#091117] p-6 border-b border-[#1A2F3D]/80 relative">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
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

          <h3 className="text-xl font-bold text-white tracking-tight">
            Refill & Subscribe & Save Assistant
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Current bottle: <strong className="text-[#00C2A8]">{remainingMl.toFixed(1)} ml left</strong> ({remainingDays} days buffer). Don't break your 8-week pigmentation progress!
          </p>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Amazon Sync Resolver Box */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-300">
                  Amazon Subscribe & Save Mismatch Solver
                </h4>
                <p className="text-xs text-amber-200/90 mt-1 leading-relaxed">
                  Default Amazon subscriptions only allow fixed 1-month or 2-month cycles. Since a 50ml bottle typically lasts {remainingDays > 0 ? `~${Math.round(remainingDays)} more days` : '40-60 days'}, we recommend setting your Amazon delivery to <strong>every 40-45 days</strong> to avoid running dry mid-cycle.
                </p>
              </div>
            </div>
          </div>

          {/* Bundle selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
              Select Restock Option
            </label>
            <div className="grid gap-3">
              {bundles.map((bundle) => {
                const isSelected = selectedBundle === bundle.id;
                return (
                  <div
                    key={bundle.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedBundle(bundle.id);
                    }}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
                      isSelected
                        ? 'bg-[#00C2A8]/10 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/10'
                        : 'bg-[#0F1A22] border-[#1A2F3D] hover:border-slate-600'
                    }`}
                  >
                    {bundle.bestseller && (
                      <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-[#060B0E] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
                        Recommended Value
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#00C2A8] bg-[#00C2A8]' : 'border-slate-500'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-white flex items-center gap-2">
                            {bundle.name}
                            <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {bundle.tag}
                            </span>
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">Est. Lifespan: {bundle.duration}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-base font-bold text-white">{bundle.price}</span>
                          <span className="text-xs text-slate-500 line-through">{bundle.originalPrice}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-emerald-400">
                          {bundle.discount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coupon Code Section */}
          <div className="p-4 rounded-xl bg-[#0F1A22] border border-[#1A2F3D] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Special Official Store Code</span>
              <p className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
                <span className="text-[#00C2A8]">BODYWISE15</span>
                <span className="text-xs font-normal text-slate-400 font-sans">• Extra 15% OFF</span>
              </p>
            </div>
            <button
              onClick={() => copyCoupon('BODYWISE15')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00C2A8]/15 text-[#00C2A8] border border-[#00C2A8]/30 hover:bg-[#00C2A8]/25 transition-all flex items-center gap-1.5"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Action CTAs */}
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

          {/* Clinical Assurance Note */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-[#00C2A8]" />
            <span>100% Authentic Fresh Batch Guarantee • Dermatologically Tested</span>
          </div>

        </div>
      </div>
    </div>
  );
}

