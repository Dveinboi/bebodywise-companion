import { hoursAgoInput } from './dateUtils';

export function groomingStateFor({ methodId, sensitivityId, symptoms, hoursAgo }, now = Date.now()) {
  return {
    methodId,
    sensitivityId,
    symptoms,
    groomDate: hoursAgoInput(hoursAgo, now),
    groomTimePreset: hoursAgo
  };
}

export const defaultGroomingState = (now) =>
  groomingStateFor({ methodId: 'waxing', sensitivityId: 'sensitive', symptoms: ['redness'], hoursAgo: 4 }, now);

export const defaultBottleState = () => ({
  currentMl: 34.5,
  swipesPerUse: 2,
  frequencyPerDay: 1,
  amazonCycleDays: 60,
  logs: [
    { id: 1, date: 'Nov 6, 09:30 AM', amountMl: 0.35, remainingMl: 34.5, swipes: 2 },
    { id: 2, date: 'Nov 5, 08:45 AM', amountMl: 0.35, remainingMl: 34.85, swipes: 2 },
    { id: 3, date: 'Nov 4, 09:10 AM', amountMl: 0.35, remainingMl: 35.2, swipes: 2 }
  ]
});
