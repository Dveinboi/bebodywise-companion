import { describe, it, expect } from 'vitest';
import {
  mlPerApplication,
  daysRemaining,
  bottleHealth,
  fillPercentage,
  computeBottleStats,
  amazonCycleAnalysis,
  applyLog,
  undoLog
} from '../bottleMath';

describe('mlPerApplication', () => {
  it('maps swipe settings to ml', () => {
    expect(mlPerApplication(1)).toBe(0.22);
    expect(mlPerApplication(2)).toBe(0.35);
    expect(mlPerApplication(3)).toBe(0.5);
  });
  it('clamps out-of-range values', () => {
    expect(mlPerApplication(0)).toBe(0.22);
    expect(mlPerApplication(7)).toBe(0.5);
  });
});

describe('daysRemaining', () => {
  it('divides volume by daily burn', () => {
    expect(daysRemaining(35, 2, 1)).toBe(100);
    expect(daysRemaining(35, 2, 2)).toBe(50);
  });
  it('returns 999 when burn is zero', () => {
    expect(daysRemaining(35, 2, 0)).toBe(999);
  });
});

describe('bottleHealth / fillPercentage', () => {
  it('classifies thresholds', () => {
    expect(bottleHealth(7)).toBe('critical');
    expect(bottleHealth(15)).toBe('low');
    expect(bottleHealth(15.1)).toBe('healthy');
  });
  it('clamps fill percentage', () => {
    expect(fillPercentage(25)).toBe(50);
    expect(fillPercentage(-5)).toBe(0);
    expect(fillPercentage(80)).toBe(100);
  });
});

describe('computeBottleStats', () => {
  it('projects the empty date', () => {
    const now = new Date(2026, 0, 1);
    const stats = computeBottleStats({ currentMl: 3.5, swipesPerUse: 2, frequencyPerDay: 1 }, now);
    expect(stats.daysRemaining).toBe(10);
    expect(stats.applicationsRemaining).toBe(10);
    expect(stats.projectedEmptyDate.getDate()).toBe(11);
    expect(stats.health).toBe('critical');
  });
});

describe('amazonCycleAnalysis', () => {
  it('flags stockout when bottle runs out first', () => {
    const a = amazonCycleAnalysis(40, 60);
    expect(a.status).toBe('stockout');
    expect(a.shortfallDays).toBe(20);
    expect(a.recommendedCycle).toBe(40);
  });
  it('flags overstock above 25 surplus days', () => {
    const a = amazonCycleAnalysis(100, 60);
    expect(a.status).toBe('overstock');
    expect(a.excessDays).toBe(40);
  });
  it('reports aligned within tolerance', () => {
    expect(amazonCycleAnalysis(70, 60).status).toBe('aligned');
  });
  it('clamps recommended cycle to 20-90', () => {
    expect(amazonCycleAnalysis(3, 30).recommendedCycle).toBe(20);
    expect(amazonCycleAnalysis(500, 90).recommendedCycle).toBe(90);
  });
});

describe('applyLog / undoLog', () => {
  const base = { currentMl: 10, swipesPerUse: 2, frequencyPerDay: 1, logs: [] };

  it('deducts one application and prepends a log', () => {
    const next = applyLog(base, new Date(2026, 0, 1));
    expect(next.currentMl).toBe(9.65);
    expect(next.logs).toHaveLength(1);
    expect(next.logs[0].amountMl).toBe(0.35);
  });
  it('never goes below zero', () => {
    expect(applyLog({ ...base, currentMl: 0.1 }).currentMl).toBe(0);
  });
  it('keeps at most 15 logs', () => {
    const logs = Array.from({ length: 20 }, (_, i) => ({ id: i, amountMl: 0.35 }));
    expect(applyLog({ ...base, logs }).logs).toHaveLength(15);
  });
  it('undo restores the last amount', () => {
    const logged = applyLog(base);
    expect(undoLog(logged)).toMatchObject({ currentMl: 10, logs: [] });
  });
  it('undo on empty log is a no-op', () => {
    expect(undoLog(base)).toBe(base);
  });
});
