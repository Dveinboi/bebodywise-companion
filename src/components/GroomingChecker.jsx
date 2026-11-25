import { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/soundEffects';
import { generateIcsCalendarEvent } from '../utils/icsHelper';
import { computeRecovery, findMethod } from '../lib/groomingRecovery';
import { hoursAgoInput, formatShortDayTime } from '../lib/dateUtils';
import HeroBanner from './common/HeroBanner';
import { MethodSelector, SensitivitySelector, SymptomChecklist, GroomTimePicker } from './grooming/GroomingInputs';
import SafetyStatusPanel from './grooming/SafetyStatusPanel';
import FirstAidCard from './grooming/FirstAidCard';

function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}

export default function GroomingChecker({ state, setState, onToast }) {
  const now = useNow();
  const [reminderScheduled, setReminderScheduled] = useState(false);
  const recovery = computeRecovery(state, now);
  const method = findMethod(state.methodId);

  const update = (changes) => {
    soundManager.playClick();
    setState((prev) => ({ ...prev, ...changes }));
  };

  const toggleSymptom = (id) => {
    soundManager.playClick();
    setState((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(id) ? prev.symptoms.filter((s) => s !== id) : [...prev.symptoms, id]
    }));
  };

  const scheduleReminder = () => {
    soundManager.playSuccess();
    setReminderScheduled(true);

    if (recovery.phase === 'safe') {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      onToast({ type: 'success', title: 'Skin Barrier Ready!', message: 'Your skin is already in the safe zone. You can apply the roll-on now!' });
      return;
    }
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
    onToast({ type: 'info', title: 'Smart Reminder Set', message: `We'll remind you on ${formatShortDayTime(recovery.safeAt)}.` });
  };

  const exportToCalendar = () => {
    soundManager.playClick();
    generateIcsCalendarEvent({
      title: 'Be Bodywise Roll-On: Skin Barrier Safe Window',
      description: `Your underarm skin barrier is fully re-epithelialized post-${method.name.toLowerCase()}. Safe to apply Be Bodywise roll-on without stinging!`,
      startDate: recovery.safeAt,
      durationMinutes: 15
    });
    onToast({ type: 'success', title: 'Calendar File Downloaded', message: 'iCalendar (.ics) ready. Open to sync with Google / Apple / Outlook calendar.' });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <HeroBanner icon={ShieldAlert} badge="Anti-Sting Skin Barrier Protocol" title="Safe-Grooming Timing Checker">
        Be Bodywise Underarm Roll-on contains active deodorizing and tone-evening ingredients. Applying on freshly shaved or waxed skin causes acute stinging and irritation. Check precisely when your stratum corneum is healed.
      </HeroBanner>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <MethodSelector methodId={state.methodId} baseHours={method.baseHours} onSelect={(id) => update({ methodId: id })} />
          <SensitivitySelector sensitivityId={state.sensitivityId} onSelect={(id) => update({ sensitivityId: id })} />
          <SymptomChecklist symptoms={state.symptoms} onToggle={toggleSymptom} />
          <GroomTimePicker
            groomDate={state.groomDate}
            groomTimePreset={state.groomTimePreset}
            onPreset={(hours) => update({ groomDate: hoursAgoInput(hours), groomTimePreset: hours })}
            onCustom={(val) => setState((prev) => ({ ...prev, groomDate: val, groomTimePreset: 'custom' }))}
          />
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <SafetyStatusPanel
            recovery={recovery}
            reminderScheduled={reminderScheduled}
            onReminder={scheduleReminder}
            onExportCalendar={exportToCalendar}
          />
          <FirstAidCard totalHours={recovery.totalHours} />
        </div>
      </div>
    </div>
  );
}
