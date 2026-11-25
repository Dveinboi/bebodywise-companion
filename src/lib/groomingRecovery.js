import { GROOMING_METHODS, SENSITIVITY_LEVELS, POST_GROOM_SYMPTOMS } from '../data/bodywiseData';

const HOUR_MS = 60 * 60 * 1000;

export function findMethod(methodId) {
  return GROOMING_METHODS.find((m) => m.id === methodId) || GROOMING_METHODS[0];
}

export function findSensitivity(sensitivityId) {
  return SENSITIVITY_LEVELS.find((s) => s.id === sensitivityId) || SENSITIVITY_LEVELS[0];
}

export function requiredRecoveryHours(methodId, sensitivityId, symptoms) {
  const symptomHours = symptoms.reduce((acc, id) => {
    const sym = POST_GROOM_SYMPTOMS.find((s) => s.id === id);
    return acc + (sym ? sym.addedHours : 0);
  }, 0);
  return Math.round(findMethod(methodId).baseHours * findSensitivity(sensitivityId).multiplier + symptomHours);
}

/**
 * Status of skin-barrier recovery at time `now`.
 * phase: 'unsafe' (<75%), 'approaching' (>=75%), or 'safe' (complete).
 */
export function computeRecovery({ methodId, sensitivityId, symptoms, groomDate }, now = Date.now()) {
  const totalHours = requiredRecoveryHours(methodId, sensitivityId, symptoms);
  const groomTs = new Date(groomDate).getTime();
  const elapsedMs = Math.max(0, now - groomTs);
  const remainingMs = Math.max(0, totalHours * HOUR_MS - elapsedMs);
  const percent = totalHours > 0
    ? Math.min(100, Math.max(0, Math.round((elapsedMs / HOUR_MS / totalHours) * 100)))
    : 100;

  let phase = 'unsafe';
  if (remainingMs <= 0) phase = 'safe';
  else if (percent >= 75) phase = 'approaching';

  return {
    totalHours,
    remainingMs,
    percent,
    phase,
    safeAt: new Date(groomTs + totalHours * HOUR_MS),
    countdown: {
      hours: Math.floor(remainingMs / HOUR_MS),
      minutes: Math.floor((remainingMs % HOUR_MS) / 60000),
      seconds: Math.floor((remainingMs % 60000) / 1000)
    }
  };
}
