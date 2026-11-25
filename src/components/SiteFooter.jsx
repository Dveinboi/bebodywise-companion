import { ExternalLink } from 'lucide-react';
import { PRODUCT_INFO } from '../data/bodywiseData';

function IngredientsSection() {
  return (
    <section className="border-t border-[#14242D] bg-[#080F14] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-[11px] font-bold text-[#00C2A8] uppercase tracking-wider">Clinical Precision Formula</span>
            <h3 className="text-lg sm:text-xl font-black text-white">Underarm Roll-On Active Care Actives</h3>
          </div>
          <a
            href="https://bebodywise.com/search?q=underarm+roll+on"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#00C2A8] hover:text-[#00E5C9] flex items-center gap-1"
          >
            <span>Explore Ingredients Dossier</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCT_INFO.activeIngredients.map((ing) => (
            <div key={ing.name} className="p-4 rounded-2xl bg-[#0B151C] border border-[#172B38] space-y-1.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                <span>{ing.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{ing.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SiteFooter() {
  return (
    <>
      <IngredientsSection />
      <footer className="border-t border-[#111E26] bg-[#05090C] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Be Bodywise"
              className="h-5 w-auto object-contain brightness-0 invert opacity-90"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="font-extrabold text-white tracking-wide text-sm">Be Bodywise</span>
            <span>•</span>
            <span>Underarm Precision Roll-On Companion</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Optimal pH Balance</span>
            <span>•</span>
            <span>Zero Aluminum Salts</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>
        </div>
      </footer>
    </>
  );
}
