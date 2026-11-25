export const QUIZ_QUESTIONS = [
  {
    id: 'skinType',
    title: 'How reactive is your underarm skin?',
    subtitle: 'Determines skin barrier recovery buffers & acid concentration tolerance',
    options: [
      { id: 'normal', label: 'Resilient / Normal', desc: 'Rarely stings with deodorants or new body washes' },
      { id: 'sensitive', label: 'Sensitive Skin', desc: 'Prone to temporary redness after shaving or hot showers' },
      { id: 'reactive', label: 'Highly Reactive / Eczema-prone', desc: 'Easily irritated, burns with alcohol perfumes' }
    ]
  },
  {
    id: 'hairRemoval',
    title: 'How do you groom your underarm hair?',
    subtitle: 'Determines blade contact and stratum corneum disruption',
    options: [
      { id: 'waxing', label: 'Waxing (Hot or Cold Strips)', desc: 'Roots pulled out, top epidermal layer partially abraded' },
      { id: 'shaving', label: 'Razor Shaving with Blade', desc: 'Blade friction leaves microscopic surface nicks' },
      { id: 'trimming', label: 'Electric Trimmer (Guard on)', desc: 'Leaves 0.5mm stubble, no razor blade contact' },
      { id: 'none', label: 'No Hair Removal / Natural', desc: 'Zero grooming abrasion on skin surface' }
    ]
  },
  {
    id: 'primaryGoal',
    title: 'What is your primary treatment goal?',
    subtitle: 'Helps balance odor neutralisation vs hyperpigmentation fading',
    options: [
      { id: 'odor', label: 'All-Day Odor Elimination', desc: 'Focus on lowering pH to stop bacteria without aluminum' },
      { id: 'pigment', label: 'Dark Patch & Strawberry Skin Fading', desc: 'Accelerate Lactic & Mandelic acid cellular exfoliation' },
      { id: 'both', label: 'Both Odor Control & Brightening', desc: 'Comprehensive daily dermatologist-recommended protocol' }
    ]
  },
  {
    id: 'weather',
    title: 'What is your current climate / season?',
    subtitle: 'Configures whether to activate the Winter Moisture Sandwich protocol',
    options: [
      { id: 'dry', label: 'Dry Air / Winter Weather', desc: 'Low humidity, skin feels tight or parched easily' },
      { id: 'humid', label: 'Humid / Summer Weather', desc: 'High perspiration, natural skin hydration' }
    ]
  }
];

export const DEFAULT_QUIZ_ANSWERS = {
  skinType: 'normal',
  hairRemoval: 'shaving',
  primaryGoal: 'both',
  weather: 'dry'
};

export const cadenceLabel = (frequency) => (frequency === 1 ? 'Once Daily' : 'Twice Daily');

const GROOMING_ADVICE = {
  waxing: 'Mandatory 36-hour buffer post-wax before resuming underarm roll-on.',
  shaving: 'Allow 20-hour buffer post-shave to avoid razor sting.'
};

/** Map quiz answers to a recommended application cadence and advice. */
export function getRecommendations(answers) {
  const isReactive = answers.skinType === 'reactive';
  const advice = [];

  if (isReactive) {
    advice.push('Start with 1 glide 3 times per week, then graduate to daily usage after 14 days.');
  }
  if (answers.weather === 'dry') {
    advice.push('Always apply on bone-dry skin and seal with 5% Niacinamide or Ceramide lotion (Moisture Sandwich).');
  }
  if (GROOMING_ADVICE[answers.hairRemoval]) {
    advice.push(GROOMING_ADVICE[answers.hairRemoval]);
  }

  return {
    swipes: isReactive ? 1 : 2,
    frequency: 1,
    method: answers.hairRemoval === 'none' ? 'trimming' : answers.hairRemoval,
    sensitivity: answers.skinType,
    advice
  };
}
