
/** Selectable tile used for option grids (swipes, frequency, sensitivity, etc). */
export default function ChoiceButton({ selected, onClick, className = '', children }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl border transition-all ${
        selected
          ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white font-bold'
          : 'bg-[#0A1218] border-[#182B37] text-slate-400 hover:text-slate-200'
      } ${className}`}
    >
      {children}
    </button>
  );
}
