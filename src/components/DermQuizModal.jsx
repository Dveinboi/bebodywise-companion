import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { soundManager } from '../utils/soundEffects';
import { QUIZ_QUESTIONS, DEFAULT_QUIZ_ANSWERS, getRecommendations, cadenceLabel } from '../lib/dermQuiz';
import ModalShell from './common/ModalShell';
import QuizQuestion from './quiz/QuizQuestion';
import QuizResults from './quiz/QuizResults';

export default function DermQuizModal({ isOpen, onClose, onApplyCustomCadence, onToast }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(DEFAULT_QUIZ_ANSWERS);

  if (!isOpen) return null;

  const isResults = step >= QUIZ_QUESTIONS.length;
  const rec = getRecommendations(answers);

  const handleSelect = (optId) => {
    soundManager.playClick();
    setAnswers((prev) => ({ ...prev, [QUIZ_QUESTIONS[step].id]: optId }));
    setStep(step + 1);
  };

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
      message: `Updated to ${rec.swipes} swipe(s) ${cadenceLabel(rec.frequency).toLowerCase()} for your skin profile.`
    });
    onClose();
  };

  return (
    <ModalShell>
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
          aria-label="Close"
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {isResults ? (
          <QuizResults answers={answers} rec={rec} onApply={applyRecommendations} onRetake={() => setStep(0)} />
        ) : (
          <QuizQuestion
            question={QUIZ_QUESTIONS[step]}
            index={step}
            total={QUIZ_QUESTIONS.length}
            selectedId={answers[QUIZ_QUESTIONS[step].id]}
            onSelect={handleSelect}
            onBack={() => setStep(step - 1)}
          />
        )}
      </div>
    </ModalShell>
  );
}
