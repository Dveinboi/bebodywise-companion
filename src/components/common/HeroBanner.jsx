
export default function HeroBanner({ icon: Icon, badge, title, children }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F1E24] via-[#09151A] to-[#060C10] border border-[#182C37] p-6 sm:p-8">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#00C2A8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2A8]/15 border border-[#00C2A8]/30 text-[#00C2A8] text-xs font-semibold mb-3">
          <Icon className="w-3.5 h-3.5" />
          <span>{badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">{title}</h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
