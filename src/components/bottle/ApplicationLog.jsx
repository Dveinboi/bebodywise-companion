import { History } from 'lucide-react';

export default function ApplicationLog({ logs }) {
  return (
    <div className="glass-panel rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-[#00C2A8]" />
          <span>Recent Application Logs</span>
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">{logs.length} logged events</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-6 text-slate-500 text-xs">
          No applications logged yet. Click "Log Today's Application" above!
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div key={log.id} className="p-2.5 rounded-xl bg-[#0A1218] border border-[#162834] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                <span className="font-medium text-slate-200">{log.date}</span>
                <span className="text-[10px] text-slate-500">({log.swipes} swipes)</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-rose-400">-{log.amountMl} ml</span>
                <span className="text-slate-400 font-sans">|</span>
                <span className="text-slate-300 font-semibold">{log.remainingMl} ml left</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
