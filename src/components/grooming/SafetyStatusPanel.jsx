import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Clock, Sparkles, Bell, BellRing, CalendarPlus } from 'lucide-react';

const PHASE = {
  safe: {
    panel: 'glass-panel-teal border-[#00C2A8]/50 shadow-teal-glow',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    BadgeIcon: ShieldCheck,
    badgeLabel: 'Safe to Apply',
    text: 'text-emerald-400',
    bar: 'bg-gradient-to-r from-[#00C2A8] to-emerald-400',
    heading: 'Skin Barrier Fully Restored!',
    body: 'Your stratum corneum has sealed micro-tears. The roll-on will apply smoothly without burning or stinging.'
  },
  approaching: {
    panel: 'glass-panel-amber border-amber-500/40 shadow-amber-glow',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    BadgeIcon: AlertTriangle,
    badgeLabel: 'Cautious / Patch Test',
    text: 'text-amber-400',
    bar: 'bg-gradient-to-r from-amber-500 to-amber-300',
    heading: 'Barrier Almost Ready (Patch Test First)',
    body: 'Over 75% of your barrier has re-epithelialized. Perform a small 1-inch roll test. If no stinging after 5 mins, proceed.'
  },
  unsafe: {
    panel: 'glass-panel-danger border-rose-500/40 shadow-danger-glow',
    badge: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
    BadgeIcon: ShieldAlert,
    badgeLabel: 'Do Not Apply Yet',
    text: 'text-rose-400',
    bar: 'bg-gradient-to-r from-rose-600 to-rose-400',
    heading: 'High Stinging & PIH Risk',
    body: 'Applying now will cause intense stinging and may trigger melanin flare-ups (darker armpits). Wait for timer to finish.'
  }
};

const pad2 = (n) => String(n).padStart(2, '0');
const timeOf = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function Countdown({ countdown }) {
  const parts = [
    ['Hours', countdown.hours],
    ['Mins', countdown.minutes],
    ['Secs', countdown.seconds]
  ];
  return (
    <div className="pt-2">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">Countdown Until Safe</span>
      <div className="grid grid-cols-3 gap-2 text-center">
        {parts.map(([label, value]) => (
          <div key={label} className="p-2.5 rounded-xl bg-[#0E171D] border border-[#1A2D39]">
            <span className="text-2xl font-black text-white font-mono">{pad2(value)}</span>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReminderButton({ isSafe, scheduled, safeAt, onClick }) {
  let cls = 'bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-slate-950 hover:opacity-95 shadow-[#00C2A8]/25';
  let content = (<><Bell className="w-4 h-4" /><span>Set Safe-Application Reminder Alarm</span></>);
  if (isSafe) {
    cls = 'bg-gradient-to-r from-[#00C2A8] to-[#009480] text-slate-950 hover:opacity-95 shadow-[#00C2A8]/20';
    content = (<><Sparkles className="w-4 h-4" /><span>Celebrate Ready State (Apply Now)</span></>);
  } else if (scheduled) {
    cls = 'bg-slate-800 text-slate-300 border border-slate-700';
    content = (<><BellRing className="w-4 h-4 text-[#00C2A8]" /><span>Reminder Scheduled for {timeOf(safeAt)}</span></>);
  }
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${cls}`}
    >
      {content}
    </button>
  );
}

export default function SafetyStatusPanel({ recovery, reminderScheduled, onReminder, onExportCalendar }) {
  const p = PHASE[recovery.phase];
  const isSafe = recovery.phase === 'safe';
  const { safeAt } = recovery;

  return (
    <div className={`rounded-3xl p-6 sm:p-7 border shadow-2xl transition-all duration-300 relative overflow-hidden ${p.panel}`}>
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 uppercase ${p.badge}`}>
          <p.BadgeIcon className="w-4 h-4" />
          {p.badgeLabel}
        </span>
        <span className="text-xs font-mono text-slate-400">Buffer: {recovery.totalHours}h total</span>
      </div>

      <div className="mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">{p.heading}</h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.body}</p>
      </div>

      <div className="p-5 rounded-2xl bg-[#060B0E]/80 border border-white/5 space-y-4">
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-slate-400 font-medium">Skin Barrier Healing Progress</span>
            <span className={`font-mono font-bold ${p.text}`}>{recovery.percent}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div className={`h-full rounded-full transition-all duration-500 ${p.bar}`} style={{ width: `${recovery.percent}%` }} />
          </div>
        </div>

        {isSafe ? (
          <div className="pt-2 text-center py-3">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5" />
              <span>Countdown Complete • Ready to Roll</span>
            </div>
          </div>
        ) : (
          <Countdown countdown={recovery.countdown} />
        )}

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Exact Safe Window:
          </span>
          <span className="font-semibold text-white">
            {safeAt.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}, {timeOf(safeAt)}
          </span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <ReminderButton isSafe={isSafe} scheduled={reminderScheduled} safeAt={safeAt} onClick={onReminder} />
        {!isSafe && (
          <button
            onClick={onExportCalendar}
            className="w-full py-2 px-3 rounded-lg bg-[#0A1318] border border-[#172733] hover:border-[#00C2A8]/40 text-xs text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#00C2A8]" />
            <span>Add Safe Window to Google / Apple Calendar (.ics)</span>
          </button>
        )}
      </div>
    </div>
  );
}
