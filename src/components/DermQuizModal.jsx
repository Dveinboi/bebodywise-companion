import React, { useState } from 'react';
import { 
  Sparkles, X, Check, ArrowRight, ShieldCheck, 
  RotateCcw, Sliders, HeartPulse, UserCheck
} from 'lucide-react';
import { soundManager } from '../utils/soundEffects';

export default function DermQuizModal({ isOpen, onClose, onApplyCustomCadence, onToast }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    skinType: 'normal',
    hairRemoval: 'shaving',
    primaryGoal: 'both',
    weather: 'dry'
  });

  if (!isOpen) return null;

  const questions = [
    {
      id: 'skinType',
      title: 'How reactive is your underarm skin?',
      subtitle: 'Determines skin barrier recovery buffers & acid concentration tolerance',
      options: [
        { id: 'resilient', label: 'Resilient / Normal', desc: 'Rarely stings with deodorants or new body washes' },
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

  const currentQ = questions[step];

  const handleSelectOption = (optId) => {
    soundManager.playClick();
    setAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // Results step
    }
  };

  const getRecommendations = () => {
    let swipes = 2;
    let frequency = 1;
    let method = answers.hairRemoval === 'none' ? 'trimming' : answers.hairRemoval;
    let sensitivity = answers.skinType;
    let advice = [];

    if (answers.skinType === 'reactive') {
      swipes = 1;
      frequency = 1;
      advice.push("Start with 1 glide 3 times per week, then graduate to daily usage after 14 days.");
    } else {
      swipes = 2;
      frequency = answers.primaryGoal === 'odor' ? 1 : 1;
    }

    if (answers.weather === 'dry') {
      advice.push("Always apply on bone-dry skin and seal with 5% Niacinamide or Ceramide lotion (Moisture Sandwich).");
    }

    if (answers.hairRemoval === 'waxing') {
      advice.push("Mandatory 36-hour buffer post-wax before resuming underarm roll-on.");
    } else if (answers.hairRemoval === 'shaving') {
      advice.push("Allow 20-hour buffer post-shave to avoid razor sting.");
    }

    return { swipes, frequency, method, sensitivity, advice };
  };

  const rec = getRecommendations();

  const applyRecommendations = () => {
    soundManager.playSuccess();
    onApplyCustomCadence({
      swipesPerUse: rec.swipes,
      frequencyPerDay: rec.frequency,
      methodId: rec.method,
      sensitivityId: rec.sensitivity
    });
    onToast({
      type: 'success',
      title: 'Personalized Cadence Applied!',
      message: `Updated to ${rec.swipes} swipe(s) ${rec.frequency === 1 ? 'once daily' : 'twice daily'} for your skin profile.`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#091117] border border-[#1A2F3D] rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1A2F3D]/80 flex items-center justify-between bg-[#0A141A]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-[#00C2A8]/15 border border-[#00C2A8]/30 flex items-center justify-center text-[#00C2A8]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Underarm Dermatological Diagnostic</h3>
              <p className="text-[11px] text-slate-400">Customized Be Bodywise routine generator</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Stepper or Results */}
        <div className="p-6 space-y-6">
          {step < questions.length ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Question {step + 1} of {questions.length}</span>
                <span className="font-mono text-[#00C2A8] font-bold">
                  {Math.round(((step) / questions.length) * 100)}% Complete
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-white leading-snug">{currentQ.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{currentQ.subtitle}</p>
              </div>

              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-[#00C2A8]/15 border-[#00C2A8] text-white shadow-md'
                          : 'bg-[#0A1218] border-[#182B37] text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00C2A8]" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 pt-2"
                >
                  ← Previous Question
                </button>
              )}
            </div>
          ) : (
            /* Results Step */
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#00C2A8]/10 border border-[#00C2A8]/30 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#00C2A8]/20 text-[#00C2A8] uppercase tracking-wider">
                  Diagnostic Result
                </span>
                <h4 className="text-base font-bold text-white">
                  Your Custom Be Bodywise Protocol
                </h4>
                <p className="text-xs text-slate-300">
                  Based on your {answers.skinType} skin profile and {answers.hairRemoval} grooming habits:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0C171F] border border-[#1A2E3B]">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Recommended Swipes</span>
                  <span className="text-lg font-black text-white">{rec.swipes} swipe(s)</span>
                  <span className="text-[10px] text-slate-500 block">per underarm</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0C171F] border border-[#1A2E3B]">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Application Cadence</span>
                  <span className="text-lg font-black text-[#00C2A8]">{rec.frequency === 1 ? 'Once Daily' : 'Twice Daily'}</span>
                  <span className="text-[10px] text-slate-500 block">morning or night</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                  Dermatologist Directives:
                </span>
                {rec.advice.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#0A1318] border border-[#172733] text-xs text-slate-300 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00C2A8] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={applyRecommendations}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#00C2A8] to-[#009682] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg shadow-[#00C2A8]/20 hover:opacity-95 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Apply Settings to Tracker</span>
                </button>
                <button
                  onClick={() => setStep(0)}
                  className="py-3 px-3 rounded-xl bg-[#0E1B22] border border-[#1A2F3D] text-slate-400 hover:text-white transition-colors"
                  title="Retake Diagnostic"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
