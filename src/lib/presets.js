import { groomingStateFor, defaultGroomingState, defaultBottleState } from './defaultState';

/**
 * Demo scenarios. Each returns the state changes to apply plus the toast to show.
 * `prev` holds the current { bottleState } so presets can patch it.
 */
export const PRESETS = {
  waxed_recent: () => ({
    groomingState: groomingStateFor({ methodId: 'waxing', sensitivityId: 'sensitive', symptoms: ['redness'], hoursAgo: 2 }),
    activeTab: 'grooming',
    toast: { type: 'danger', title: 'Scenario: Just Waxed 2 hrs ago', message: 'High stinging hazard simulated. Notice the countdown meter and warning banner.' }
  }),
  safe_ready: () => ({
    groomingState: groomingStateFor({ methodId: 'shaving', sensitivityId: 'normal', symptoms: [], hoursAgo: 48 }),
    activeTab: 'grooming',
    toast: { type: 'success', title: 'Scenario: Fully Restored Barrier', message: '100% healed stratum corneum. Safe to apply roll-on immediately!' }
  }),
  bottle_low: (prev) => ({
    bottleState: { ...prev.bottleState, currentMl: 6.8, amazonCycleDays: 60 },
    activeTab: 'bottle',
    toast: { type: 'warning', title: 'Scenario: Bottle Low Alert (14% left)', message: 'Depletion warning triggered. Amazon 60-day mismatch highlighted!' }
  }),
  routine_week6: () => ({
    selectedWeekIndex: 2,
    activeTab: 'routine',
    toast: { type: 'info', title: 'Scenario: Week 5-6 Melanin Fading', message: 'Navigated to Peak Melanin Dispersion phase in the 8-Week Timeline.' }
  }),
  reset: () => ({
    groomingState: defaultGroomingState(),
    bottleState: defaultBottleState(),
    selectedWeekIndex: 0,
    toast: { type: 'info', title: 'Reset to Defaults', message: 'All application data and timers have been reset.' }
  })
};
