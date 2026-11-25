export const BOTTLE_VOLUME_ML = 50;
export const CRITICAL_ML = 7; // ~14%
export const LOW_ML = 15; // ~30%

const ML_PER_SWIPE_SETTING = { 1: 0.22, 2: 0.35, 3: 0.5 };

/** ml used per application for a given swipes-per-underarm setting (3 = "3+"). */
export function mlPerApplication(swipesPerUse) {
  return ML_PER_SWIPE_SETTING[Math.min(3, Math.max(1, swipesPerUse))];
}

export function dailyBurnMl(swipesPerUse, frequencyPerDay) {
  return mlPerApplication(swipesPerUse) * frequencyPerDay;
}

export function daysRemaining(currentMl, swipesPerUse, frequencyPerDay) {
  const burn = dailyBurnMl(swipesPerUse, frequencyPerDay);
  return burn > 0 ? Math.floor(currentMl / burn) : 999;
}

export function bottleHealth(currentMl) {
  if (currentMl <= CRITICAL_ML) return 'critical';
  if (currentMl <= LOW_ML) return 'low';
  return 'healthy';
}

export function fillPercentage(currentMl) {
  return Math.min(100, Math.max(0, Math.round((currentMl / BOTTLE_VOLUME_ML) * 100)));
}

/** Everything the tracker UI derives from the bottle state. */
export function computeBottleStats({ currentMl, swipesPerUse, frequencyPerDay }, now = new Date()) {
  const perApp = mlPerApplication(swipesPerUse);
  const burn = dailyBurnMl(swipesPerUse, frequencyPerDay);
  const days = daysRemaining(currentMl, swipesPerUse, frequencyPerDay);
  const emptyDate = new Date(now);
  emptyDate.setDate(emptyDate.getDate() + days);

  return {
    mlPerApplication: perApp,
    dailyMlBurn: burn,
    daysRemaining: days,
    applicationsRemaining: perApp > 0 ? Math.floor(currentMl / perApp) : 0,
    projectedEmptyDate: emptyDate,
    fillPercentage: fillPercentage(currentMl),
    health: bottleHealth(currentMl)
  };
}

/**
 * Compare bottle longevity with the Amazon delivery cycle.
 * status: 'stockout' (runs out first), 'overstock' (>25 days surplus), or 'aligned'.
 */
export function amazonCycleAnalysis(days, amazonCycleDays) {
  const surplus = days - amazonCycleDays;
  let status = 'aligned';
  if (surplus < 0) status = 'stockout';
  else if (surplus > 25) status = 'overstock';

  return {
    status,
    shortfallDays: Math.max(0, -surplus),
    excessDays: Math.max(0, surplus),
    recommendedCycle: Math.max(20, Math.min(90, Math.round(days / 5) * 5))
  };
}

/** Returns the new state after logging one application (caller checks for empty bottle). */
export function applyLog(state, now = new Date()) {
  const amount = mlPerApplication(state.swipesPerUse);
  const newMl = Math.max(0, Number((state.currentMl - amount).toFixed(2)));
  const entry = {
    id: now.getTime(),
    date: now.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    amountMl: amount,
    remainingMl: newMl,
    swipes: state.swipesPerUse
  };
  return { ...state, currentMl: newMl, logs: [entry, ...state.logs.slice(0, 14)] };
}

/** Reverts the most recent log entry. */
export function undoLog(state) {
  if (state.logs.length === 0) return state;
  const [last, ...rest] = state.logs;
  return {
    ...state,
    currentMl: Math.min(BOTTLE_VOLUME_ML, Number((state.currentMl + last.amountMl).toFixed(2))),
    logs: rest
  };
}
