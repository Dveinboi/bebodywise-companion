
const BOTTLE_PATH = 'M 40 70 C 40 60, 50 55, 60 55 L 100 55 C 110 55, 120 60, 120 70 L 124 210 C 124 235, 110 245, 80 245 C 50 245, 36 235, 36 210 Z';
const VOLUME_MARKS = [
  { y: 75, label: '50ml', x1: 112, x2: 119, tx: 123 },
  { y: 118, label: '35ml', x1: 114, x2: 120, tx: 124 },
  { y: 160, label: '20ml', x1: 114, x2: 120, tx: 124 },
  { y: 205, label: '5ml', x1: 112, x2: 119, tx: 123 }
];

/** SVG roll-on bottle with a liquid level driven by `fillPercentage` (0-100). */
export default function BottleGraphic({ currentMl, fillPercentage }) {
  // Y coordinate: empty = 245, full = 70.
  const liquidHeight = (fillPercentage / 100) * 175;
  const liquidTop = 245 - liquidHeight;

  return (
    <div className="relative py-4 flex flex-col items-center">
      <div className="w-48 h-80 relative flex items-center justify-center">
        <svg viewBox="0 0 160 260" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E323F" stopOpacity="0.8" />
              <stop offset="20%" stopColor="#2E4A5C" stopOpacity="0.4" />
              <stop offset="80%" stopColor="#2E4A5C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#1E323F" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4EECD5" />
              <stop offset="50%" stopColor="#00C2A8" />
              <stop offset="100%" stopColor="#007F6E" />
            </linearGradient>
            <clipPath id="bottleBodyClip">
              <path d={BOTTLE_PATH} />
            </clipPath>
          </defs>

          {/* Roller ball cap */}
          <ellipse cx="80" cy="30" rx="28" ry="18" fill="#14232C" stroke="#253D4D" strokeWidth="2" />
          <ellipse cx="80" cy="27" rx="20" ry="10" fill="#00C2A8" fillOpacity="0.25" />
          <ellipse cx="76" cy="24" rx="10" ry="4" fill="#FFFFFF" fillOpacity="0.3" />
          <rect x="52" y="42" width="56" height="15" rx="3" fill="#1A2D3A" stroke="#2D4A5E" strokeWidth="1.5" />

          <path d={BOTTLE_PATH} fill="url(#glassGradient)" stroke="#2D4A5E" strokeWidth="2.5" />

          <g clipPath="url(#bottleBodyClip)">
            <rect x="30" y="50" width="100" height="200" fill="#0A141A" />
            <rect
              x="30"
              y={liquidTop}
              width="100"
              height={liquidHeight + 10}
              fill="url(#liquidGradient)"
              className="transition-all duration-700 ease-out"
            />
            <ellipse cx="80" cy={liquidTop} rx="42" ry="6" fill="#81FDE9" fillOpacity="0.7" className="transition-all duration-700 ease-out" />
            <g transform="translate(48, 125)">
              <rect x="0" y="0" width="64" height="48" rx="6" fill="#060C10" fillOpacity="0.85" stroke="#1D3644" strokeWidth="1" />
              <text x="32" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="800" fontFamily="sans-serif">BE BODYWISE</text>
              <text x="32" y="28" textAnchor="middle" fill="#00C2A8" fontSize="6" fontWeight="700">ROLL-ON</text>
              <text x="32" y="38" textAnchor="middle" fill="#88A0B0" fontSize="5">50ml Underarm</text>
            </g>
          </g>

          {/* Glass highlights */}
          <path d="M 44 80 L 42 205" stroke="#FFFFFF" strokeWidth="2.5" strokeOpacity="0.25" strokeLinecap="round" />
          <path d="M 50 85 L 48 180" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.15" strokeLinecap="round" />

          {VOLUME_MARKS.map((m) => (
            <g key={m.label}>
              <line x1={m.x1} y1={m.y} x2={m.x2} y2={m.y} stroke="#8A9BA8" strokeWidth="1.5" />
              <text x={m.tx} y={m.y + 2} fill="#8A9BA8" fontSize="6" fontFamily="monospace">{m.label}</text>
            </g>
          ))}
        </svg>

        <div className="absolute -bottom-2 bg-[#060B0E]/90 border border-[#00C2A8]/30 px-3.5 py-1.5 rounded-xl shadow-xl text-center">
          <div className="text-lg font-black text-white font-mono flex items-baseline justify-center gap-1">
            <span className="text-[#00C2A8]">{currentMl.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-sans">/ 50 ml</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">({fillPercentage}% capacity)</span>
        </div>
      </div>
    </div>
  );
}
