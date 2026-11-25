import { describe, it, expect } from 'vitest';
import { getRecommendations, QUIZ_QUESTIONS, DEFAULT_QUIZ_ANSWERS } from '../dermQuiz';
import { SENSITIVITY_LEVELS, GROOMING_METHODS } from '../../data/bodywiseData';

describe('getRecommendations', () => {
  it('gives reactive skin a gentler cadence', () => {
    const rec = getRecommendations({ ...DEFAULT_QUIZ_ANSWERS, skinType: 'reactive' });
    expect(rec.swipes).toBe(1);
    expect(rec.frequency).toBe(1);
    expect(rec.advice[0]).toMatch(/1 glide/);
  });
  it('gives non-reactive skin the standard cadence', () => {
    const rec = getRecommendations(DEFAULT_QUIZ_ANSWERS);
    expect(rec.swipes).toBe(2);
    expect(rec.frequency).toBe(1);
  });
  it('maps "none" grooming to trimming', () => {
    expect(getRecommendations({ ...DEFAULT_QUIZ_ANSWERS, hairRemoval: 'none' }).method).toBe('trimming');
  });
  it('adds weather and grooming advice', () => {
    const rec = getRecommendations({ skinType: 'normal', hairRemoval: 'waxing', primaryGoal: 'both', weather: 'dry' });
    expect(rec.advice).toHaveLength(2);
    const humid = getRecommendations({ skinType: 'normal', hairRemoval: 'trimming', primaryGoal: 'both', weather: 'humid' });
    expect(humid.advice).toHaveLength(0);
  });
});

describe('quiz ↔ tracker id consistency', () => {
  it('every skin-type answer is a valid sensitivity level', () => {
    const ids = SENSITIVITY_LEVELS.map((s) => s.id);
    const skin = QUIZ_QUESTIONS.find((q) => q.id === 'skinType');
    skin.options.forEach((o) => expect(ids).toContain(getRecommendations({ ...DEFAULT_QUIZ_ANSWERS, skinType: o.id }).sensitivity));
  });
  it('every grooming answer maps to a valid grooming method', () => {
    const ids = GROOMING_METHODS.map((m) => m.id);
    const groom = QUIZ_QUESTIONS.find((q) => q.id === 'hairRemoval');
    groom.options.forEach((o) => expect(ids).toContain(getRecommendations({ ...DEFAULT_QUIZ_ANSWERS, hairRemoval: o.id }).method));
  });
});
