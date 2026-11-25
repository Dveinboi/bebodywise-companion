import { Droplet } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { computeBottleStats, applyLog, undoLog, BOTTLE_VOLUME_ML, CRITICAL_ML } from '../lib/bottleMath';
import HeroBanner from './common/HeroBanner';
import BottleCard from './bottle/BottleCard';
import CadenceSettings from './bottle/CadenceSettings';
import MetricTiles from './bottle/MetricTiles';
import AmazonSyncPanel from './bottle/AmazonSyncPanel';
import ApplicationLog from './bottle/ApplicationLog';

export default function BottleTracker({ state, setState, onOpenReorder, onToast }) {
  const stats = computeBottleStats(state);

  const patch = (changes, sound = true) => {
    if (sound) soundManager.playClick();
    setState((prev) => ({ ...prev, ...changes }));
  };

  const logApplication = () => {
    if (state.currentMl <= 0) {
      soundManager.playWarning();
      onToast({ type: 'danger', title: 'Bottle is Empty!', message: 'Your 50ml bottle has run out. Please reorder to keep your underarm barrier protected.' });
      return;
    }
    const next = applyLog(state);
    setState(next);

    if (next.currentMl <= CRITICAL_ML) {
      soundManager.playWarning();
      onToast({
        type: 'warning',
        title: 'Bottle Running Low!',
        message: `Only ${next.currentMl} ml left (~${Math.floor(next.currentMl / stats.dailyMlBurn)} days). Reorder now to prevent routine disruption.`
      });
    } else {
      soundManager.playClick();
      onToast({ type: 'success', title: 'Application Logged', message: `-${stats.mlPerApplication} ml logged. ${next.currentMl} ml remaining in your 50ml bottle.` });
    }
  };

  const undoLastLog = () => {
    if (state.logs.length === 0) return;
    soundManager.playClick();
    setState(undoLog);
    onToast({ type: 'info', title: 'Log Undone', message: `Restored +${state.logs[0].amountMl} ml back to bottle.` });
  };

  const startNewBottle = () => {
    soundManager.playSuccess();
    confetti({ particleCount: 50, spread: 50 });
    patch({ currentMl: BOTTLE_VOLUME_ML }, false);
    onToast({ type: 'success', title: 'New Bottle Started!', message: 'Reset to 50ml fresh bottle. Ready to track daily applications.' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <HeroBanner icon={Droplet} badge="Smart 50ml Depletion Algorithm" title="Usage & Refill Depletion Tracker">
        Never let your 8-week pigmentation progress get derailed by a sudden empty roll-on bottle. Track daily swipes and synchronize your delivery cycle with Amazon Subscribe & Save.
      </HeroBanner>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <BottleCard
            currentMl={state.currentMl}
            stats={stats}
            canUndo={state.logs.length > 0}
            onLog={logApplication}
            onUndo={undoLastLog}
            onNewBottle={startNewBottle}
            onCalibrate={(ml) => patch({ currentMl: ml }, false)}
          />
          <CadenceSettings
            swipesPerUse={state.swipesPerUse}
            frequencyPerDay={state.frequencyPerDay}
            mlPerApplication={stats.mlPerApplication}
            onChange={patch}
          />
        </div>

        <div className="lg:col-span-7 space-y-6">
          <MetricTiles stats={stats} />
          <AmazonSyncPanel
            stats={stats}
            amazonCycleDays={state.amazonCycleDays}
            onCycleChange={(days) => patch({ amazonCycleDays: days })}
            onOpenReorder={() => {
              soundManager.playSuccess();
              onOpenReorder();
            }}
          />
          <ApplicationLog logs={state.logs} />
        </div>
      </div>
    </div>
  );
}
