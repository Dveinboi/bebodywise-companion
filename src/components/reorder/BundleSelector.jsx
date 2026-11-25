const BUNDLES = [
  { id: 'single', name: 'Single 50ml Roll-On', tag: 'Standard Restock', price: '₹249', originalPrice: '₹299', discount: '17% OFF', duration: '~70-140 days', bestseller: false },
  { id: 'pack-of-2', name: 'Duo Pack (2 x 50ml)', tag: 'Best Value Deal', price: '₹449', originalPrice: '₹598', discount: '25% OFF', duration: '~140-280 days', bestseller: true },
  { id: 'bundle-lotion', name: 'Underarm Roll-On + Hydrating Lotion', tag: 'Dry Weather Care Kit', price: '₹699', originalPrice: '₹899', discount: '22% OFF', duration: 'Complete Routine', bestseller: false }
];

function BundleOption({ bundle, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`w-full text-left cursor-pointer p-4 rounded-xl border transition-all duration-200 relative ${
        isSelected ? 'bg-[#00C2A8]/10 border-[#00C2A8] shadow-lg shadow-[#00C2A8]/10' : 'bg-[#0F1A22] border-[#1A2F3D] hover:border-slate-600'
      }`}
    >
      {bundle.bestseller && (
        <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-[#00C2A8] to-[#06B6D4] text-[#060B0E] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow">
          Recommended Value
        </span>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#00C2A8] bg-[#00C2A8]' : 'border-slate-500'}`}>
            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
          </div>
          <div>
            <p className="font-semibold text-sm text-white flex items-center gap-2">
              {bundle.name}
              <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">{bundle.tag}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Est. Lifespan: {bundle.duration}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1.5 justify-end">
            <span className="text-base font-bold text-white">{bundle.price}</span>
            <span className="text-xs text-slate-500 line-through">{bundle.originalPrice}</span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400">{bundle.discount}</span>
        </div>
      </div>
    </button>
  );
}

export default function BundleSelector({ selectedId, onSelect }) {
  return (
    <div>
      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">Select Restock Option</span>
      <div className="grid gap-3">
        {BUNDLES.map((bundle) => (
          <BundleOption key={bundle.id} bundle={bundle} isSelected={selectedId === bundle.id} onSelect={() => onSelect(bundle.id)} />
        ))}
      </div>
    </div>
  );
}
