import { ShoppingBag, ExternalLink, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { amazonCycleAnalysis } from '../../lib/bottleMath';

const CYCLES = [30, 45, 60, 90];

const STATUS_STYLE = {
  stockout: { box: 'bg-rose-500/10 border-rose-500/40 text-rose-200', Icon: AlertTriangle, iconCls: 'text-rose-400' },
  overstock: { box: 'bg-amber-500/10 border-amber-500/40 text-amber-200', Icon: Clock, iconCls: 'text-amber-400' },
  aligned: { box: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200', Icon: CheckCircle2, iconCls: 'text-emerald-400' }
};

function analysisCopy(analysis, { daysRemaining, amazonCycleDays, projectedEmptyDate }) {
  if (analysis.status === 'stockout') {
    const emptyOn = projectedEmptyDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return {
      heading: `⚠️ Stockout Warning: You will run out ${analysis.shortfallDays} days before your next Amazon delivery!`,
      body: `At your current burn rate, your bottle runs out on ${emptyOn}, but Amazon won't deliver until ${amazonCycleDays} days. Recommendation: Adjust Amazon cycle to every ${analysis.recommendedCycle} days or make a one-off restock.`
    };
  }
  if (analysis.status === 'overstock') {
    return {
      heading: `📦 Overstock Warning: Your next Amazon bottle arrives ${analysis.excessDays} days too early!`,
      body: `You will have ${daysRemaining} days of roll-on remaining when the next shipment drops in ${amazonCycleDays} days. Recommendation: Delay your next Amazon delivery date by 3-4 weeks to prevent bottle hoarding.`
    };
  }
  return {
    heading: '✅ Perfect Alignment: Your usage and delivery are well balanced.',
    body: `Your current ${amazonCycleDays}-day cycle closely matches your ${daysRemaining}-day bottle longevity.`
  };
}

export default function AmazonSyncPanel({ stats, amazonCycleDays, onCycleChange, onOpenReorder }) {
  const analysis = amazonCycleAnalysis(stats.daysRemaining, amazonCycleDays);
  const style = STATUS_STYLE[analysis.status];
  const copy = analysisCopy(analysis, { ...stats, amazonCycleDays });

  return (
    <div className="glass-panel-teal rounded-3xl p-6 sm:p-7 space-y-5 border border-[#00C2A8]/30 shadow-teal-glow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00C2A8]/20 text-[#00C2A8] text-xs font-bold uppercase tracking-wider mb-1">
            <ExternalLink className="w-3 h-3" /> Amazon Sync Intelligence
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">Solving the Amazon Subscribe & Save Mismatch</h3>
        </div>
        <button
          onClick={onOpenReorder}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 hover:opacity-95 shadow-md shadow-[#00C2A8]/20 transition-all shrink-0"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>1-Click Reorder / Adjust</span>
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">
        Standard Amazon subscriptions force rigid 1-month (30 days) or 2-month (60 days) delivery intervals. Because a 50ml bottle actually lasts <strong>{stats.daysRemaining > 0 ? `~${stats.daysRemaining} days` : '40-65 days'}</strong> for your routine, fixed Amazon cycles create either <em>sudden stockout droughts</em> or <em>wasteful bottle pileups</em>.
      </p>

      <div className="p-4 rounded-2xl bg-[#071116] border border-[#162B37] space-y-3">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          Your Current Amazon Subscription Delivery Cycle:
        </span>
        <div className="grid grid-cols-4 gap-2">
          {CYCLES.map((days) => (
            <button
              key={days}
              onClick={() => onCycleChange(days)}
              className={`py-2 px-2 rounded-xl text-center text-xs transition-all ${
                amazonCycleDays === days
                  ? 'bg-[#00C2A8] text-slate-950 font-bold shadow'
                  : 'bg-[#0B161E] border border-[#1A2E3C] text-slate-300 hover:text-white'
              }`}
            >
              Every {days} Days
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 rounded-2xl border ${style.box}`}>
        <div className="flex items-start gap-3">
          <style.Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.iconCls}`} />
          <div className="space-y-1 text-xs leading-relaxed">
            <h4 className="font-bold text-sm">{copy.heading}</h4>
            <p className="opacity-90">{copy.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
