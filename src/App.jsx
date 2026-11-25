import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import GroomingChecker from './components/GroomingChecker';
import BottleTracker from './components/BottleTracker';
import RoutineGuide from './components/RoutineGuide';
import ReorderModal from './components/ReorderModal';
import DermQuizModal from './components/DermQuizModal';
import Toast from './components/Toast';
import SiteFooter from './components/SiteFooter';
import { soundManager } from './utils/soundEffects';
import { daysRemaining } from './lib/bottleMath';
import { defaultGroomingState, defaultBottleState } from './lib/defaultState';
import { PRESETS } from './lib/presets';

const STORAGE_KEY = 'bebodywise_companion_state_v1';

function loadSavedState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    console.error('Failed to parse localStorage', e);
    return {};
  }
}

export default function App() {
  const [saved] = useState(loadSavedState);
  const [activeTab, setActiveTab] = useState(saved.activeTab || 'grooming');
  const [groomingState, setGroomingState] = useState(() => saved.groomingState || defaultGroomingState());
  const [bottleState, setBottleState] = useState(() => saved.bottleState || defaultBottleState());
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(
    typeof saved.selectedWeekIndex === 'number' ? saved.selectedWeekIndex : 0
  );
  const [isReorderOpen, setIsReorderOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ groomingState, bottleState, selectedWeekIndex, activeTab }));
    } catch {
      // Storage quota or private mode
    }
  }, [groomingState, bottleState, selectedWeekIndex, activeTab]);

  const showToast = useCallback((toastData) => setToast(toastData), []);
  const closeToast = useCallback(() => setToast(null), []);

  const handleApplyPreset = (presetKey) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    soundManager.playClick();
    const result = preset({ bottleState });
    if (result.groomingState) setGroomingState(result.groomingState);
    if (result.bottleState) setBottleState(result.bottleState);
    if (typeof result.selectedWeekIndex === 'number') setSelectedWeekIndex(result.selectedWeekIndex);
    if (result.activeTab) setActiveTab(result.activeTab);
    showToast(result.toast);
  };

  const handleApplyCadence = (cadence) => {
    setBottleState((prev) => ({ ...prev, swipesPerUse: cadence.swipesPerUse, frequencyPerDay: cadence.frequencyPerDay }));
    setGroomingState((prev) => ({
      ...prev,
      methodId: cadence.methodId || prev.methodId,
      sensitivityId: cadence.sensitivityId || prev.sensitivityId
    }));
  };

  return (
    <div className="min-h-screen bg-[#060B0E] text-slate-100 flex flex-col font-sans selection:bg-[#00C2A8]/30 selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApplyPreset={handleApplyPreset}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onOpenQuiz={() => setIsQuizOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'grooming' && (
          <GroomingChecker state={groomingState} setState={setGroomingState} onToast={showToast} />
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
          <RoutineGuide selectedWeekIndex={selectedWeekIndex} setSelectedWeekIndex={setSelectedWeekIndex} />
        )}
      </main>

      <ReorderModal
        isOpen={isReorderOpen}
        onClose={() => setIsReorderOpen(false)}
        remainingDays={daysRemaining(bottleState.currentMl, bottleState.swipesPerUse, bottleState.frequencyPerDay)}
        remainingMl={bottleState.currentMl}
        onToast={showToast}
      />

      <DermQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onApplyCustomCadence={handleApplyCadence}
        onToast={showToast}
      />

      <Toast toast={toast} onClose={closeToast} />

      <SiteFooter />
    </div>
  );
}
