import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import GroomingChecker from './components/GroomingChecker';
import BottleTracker from './components/BottleTracker';
import RoutineGuide from './components/RoutineGuide';
import ReorderModal from './components/ReorderModal';
import Toast from './components/Toast';
import { PRODUCT_INFO } from './data/bodywiseData';
import { soundManager } from './utils/soundEffects';
import { Sparkles, ShieldCheck, Heart, ExternalLink, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'bebodywise_companion_state_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('grooming'); // 'grooming' | 'bottle' | 'routine'
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toast, setToast] = useState(null);

  // Tab 1 state: Grooming Checker
  const [groomingState, setGroomingState] = useState(() => {
    const d = new Date(Date.now() - 4 * 3600 * 1000); // default 4 hrs ago
    const pad = (n) => String(n).padStart(2, '0');
    const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return {
      methodId: 'waxing',
      sensitivityId: 'sensitive',
      symptoms: ['redness'],
      groomDate: localStr,
      groomTimePreset: 4
    };
  });

  // Tab 2 state: Bottle Tracker
  const [bottleState, setBottleState] = useState({
    currentMl: 34.5, // out of 50
    swipesPerUse: 2, // 2 swipes standard ~0.35ml
    frequencyPerDay: 1, // once daily
    amazonCycleDays: 60, // default amazon subscribe & save cycle
    logs: [
      { id: 1, date: 'Nov 6, 09:30 AM', amountMl: 0.35, remainingMl: 34.5, swipes: 2 },
      { id: 2, date: 'Nov 5, 08:45 AM', amountMl: 0.35, remainingMl: 34.85, swipes: 2 },
      { id: 3, date: 'Nov 4, 09:10 AM', amountMl: 0.35, remainingMl: 35.2, swipes: 2 }
    ]
  });

  // Tab 3 state: Routine Guide
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.groomingState) setGroomingState(parsed.groomingState);
        if (parsed.bottleState) setBottleState(parsed.bottleState);
        if (typeof parsed.selectedWeekIndex === 'number') setSelectedWeekIndex(parsed.selectedWeekIndex);
        if (parsed.activeTab) setActiveTab(parsed.activeTab);
      }
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        groomingState,
        bottleState,
        selectedWeekIndex,
        activeTab
      }));
    } catch (e) {
      // Storage quota or private mode
    }
  }, [groomingState, bottleState, selectedWeekIndex, activeTab]);

  const showToast = (toastData) => {
    setToast(toastData);
  };

  // Preset demo scenarios
  const handleApplyPreset = (presetKey) => {
    soundManager.playClick();
    const pad = (n) => String(n).padStart(2, '0');

    if (presetKey === 'waxed_recent') {
      const d = new Date(Date.now() - 2 * 3600 * 1000); // 2 hours ago
      const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setGroomingState({
        methodId: 'waxing',
        sensitivityId: 'sensitive',
        symptoms: ['redness'],
        groomDate: localStr,
        groomTimePreset: 2
      });
      setActiveTab('grooming');
      showToast({
        type: 'danger',
        title: 'Scenario: Just Waxed 2 hrs ago',
        message: 'High stinging hazard simulated. Notice the countdown meter and warning banner.'
      });
    } else if (presetKey === 'safe_ready') {
      const d = new Date(Date.now() - 48 * 3600 * 1000); // 48 hours ago
      const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setGroomingState({
        methodId: 'shaving',
        sensitivityId: 'normal',
        symptoms: [],
        groomDate: localStr,
        groomTimePreset: 48
      });
      setActiveTab('grooming');
      showToast({
        type: 'success',
        title: 'Scenario: Fully Restored Barrier',
        message: '100% healed stratum corneum. Safe to apply roll-on immediately!'
      });
    } else if (presetKey === 'bottle_low') {
      setBottleState(prev => ({
        ...prev,
        currentMl: 6.8, // <7ml critical
        amazonCycleDays: 60
      }));
      setActiveTab('bottle');
      showToast({
        type: 'warning',
        title: 'Scenario: Bottle Low Alert (14% left)',
        message: 'Depletion warning triggered. Amazon 60-day mismatch highlighted!'
      });
    } else if (presetKey === 'routine_week6') {
      setSelectedWeekIndex(2); // Week 5-6
      setActiveTab('routine');
      showToast({
        type: 'info',
        title: 'Scenario: Week 5-6 Melanin Fading',
        message: 'Navigated to Peak Melanin Dispersion phase in the 8-Week Timeline.'
      });
    } else if (presetKey === 'reset') {
      localStorage.removeItem(STORAGE_KEY);
      const d = new Date(Date.now() - 4 * 3600 * 1000);
      const localStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setGroomingState({
        methodId: 'waxing',
        sensitivityId: 'sensitive',
        symptoms: ['redness'],
        groomDate: localStr,
        groomTimePreset: 4
      });
      setBottleState({
        currentMl: 34.5,
        swipesPerUse: 2,
        frequencyPerDay: 1,
        amazonCycleDays: 60,
        logs: [
          { id: 1, date: 'Nov 6, 09:30 AM', amountMl: 0.35, remainingMl: 34.5, swipes: 2 }
        ]
      });
      setSelectedWeekIndex(0);
      showToast({
        type: 'info',
        title: 'Reset to Defaults',
        message: 'All application data and timers have been reset.'
      });
    }
  };

  // Calculate remaining days for modal
  const mlPerApplication = bottleState.swipesPerUse === 1 ? 0.22 : bottleState.swipesPerUse === 2 ? 0.35 : 0.50;
  const dailyMlBurn = mlPerApplication * bottleState.frequencyPerDay;
  const remainingDays = dailyMlBurn > 0 ? Math.floor(bottleState.currentMl / dailyMlBurn) : 999;

  return (
    <div className="min-h-screen bg-[#060B0E] text-slate-100 flex flex-col font-sans selection:bg-[#00C2A8]/30 selection:text-white">
      
      {/* Top Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApplyPreset={handleApplyPreset}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'grooming' && (
          <GroomingChecker
            state={groomingState}
            setState={setGroomingState}
            onToast={showToast}
          />
        )}

        {activeTab === 'bottle' && (
          <BottleTracker
            state={bottleState}
            setState={setBottleState}
            onOpenReorder={() => setIsReorderOpen(true)}
            onToast={showToast}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineGuide
            selectedWeekIndex={selectedWeekIndex}
            setSelectedWeekIndex={setSelectedWeekIndex}
            onToast={showToast}
          />
        )}
      </main>

      {/* Reorder & Amazon Sync Modal */}
      <ReorderModal
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
        remainingDays={remainingDays}
        remainingMl={bottleState.currentMl}
        onToast={showToast}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Clinical Ingredients Highlight Section */}
      <section className="border-t border-[#14242D] bg-[#080F14] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-[11px] font-bold text-[#00C2A8] uppercase tracking-wider">
                Clinical Precision Formula
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Active Chemical Exfoliants inside the 4% AHA/BHA Roll-On
              </h3>
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
              <div
                key={ing.name}
                className="p-4 rounded-2xl bg-[#0B151C] border border-[#172B38] space-y-1.5"
              >
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00C2A8]" />
                  <span>{ing.name}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {ing.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#111E26] bg-[#05090C] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white tracking-wider">BODYWISE</span>
            <span>•</span>
            <span>AHA BHA Underarm Precision Companion</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Formulated at pH 3.8</span>
            <span>•</span>
            <span>Zero Aluminum Salts</span>
            <span>•</span>
            <span>Dermatologist Approved</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

