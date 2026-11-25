import { describe, it, expect } from 'vitest';
import { requiredRecoveryHours, computeRecovery } from '../groomingRecovery';
import { toLocalDateTimeInput, hoursAgoInput } from '../dateUtils';

const HOUR = 3600 * 1000;

describe('requiredRecoveryHours', () => {
  it('uses base hours for normal skin with no symptoms', () => {
    expect(requiredRecoveryHours('shaving', 'normal', [])).toBe(20);
  });
  it('applies sensitivity multiplier and symptom buffers', () => {
    // waxing 36h * 1.3 = 46.8 + redness 12 = 58.8 -> 59
    expect(requiredRecoveryHours('waxing', 'sensitive', ['redness'])).toBe(59);
  });
  it('falls back to defaults for unknown ids', () => {
    expect(requiredRecoveryHours('bogus', 'bogus', ['bogus'])).toBe(36);
  });
});

describe('computeRecovery', () => {
  const now = new Date(2026, 5, 15, 12, 0).getTime();
  const state = (hoursAgo) => ({
    methodId: 'shaving',
    sensitivityId: 'normal',
    symptoms: [],
    groomDate: hoursAgoInput(hoursAgo, now)
  });

  it('is unsafe right after grooming', () => {
    const r = computeRecovery(state(2), now);
    expect(r.phase).toBe('unsafe');
    expect(r.percent).toBe(10);
    expect(r.countdown).toEqual({ hours: 18, minutes: 0, seconds: 0 });
  });
  it('is approaching at >=75%', () => {
    expect(computeRecovery(state(15), now).phase).toBe('approaching');
  });
  it('is safe once the window passes', () => {
    const r = computeRecovery(state(48), now);
    expect(r.phase).toBe('safe');
    expect(r.percent).toBe(100);
    expect(r.remainingMs).toBe(0);
  });
  it('computes the safe timestamp', () => {
    const r = computeRecovery(state(2), now);
    expect(r.safeAt.getTime()).toBe(now + 18 * HOUR);
  });
});

describe('dateUtils', () => {
  it('formats datetime-local values', () => {
    expect(toLocalDateTimeInput(new Date(2026, 0, 5, 9, 7))).toBe('2026-01-05T09:07');
  });
});
