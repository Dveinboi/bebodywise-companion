import React, { useState } from 'react';
import { ShieldCheck, Droplet, Calendar, Volume2, VolumeX, Sparkles, RefreshCw, ChevronDown } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function Navbar({ activeTab, setActiveTab, onApplyPreset, isMuted, setIsMuted, onOpenQuiz }) {
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const tabs = [
    { id: 'grooming', label: 'Safe-Grooming Checker', shortLabel: 'Safety Check', icon: ShieldCheck, badge: 'Anti-Sting' },
    { id: 'bottle', label: 'Usage & Depletion Tracker', shortLabel: 'Bottle Tracker', icon: Droplet, badge: '50ml Sync' },
    { id: 'routine', label: 'Routine & Timeline Guide', shortLabel: '8-Wk Guide', icon: Calendar, badge: 'Pigmentation' }
  ];

  const handleTabChange = (id) => {
    soundManager.playClick();
    setActiveTab(id);
  };

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060B0E]/85 backdrop-blur-md border-b border-[#14242D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Be Bodywise"
                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="border-l border-[#1A2F3D] pl-3 hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  Underarm Care Companion
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C2A8] animate-ping" />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Dermatologically Precise Routine & Safety
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-xl bg-[#0A141A] border border-[#172A36]">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'bg-[#00C2A8] text-slate-950 shadow-md shadow-[#00C2A8]/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-[#00C2A8]'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00C2A8]/15 text-[#00C2A8] font-normal border border-[#00C2A8]/20">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Presets & Utility Controls */}
          <div className="flex items-center gap-2">

            {/* Diagnostic Quiz Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenQuiz();
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#00C2A8]/10 border border-[#00C2A8]/30 hover:bg-[#00C2A8]/20 text-xs font-semibold text-[#00C2A8] transition-all"
              title="Skin Diagnostic & Routine Quiz"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Derm Quiz</span>
            </button>
            
            {/* Quick Demo Presets Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowPresetMenu(!showPresetMenu);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0E1B22] border border-[#1A2F3D] hover:border-[#00C2A8]/50 text-xs text-slate-300 hover:text-white transition-all"
                title="Quick Test Scenarios"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00C2A8]" />
                <span className="hidden sm:inline font-medium">Demo Scenarios</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPresetMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#091117] border border-[#1A2F3D] rounded-xl shadow-2xl p-2 z-50 animate-scale-up">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                    Instant Simulation States
                  </div>

                  <button
                    onClick={() => {
                      onApplyPreset('waxed_recent');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#14232E] text-xs text-rose-300 flex items-center justify-between transition-colors"
                  >
                    <span>⛔ Just Waxed 2 hrs ago (Unsafe)</span>
                  </button>

                  <button
                    onClick={() => {
                      onApplyPreset('safe_ready');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#14232E] text-xs text-emerald-400 flex items-center justify-between transition-colors"
                  >
                    <span>✅ 48 hrs Post-Shave (Safe)</span>
                  </button>

                  <button
                    onClick={() => {
                      onApplyPreset('bottle_low');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#14232E] text-xs text-amber-300 flex items-center justify-between transition-colors"
                  >
                    <span>⚠️ Bottle 14% (Stockout Alert)</span>
                  </button>

                  <button
                    onClick={() => {
                      onApplyPreset('routine_week6');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#14232E] text-xs text-[#00C2A8] flex items-center justify-between transition-colors"
                  >
                    <span>✨ Week 6 Melanin Fading</span>
                  </button>

                  <div className="border-t border-[#1A2F3D] my-1" />

                  <button
                    onClick={() => {
                      onApplyPreset('reset');
                      setShowPresetMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-[11px] text-slate-400 flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-500" />
                    <span>Reset to Defaults</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mute Audio Button */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-[#0E1B22] border border-[#1A2F3D] text-slate-400 hover:text-white transition-colors"
              title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-[#00C2A8]" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Tab Navigation Bar (Sticky bottom or sub-header) */}
      <div className="md:hidden border-t border-[#14242D] bg-[#080E13]/95 px-2 py-1.5 flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[10px] font-semibold transition-all ${
                isActive
                  ? 'text-[#00C2A8] bg-[#00C2A8]/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-[#00C2A8]' : 'text-slate-400'}`} />
              <span className="truncate">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}

